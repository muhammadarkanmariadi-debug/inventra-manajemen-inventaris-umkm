<?php

namespace App\Domain\Subscription\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Addon extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'price_monthly' => 'integer',
        'price_annual' => 'integer',
    ];

    public function tenantSubscriptions(): HasMany
    {
        return $this->hasMany(TenantAddonSubscription::class, 'addon_id', 'id');
    }
}
