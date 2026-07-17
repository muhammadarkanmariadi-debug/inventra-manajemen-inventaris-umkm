<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialCategory extends Model
{
    protected $guarded = ['id'];

    public function financialTransactions()
    {
        return $this->hasMany(FinancialTransaction::class, 'financial_category_id', 'id');
    }

    public function business()
    {
        return $this->belongsTo(Business::class, 'bussiness_id', 'id');
    }
}
