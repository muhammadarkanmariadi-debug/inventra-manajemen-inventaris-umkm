<?php

namespace App\Models;

use App\Observers\AttachBusinessId;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(AttachBusinessId::class)]
class Business extends Model
{
    protected $guarded = ['id'];

    protected $table = 'bussinesses';

    public function users()
    {
        return $this->hasMany(User::class, 'bussiness_id', 'id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'bussiness_id', 'id');
    }

    public function suppliers()
    {
        return $this->hasMany(Supplier::class, 'bussiness_id', 'id');
    }

    public function categories()
    {
        return $this->hasMany(Category::class, 'bussiness_id', 'id');
    }

    public function financialTransactions()
    {
        return $this->hasMany(FinancialTransaction::class, 'bussiness_id', 'id');
    }

    public function financialCategories()
    {
        return $this->hasMany(FinancialCategory::class, 'bussiness_id', 'id');
    }

    public function hppComponents()
    {
        return $this->hasMany(HppComponent::class, 'bussiness_id', 'id');
    }

    public function stockTransactions()
    {
        return $this->hasMany(StockTransaction::class, 'bussiness_id', 'id');
    }

    public function subscription()
    {
        return $this->hasOne(\App\Domain\Subscription\Models\TenantSubscription::class, 'bussiness_id', 'id');
    }

    public function addonSubscriptions()
    {
        return $this->hasMany(\App\Domain\Subscription\Models\TenantAddonSubscription::class, 'bussiness_id', 'id');
    }

    public function usageLogs()
    {
        return $this->hasMany(\App\Domain\Subscription\Models\UsageLog::class, 'bussiness_id', 'id');
    }

    public function hasFeature(string $featureKey): bool
    {
        $subscription = $this->subscription()->with(['plan.features'])->first();
        if ($subscription && $subscription->status === 'active' && $subscription->plan) {
            foreach ($subscription->plan->features as $feature) {
                if ($feature->feature_key === $featureKey && $feature->enabled) {
                    return true;
                }
            }
        }

        // Also check if enabled via active add-on
        return $this->hasAddon($featureKey);
    }

    public function hasAddon(string $addonSlug): bool
    {
        return $this->addonSubscriptions()
            ->where('status', 'active')
            ->whereHas('addon', function ($q) use ($addonSlug) {
                $q->where('slug', $addonSlug);
            })
            ->exists();
    }
}
