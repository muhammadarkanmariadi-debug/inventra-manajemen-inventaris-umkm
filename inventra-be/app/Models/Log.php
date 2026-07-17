<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    protected $fillable = ['message', 'categories', 'user_id', 'bussiness_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function business()
    {
        return $this->belongsTo(Business::class, 'bussiness_id', 'id');
    }
}
