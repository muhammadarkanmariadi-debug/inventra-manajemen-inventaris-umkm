<?php

namespace App\Domain\Subscription\Models;

use App\Models\Business;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UsageLog extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'value' => 'integer',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'bussiness_id', 'id');
    }
}
