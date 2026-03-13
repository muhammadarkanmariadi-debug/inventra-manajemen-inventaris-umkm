<?php

namespace App\Models;

use App\Observers\AttachBusinessId;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(AttachBusinessId::class)]
class Business extends Model
{
    protected $guarded = ['id'];

    protected $table = 'bussinesses';

    public function users()
    {
        return $this->hasMany(User::class, 'bussiness_id', 'id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'bussiness_id', 'id');
    }

    public function suppliers()
    {
        return $this->hasMany(Supplier::class, 'bussiness_id', 'id');
    }

    public function categories()
    {
        return $this->hasMany(Category::class, 'bussiness_id', 'id');
    }

    public function financialTransactions()
    {
        return $this->hasMany(FinancialTransaction::class, 'bussiness_id', 'id');
    }

    public function financialCategories()
    {
        return $this->hasMany(FinancialCategory::class, 'bussiness_id', 'id');
    }

    public function hppComponents()
    {
        return $this->hasMany(HppComponent::class, 'bussiness_id', 'id');
    }

    public function stockTransactions()
    {
        return $this->hasMany(StockTransaction::class, 'bussiness_id', 'id');
    }
}
