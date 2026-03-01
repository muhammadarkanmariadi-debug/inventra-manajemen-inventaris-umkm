<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Products;

class Categories extends Model
{
    protected $guarded = ['id'];

    public function products()
    {
        return $this->hasMany(Products::class, 'category_id', 'id');
    }
}
