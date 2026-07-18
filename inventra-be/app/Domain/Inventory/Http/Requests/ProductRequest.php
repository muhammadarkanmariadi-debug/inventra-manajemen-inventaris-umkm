<?php

namespace App\Domain\Inventory\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name'          => 'required|string|max:255',
            'image'         => 'nullable|string',
            'sku'           => 'required|string|max:255|unique:products,sku' . ($id ? ',' . $id : ''),
            'selling_price' => 'required|numeric|min:0',
            'stock'         => 'nullable|integer|min:0',
            'category_id'   => 'required|integer|exists:categories,id',
            'product_type'  => 'required|in:kuliner,barang',
            'unit'          => 'required|string|max:255',
            'expired_date'  => 'nullable|date',
        ];
    }
}
