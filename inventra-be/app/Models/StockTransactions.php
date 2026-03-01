<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockTransactions extends Model
{
    protected $guarded = ['id'];

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id', 'id');
    }

    public function bussiness()
    {
        return $this->belongsTo(Bussiness::class, 'bussiness_id', 'id');
    }
}
