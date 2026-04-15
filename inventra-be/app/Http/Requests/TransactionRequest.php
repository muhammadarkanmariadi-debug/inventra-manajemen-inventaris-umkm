<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'string', 'in:ADJUSTMENT_ADD,ADJUSTMENT_SUB'],
            'notes' => ['nullable', 'string', 'max:500'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.inventory_id' => ['required_if:type,ADJUSTMENT_SUB', 'integer', 'exists:inventories,id'],
            'items.*.product_id' => ['required_if:type,ADJUSTMENT_ADD', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
