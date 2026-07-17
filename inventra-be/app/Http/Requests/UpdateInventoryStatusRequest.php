<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInventoryStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'new_status_code' => ['required', 'string', 'exists:inventory_statuses,code'],
            'notes' => ['nullable', 'string', 'max:500'],
            'location_id' => ['nullable', 'integer', 'exists:locations,id'],
        ];
    }
}
