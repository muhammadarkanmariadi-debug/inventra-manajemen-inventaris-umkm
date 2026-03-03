<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\Suppliers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

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
            $rules = [
                'name'         => 'required|string|max:255',
                'contact_info' => 'nullable|string',
            ];

            $request->merge(['bussiness_id' => auth()->guard('api')->user()->bussiness_id]);

            $data = $this->requestService->postData(Suppliers::class, $request, $rules);

            if (!$data) {
                ApiHelper::error('Failed to create supplier', 500);
            } else {
                event(new LoggingEvent('Supplier was successfully created', 'suppliers'));
                ApiHelper::success('Supplier was successfully created', $data, 201);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function updateSupplier(Request $request, $id)
    {
        try {
            $rules = [
                'name'         => 'sometimes|string|max:255',
                'contact_info' => 'nullable|string',
                'products'     => 'nullable|array',
                'products.*'   => 'exists:products,id',
            ];

            $data = $this->requestService->updateDataById(Suppliers::class, $id, $request, $rules);

            if (!$data) {
                ApiHelper::error('Failed to update supplier', 500);
            } else {
                event(new LoggingEvent('Supplier with id ' . $id . ' updated successfully', 'suppliers'));
                ApiHelper::success('Supplier was successfully updated', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function deleteSupplier($id)
    {
        try {
            $data = $this->requestService->deleteDataById(Suppliers::class, $id);

            if (!$data) {
                ApiHelper::error('Failed to delete supplier', 500);
            } else {
                event(new LoggingEvent('Supplier with id ' . $id . ' deleted successfully', 'suppliers'));
                ApiHelper::success('Supplier was successfully deleted', null, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getAllSupplier()
    {
        try {
            $data = Cache::remember('suppliers', 7200, function () {
                return Suppliers::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)->get();
            });


            if (!$data) {
                ApiHelper::error('Failed to get suppliers', 500);
            } else {
                ApiHelper::success('Suppliers was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getSupplierById($id)
    {
        try {
            $data = Suppliers::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)->get();



            if (!$data) {
                ApiHelper::error('Supplier not found', 404);
            } else {
                ApiHelper::success('Supplier was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }
}
