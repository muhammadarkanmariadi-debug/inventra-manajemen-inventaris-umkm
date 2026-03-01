<?php

namespace App\Models;

use App\Observers\StockTransactionObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
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
