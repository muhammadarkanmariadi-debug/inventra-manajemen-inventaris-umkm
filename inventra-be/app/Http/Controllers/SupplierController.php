<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Supplier;
use App\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SupplierController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new supplier.
     */
    public function store(Request $request)
    {
        try {
            $rules = [
                'name'         => 'required|string|max:255',
                'contact_info' => 'nullable|string',
            ];

            $request->merge(['bussiness_id' => auth()->guard('api')->user()->bussiness_id]);

            $data = $this->requestService->postData(Supplier::class, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to create supplier', 500);
            }

            event(new LoggingEvent('Supplier was successfully created', 'suppliers'));

            return ApiHelper::success('Supplier was successfully created', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update a supplier by ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'name'         => 'sometimes|string|max:255',
                'contact_info' => 'nullable|string',
                'products'     => 'nullable|array',
                'products.*'   => 'exists:products,id',
            ];

            $data = $this->requestService->updateDataById(Supplier::class, $id, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to update supplier', 500);
            }

            event(new LoggingEvent('Supplier with id ' . $id . ' updated successfully', 'suppliers'));

            return ApiHelper::success('Supplier was successfully updated', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a supplier by ID.
     */
    public function destroy($id)
    {
        try {
            $data = $this->requestService->deleteDataById(Supplier::class, $id);

            if (!$data) {
                return ApiHelper::error('Failed to delete supplier', 500);
            }

            event(new LoggingEvent('Supplier with id ' . $id . ' deleted successfully', 'suppliers'));

            return ApiHelper::success('Supplier was successfully deleted', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get all suppliers.
     */
    public function index()
    {
        try {
            $data = Cache::remember('suppliers', 7200, function () {
                return Supplier::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)->get();
            });

            if ($data->isEmpty()) {
                return ApiHelper::error('No suppliers found', 404);
            }

            return ApiHelper::success('Suppliers retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a supplier by ID.
     */
    public function show($id)
    {
        try {
            $data = Supplier::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->first();

            if (!$data) {
                return ApiHelper::error('Supplier not found', 404);
            }

            return ApiHelper::success('Supplier retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
