<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinancialTransaction extends Model
{
    protected $guarded = ['id'];

    public function financialCategory()
    {
        return $this->belongsTo(FinancialCategory::class, 'financial_category_id', 'id');
    }
}
