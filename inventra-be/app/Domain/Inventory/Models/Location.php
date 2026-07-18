<?php

namespace App\Domain\Inventory\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['name', 'bussiness_id'];

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }

    public function business()
    {
        return $this->belongsTo(\App\Models\Business::class, 'bussiness_id', 'id');
    }
}
