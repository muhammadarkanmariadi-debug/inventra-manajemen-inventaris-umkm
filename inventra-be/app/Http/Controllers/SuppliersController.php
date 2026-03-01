<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\Suppliers;
use DeepCopy\f001\A;
use Illuminate\Http\Request;

class SuppliersController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function createSupplier(Request $request)
    {
        try {
            $userbussinessId = auth()->guard('api')->user()->bussiness_id;

            $rules = [
                'name' => 'required|string|max:255',
                'contact_info' => 'nullable|string',
            ];

            $request->merge(['bussiness_id' => $userbussinessId]);

            $data = $this->requestService->postData(Suppliers::class, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to create supplier', 500);
            } else {
                return ApiHelper::success('Supplier created successfully', $data, 201);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function getSuppliers(Request $request)
    {
        try {
            $userbussinessId = auth()->guard('api')->user()->bussiness_id;

            $data = Suppliers::where('bussiness_id', $userbussinessId)->get();

            if ($request->has('include')) {
                $includes = explode(',', $request->query('include'));

                if (in_array('products', $includes)) {
                    $data->load('products');
                }
            }


            return ApiHelper::success('Suppliers retrieved successfully', $data);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }


    public function updateSupplier(Request $request, $id)
    {
        try {
            $userbussinessId = auth()->guard('api')->user()->bussiness_id;

            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'contact_info' => 'nullable|string',
                'products' => 'nullable|array',
                'products.*' => 'exists:products,id',
            ];

            $supplier = Suppliers::where('id', $id)->where('bussiness_id', $userbussinessId)->first();

            if (!$supplier) {
                return ApiHelper::error('Supplier not found', 404);
            }

            $data = $this->requestService->updateDataById(Suppliers::class, $id, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to update supplier', 500);
            } else {
                return ApiHelper::success('Supplier updated successfully', $data);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }


    public function deleteSupplier($id)
    {
        try {
            $userbussinessId = auth()->guard('api')->user()->bussiness_id;

            $supplier = Suppliers::where('id', $id)->where('bussiness_id', $userbussinessId)->first();

            if (!$supplier) {
                return ApiHelper::error('Supplier not found', 404);
            }

            $data = $this->requestService->deleteDataById(Suppliers::class, $id);

            if (!$data) {
                return ApiHelper::error('Failed to delete supplier', 500);
            } else {
                return ApiHelper::success('Supplier deleted successfully');
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function getSupplier($id)
    {
        try {
            $userbussinessId = auth()->guard('api')->user()->bussiness_id;

            $supplier = Suppliers::where('id', $id)->where('bussiness_id', $userbussinessId)->first();

            if (!$supplier) {
                return ApiHelper::error('Supplier not found', 404);
            }

            return ApiHelper::success('Supplier retrieved successfully', $supplier);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }
}
