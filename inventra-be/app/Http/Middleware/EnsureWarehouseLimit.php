<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Domain\Inventory\Models\Location;
use App\Helpers\ApiHelper;

class EnsureWarehouseLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->guard('api')->user();

        if (!$user || !$user->bussiness_id) {
            return ApiHelper::error('Unauthorized or business not found.', 401);
        }

        if ($user->role === 'SUPERADMIN') {
            return $next($request);
        }

        $business = $user->business;
        $subscription = $business ? $business->subscription()->with('plan')->first() : null;
        
        $maxWarehouses = 1; // default Starter limit if no active subscription
        if ($subscription && $subscription->status === 'active' && $subscription->plan) {
            $maxWarehouses = $subscription->plan->max_warehouses;
        }

        // Count current locations owned by this business
        $currentCount = Location::where('bussiness_id', $user->bussiness_id)->count();

        if ($currentCount >= $maxWarehouses) {
            return response()->json([
                'status' => false,
                'message' => "Batas maksimal gudang/lokasi ({$maxWarehouses}) untuk paket langganan Anda telah tercapai. Silakan upgrade paket untuk menambah gudang baru.",
                'error_code' => 'WAREHOUSE_LIMIT_REACHED',
                'current_count' => $currentCount,
                'max_warehouses' => $maxWarehouses,
            ], 403);
        }

        return $next($request);
    }
}
