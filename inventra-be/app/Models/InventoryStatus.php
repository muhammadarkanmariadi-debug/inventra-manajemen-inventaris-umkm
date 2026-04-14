<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryStatus extends Model
{
    protected $fillable = [
        'code',
        'name',
        'is_usable',
        'description',
    ];

    protected $casts = [
        'is_usable' => 'boolean',
    ];

    public function inventories(): HasMany
    {
        return $this->hasMany(Inventory::class, 'current_status_id');
    }
}
