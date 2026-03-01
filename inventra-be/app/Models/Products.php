<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    protected $guarded = ['id'];


    public function category()
    {
        return $this->belongsTo(Categories::class, 'category_id', 'id');
    }


    public function hppComponents()
    {
        return $this->hasMany(HppComponents::class, 'product_id', 'id');
    }

    public function bussiness()
    {
        return $this->belongsTo(Bussiness::class, 'bussiness_id', 'id');
    }

    public function stockTransactions()
    {
        return $this->hasMany(StockTransactions::class, 'product_id', 'id');
    }

    public function sales()
    {
        return $this->hasMany(Sales::class, 'product_id', 'id');
    }

    public function supplier()
    {
        return $this->belongsToMany(Suppliers::class, 'product_suppliers', 'product_id', 'supplier_id');
    }
}
