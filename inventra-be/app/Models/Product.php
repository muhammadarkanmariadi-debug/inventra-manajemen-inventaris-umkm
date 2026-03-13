<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = ['id'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function hppComponents()
    {
        return $this->hasMany(HppComponent::class, 'product_id', 'id');
    }

    public function business()
    {
        return $this->belongsTo(Business::class, 'bussiness_id', 'id');
    }

    public function stockTransactions()
    {
        return $this->hasMany(StockTransaction::class, 'product_id', 'id');
    }

    public function sales()
    {
        return $this->hasMany(Sale::class, 'product_id', 'id');
    }

    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 'product_suppliers', 'product_id', 'supplier_id');
    }
}
