<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function generatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'bussiness_id');
    }
}
