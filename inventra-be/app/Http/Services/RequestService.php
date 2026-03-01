<?php
namespace App\Http\Services;

use App\Helpers\ApiHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequestService
{
    public function postData($model, Request $request, array $rules)
    {

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }



        $data = $model::create($request->all());
        if (!$data) {
            throw new \Exception('Failed to create data', 500);
        }
        return $data;
    }

    public function updateDataById($model, $id, Request $request, array $rules)
    {
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        $data = $model::find($id);
        if (!$data) {
            throw new \Exception('Data not found', 404);
        }

        $data->update($request->all());
        return $data;
    }

    public function deleteDataById($model, $id)
    {
        $data = $model::find($id);
        if (!$data) {
            return response()->json(['message' => 'Data not found'], 404);
        }

        $data->delete();
        return response()->json(['message' => 'Data deleted successfully'], 200);
    }


}
