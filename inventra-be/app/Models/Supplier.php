<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $guarded = ['id'];

    public function business()
    {
        return $this->belongsTo(Business::class, 'bussiness_id', 'id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_supplier', 'supplier_id', 'product_id');
    }
}
