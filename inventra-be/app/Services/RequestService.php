<?php

namespace App\Services;

use App\Exceptions\ApiException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequestService
{
    public function postData(string $model, Request $request, array $rules)
    {
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        $data = $model::create($request->all());

        if (!$data) {
            throw new ApiException('Failed to create data', 500);
        }

        return $data;
    }

    public function updateDataById(string $model, $id, Request $request, array $rules)
    {
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        $data = $model::find($id);

        if (!$data) {
            throw new ApiException('Data not found', 404);
        }

        $data->update($request->all());

        return $data;
    }

    public function deleteDataById(string $model, $id)
    {
        $data = $model::find($id);

        if (!$data) {
            throw new ApiException('Data not found', 404);
        }

        $data->delete();

        return $data;
    }
}