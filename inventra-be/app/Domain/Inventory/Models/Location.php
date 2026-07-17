<?php

namespace App\Domain\Inventory\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['name'];

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }
}
