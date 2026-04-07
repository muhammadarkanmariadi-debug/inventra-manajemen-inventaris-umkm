<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Supplier;
use App\Services\RequestService;
use Illuminate\Http\Request;

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
        $rules = [
            'name'         => 'required|string|max:255',
            'phone' =>  'nullable|string',
            'address' => 'nullable|string',
        ];

        $request->merge(['bussiness_id' => auth()->guard('api')->user()->bussiness_id]);

        $data = $this->requestService->postData(Supplier::class, $request, $rules);

        event(new LoggingEvent('Supplier was successfully created', 'suppliers'));

        return ApiHelper::success('Supplier was successfully created', $data, 201);
    }

    /**
     * Get all suppliers.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->query('items', 10);
        $data    = Supplier::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
            ->paginate($perPage);

        if ($data->isEmpty()) {
            return ApiHelper::error('No suppliers found', 404);
        }

        return ApiHelper::success('Suppliers retrieved successfully', $data, 200);
    }

    /**
     * Get a supplier by ID.
     */
    public function show($id)
    {
        $data = Supplier::where('id', $id)
            ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
            ->first();

        if (!$data) {
            return ApiHelper::error('Supplier not found', 404);
        }

        return ApiHelper::success('Supplier retrieved successfully', $data, 200);
    }

    /**
     * Update a supplier by ID.
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'name'         => 'sometimes|string|max:255',
            'phone' =>  'nullable|string',
            'address' => 'nullable|string',
            'products'     => 'nullable|array',
            'products.*'   => 'exists:products,id',
        ];

        $data = $this->requestService->updateDataById(Supplier::class, $id, $request, $rules);

        event(new LoggingEvent('Supplier with id ' . $id . ' updated successfully', 'suppliers'));

        return ApiHelper::success('Supplier was successfully updated', $data, 200);
    }

    /**
     * Delete a supplier by ID.
     */
    public function destroy($id)
    {
        $this->requestService->deleteDataById(Supplier::class, $id);

        event(new LoggingEvent('Supplier with id ' . $id . ' deleted successfully', 'suppliers'));

        return ApiHelper::success('Supplier was successfully deleted', null, 200);
    }
}
