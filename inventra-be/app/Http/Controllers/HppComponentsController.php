<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\HppComponents;
use Illuminate\Http\Request;

class HppComponentsController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function createHppComponent(Request $request)
    {
        try {
            $userbussinessId = auth()->guard('api')->user()->bussiness_id;

            $rules = [
                'name' => 'required|string|max:255',
                'product_id' => 'required|integer|exists:products,id',
                'cost' => 'required|numeric|min:0',
            ];

            $request->merge(['bussiness_id' => $userbussinessId]);

            $data = $this->requestService->postData(HppComponents::class, $request, $rules);

            if (!$data instanceof HppComponents) {
                return ApiHelper::error('Failed to create HPP Component', 500);
            } else {
                return ApiHelper::success('HPP Component created successfully', $data, 201);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }


    public function getHppComponentsByProduct($productId)
    {
        try {
            $hppComponents = HppComponents::where('product_id', $productId)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->get();

            return ApiHelper::success('HPP Components retrieved successfully', $hppComponents);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }



    public function getHppComponent($id)
    {
     try {
            $hppComponent = HppComponents::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->first();

            if (!$hppComponent) {
                return ApiHelper::error('HPP Component not found', 404);
            }

            return ApiHelper::success('HPP Component retrieved successfully', $hppComponent);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function deleteHppComponent($id)
    {
        try {
            $hppComponent = $this->requestService->deleteDataById(HppComponents::class, $id);
            return ApiHelper::success('HPP Component deleted successfully');
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function updateHppComponent(Request $request, $id)
    {
      try {
            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'product_id' => 'sometimes|required|integer|exists:products,id',
                'cost' => 'sometimes|required|numeric|min:0',
            ];

            $data = $this->requestService->updateDataById(HppComponents::class, $id, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to update HPP Component', 500);
            } else {
                return ApiHelper::success('HPP Component updated successfully', $data);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }
}
