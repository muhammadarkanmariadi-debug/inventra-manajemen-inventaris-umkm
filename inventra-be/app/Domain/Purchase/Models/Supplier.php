<?php

namespace App\Domain\Purchase\Models;

use App\Models\Business;
use App\Models\Purchase;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $table = 'suppliers';
    protected $guarded = ['id'];

    public function business()
    {
        return $this->belongsTo(Business::class, 'bussiness_id', 'id');
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class, 'supplier_id', 'id');
    }
}
