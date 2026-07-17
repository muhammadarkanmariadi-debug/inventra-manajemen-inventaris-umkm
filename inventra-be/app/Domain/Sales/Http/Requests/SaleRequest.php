<?php

namespace App\Domain\Sales\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'inventory_id'  => 'required|exists:inventories,id',
            'quantity'      => 'required|integer|min:1',
            'selling_price' => 'required|numeric|min:0',
            'buyer_name'    => 'nullable|string|max:255',
            'buyer_phone'   => 'nullable|string|max:20',
            'buyer_address' => 'nullable|string',
        ];
    }
}
