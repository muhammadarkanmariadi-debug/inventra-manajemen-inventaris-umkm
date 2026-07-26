<?php

namespace App\Domain\Subscription\Models;

use App\Models\Business;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TenantAddonSubscription extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'activated_at' => 'datetime',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'bussiness_id', 'id');
    }

    public function addon(): BelongsTo
    {
        return $this->belongsTo(Addon::class, 'addon_id', 'id');
    }
}
