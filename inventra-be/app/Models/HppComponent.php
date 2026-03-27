<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HppComponent extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    protected $table = 'hpp_components';

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
