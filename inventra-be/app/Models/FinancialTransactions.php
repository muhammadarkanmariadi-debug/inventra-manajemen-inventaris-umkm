<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialTransactions extends Model
{
    protected $guarded = ['id'];

    public function financialCategory(){
        $this->belongsTo(FinancialCategory::class, 'financial_category_id', 'id');
    }
}
