<?php

namespace App\Domain\Subscription\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Subscription\Models\Plan;
use App\Domain\Subscription\Models\Addon;
use App\Domain\Subscription\Models\TenantSubscription;
use App\Domain\Subscription\Models\TenantAddonSubscription;
use App\Domain\Inventory\Models\Location;
use App\Domain\Inventory\Models\Product;
use App\Helpers\ApiHelper;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    public function indexPlans()
    {
        try {
            $plans = Plan::with('features')->orderBy('id', 'asc')->get();
            return ApiHelper::success('Plans retrieved successfully.', $plans, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function indexAddons()
    {
        try {
            $addons = Addon::orderBy('id', 'asc')->get();
            return ApiHelper::success('Addons retrieved successfully.', $addons, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getTenantSubscription()
    {
        try {
            $user = auth()->guard('api')->user();
            if (!$user || !$user->bussiness_id) {
                return ApiHelper::error('Business not found.', 404);
            }

            $business = $user->business;
            $subscription = $business ? $business->subscription()->with(['plan.features'])->first() : null;
            
            // If no subscription exists, create or attach default Starter
            if (!$subscription) {
                $starterPlan = Plan::where('slug', 'starter')->first();
                if ($starterPlan) {
                    $subscription = TenantSubscription::create([
                        'bussiness_id' => $user->bussiness_id,
                        'plan_id' => $starterPlan->id,
                        'billing_cycle' => 'monthly',
                        'status' => 'active',
                        'current_period_start' => Carbon::now(),
                        'current_period_end' => Carbon::now()->addDays(30),
                        'warehouse_count_snapshot' => 1,
                    ]);
                    $subscription->load(['plan.features']);
                }
            }

            $addons = $business ? $business->addonSubscriptions()->with('addon')->where('status', 'active')->get() : collect();
            $warehouseCount = Location::where('bussiness_id', $user->bussiness_id)->count();
            $skuCount = Product::where('bussiness_id', $user->bussiness_id)->count();

            return ApiHelper::success('Subscription retrieved successfully.', [
                'subscription' => $subscription,
                'active_addons' => $addons,
                'usage' => [
                    'warehouse_count' => $warehouseCount,
                    'max_warehouses' => $subscription && $subscription->plan ? $subscription->plan->max_warehouses : 1,
                    'sku_count' => $skuCount,
                ]
            ], 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function upgradeSubscription(Request $request)
    {
        try {
            $request->validate([
                'plan_id' => 'required|exists:plans,id',
                'billing_cycle' => 'required|in:monthly,annual',
            ]);

            $user = auth()->guard('api')->user();
            if (!$user || !$user->bussiness_id) {
                return ApiHelper::error('Business not found.', 404);
            }

            $plan = Plan::find($request->plan_id);
            $business = $user->business;
            $subscription = $business ? $business->subscription : null;

            $periodStart = Carbon::now();
            $periodEnd = $request->billing_cycle === 'annual' 
                ? Carbon::now()->addYear() 
                : Carbon::now()->addDays(30);

            if ($subscription) {
                $subscription->update([
                    'plan_id' => $plan->id,
                    'billing_cycle' => $request->billing_cycle,
                    'status' => 'active',
                    'current_period_start' => $periodStart,
                    'current_period_end' => $periodEnd,
                    'warehouse_count_snapshot' => $plan->max_warehouses,
                ]);
            } else {
                $subscription = TenantSubscription::create([
                    'bussiness_id' => $user->bussiness_id,
                    'plan_id' => $plan->id,
                    'billing_cycle' => $request->billing_cycle,
                    'status' => 'active',
                    'current_period_start' => $periodStart,
                    'current_period_end' => $periodEnd,
                    'warehouse_count_snapshot' => $plan->max_warehouses,
                ]);
            }

            $subscription->load(['plan.features']);

            return ApiHelper::success("Berhasil mengupdate paket langganan ke {$plan->name}.", $subscription, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function toggleAddon(Request $request)
    {
        try {
            $request->validate([
                'addon_id' => 'required|exists:addons,id',
                'action' => 'required|in:activate,deactivate',
            ]);

            $user = auth()->guard('api')->user();
            if (!$user || !$user->bussiness_id) {
                return ApiHelper::error('Business not found.', 404);
            }

            $addon = Addon::find($request->addon_id);
            $subscription = TenantAddonSubscription::where('bussiness_id', $user->bussiness_id)
                ->where('addon_id', $addon->id)
                ->first();

            if ($request->action === 'activate') {
                if ($subscription) {
                    $subscription->update([
                        'status' => 'active',
                        'activated_at' => Carbon::now(),
                    ]);
                } else {
                    $subscription = TenantAddonSubscription::create([
                        'bussiness_id' => $user->bussiness_id,
                        'addon_id' => $addon->id,
                        'status' => 'active',
                        'activated_at' => Carbon::now(),
                    ]);
                }
                $message = "Add-on {$addon->name} berhasil diaktifkan.";
            } else {
                if ($subscription) {
                    $subscription->update(['status' => 'canceled']);
                }
                $message = "Add-on {$addon->name} berhasil dinonaktifkan.";
            }

            return ApiHelper::success($message, $subscription, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getUsage()
    {
        try {
            $user = auth()->guard('api')->user();
            if (!$user || !$user->bussiness_id) {
                return ApiHelper::error('Business not found.', 404);
            }

            $business = $user->business;
            $subscription = $business ? $business->subscription()->with('plan')->first() : null;
            $maxWarehouses = $subscription && $subscription->plan ? $subscription->plan->max_warehouses : 1;
            
            $warehouseCount = Location::where('bussiness_id', $user->bussiness_id)->count();
            $skuCount = Product::where('bussiness_id', $user->bussiness_id)->count();

            return ApiHelper::success('Usage statistics retrieved successfully.', [
                'warehouse_count' => $warehouseCount,
                'max_warehouses' => $maxWarehouses,
                'sku_count' => $skuCount,
                'plan_name' => $subscription && $subscription->plan ? $subscription->plan->name : 'Starter',
                'status' => $subscription ? $subscription->status : 'active',
            ], 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
