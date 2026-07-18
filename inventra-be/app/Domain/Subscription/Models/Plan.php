<?php

namespace App\Domain\Subscription\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'price_base_monthly' => 'integer',
        'price_base_annual' => 'integer',
        'max_warehouses' => 'integer',
        'is_custom_quote' => 'boolean',
    ];

    public function features(): HasMany
    {
        return $this->hasMany(PlanFeature::class, 'plan_id', 'id');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(TenantSubscription::class, 'plan_id', 'id');
    }
}
