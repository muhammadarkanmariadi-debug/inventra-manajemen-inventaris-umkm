<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class logs extends Model
{
    protected $guarded = ['id'];


    public function user(){
        $this->hasOne(User::class, 'user_id', 'id');
    }
}
