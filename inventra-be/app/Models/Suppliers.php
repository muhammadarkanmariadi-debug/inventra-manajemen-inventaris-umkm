<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Suppliers extends Model
{
    protected $guarded = ['id'];

    public function bussiness()
    {
        return $this->belongsTo(Bussiness::class, 'bussiness_id', 'id');
    }


    public function products()
    {
        return $this->belongsToMany(Products::class, 'product_supplier', 'supplier_id', 'product_id');
    }




}
