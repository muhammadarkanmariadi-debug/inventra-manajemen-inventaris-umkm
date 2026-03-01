<?php

namespace App\Models;

use App\Observers\AttachBID;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;


class Bussiness extends Model
{

    protected $guarded = ['id'];
    protected $table = 'bussinesses';



    public function users()
    {
        return $this->hasMany(User::class, 'bussiness_id', 'id');
    }

    public function products()
    {
        return $this->hasMany(Products::class, 'bussiness_id', 'id');
    }

    public function suppliers()
    {
        return $this->hasMany(Suppliers::class, 'bussiness_id', 'id');
    }

    public function categories()
    {
        return $this->hasMany(Categories::class, 'bussiness_id', 'id');
    }



    public function financialTransactions()
    {
        return $this->hasMany(FinancialTransactions::class, 'bussiness_id', 'id');
    }

    public function hppComponents()
    {
        return $this->hasMany(HppComponents::class, 'bussiness_id', 'id');
    }

    public function stockTransactions()
    {
        return $this->hasMany(StockTransactions::class, 'bussiness_id', 'id');
    }
}
