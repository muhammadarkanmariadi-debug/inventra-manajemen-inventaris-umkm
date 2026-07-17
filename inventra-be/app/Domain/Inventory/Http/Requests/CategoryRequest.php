<?php

namespace App\Domain\Inventory\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'name'        => 'required|string|max:255|unique:categories,name' . ($id ? ',' . $id : ''),
            'description' => 'nullable|string',
        ];
    }
}
