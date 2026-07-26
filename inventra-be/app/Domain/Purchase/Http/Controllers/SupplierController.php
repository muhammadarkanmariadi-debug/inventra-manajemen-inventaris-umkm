<?php

namespace App\Domain\Purchase\Http\Controllers;

use App\Domain\Purchase\Actions\CreateSupplierAction;
use App\Domain\Purchase\Actions\DeleteSupplierAction;
use App\Domain\Purchase\Actions\UpdateSupplierAction;
use App\Domain\Purchase\Http\Requests\SupplierRequest;
use App\Domain\Purchase\Models\Supplier;
use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    protected CreateSupplierAction $createAction;
    protected UpdateSupplierAction $updateAction;
    protected DeleteSupplierAction $deleteAction;

    public function __construct(
        CreateSupplierAction $createAction,
        UpdateSupplierAction $updateAction,
        DeleteSupplierAction $deleteAction
    ) {
        $this->createAction = $createAction;
        $this->updateAction = $updateAction;
        $this->deleteAction = $deleteAction;
    }

    public function store(SupplierRequest $request)
    {
        try {
            $businessId = auth()->guard('api')->user()->bussiness_id;
            $supplier = $this->createAction->execute($request->validated(), $businessId);

            return ApiHelper::success('Supplier was successfully created', $supplier, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $query   = Supplier::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->withCount('purchases');

            if ($request->filled('search')) {
                $search = $request->query('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhere('address', 'like', "%{$search}%");
                });
            }

            $allowedSorts = ['name', 'purchases_count', 'created_at', 'id'];
            $sort = $request->query('sort');
            $order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';

            if ($sort && in_array($sort, $allowedSorts, true)) {
                $query->orderBy($sort, $order);
            } else {
                $query->orderBy('name', 'asc');
            }

            $data = $query->paginate($perPage);

            if ($data->isEmpty()) {
                return ApiHelper::error('No suppliers found', 404);
            }

            return ApiHelper::success('Suppliers retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

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

    public function update(Request $request, $id)
    {
        try {
            $businessId = auth()->guard('api')->user()->bussiness_id;
            $rules = [
                'name'    => 'sometimes|string|max:255',
                'phone'   => 'nullable|string',
                'address' => 'nullable|string',
            ];
            $validated = $request->validate($rules);

            $data = $this->updateAction->execute((int)$id, $validated, $businessId);

            return ApiHelper::success('Supplier was successfully updated', $data, 200);
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 500;
            return ApiHelper::error($e->getMessage(), $code);
        }
    }

    public function destroy($id)
    {
        try {
            $businessId = auth()->guard('api')->user()->bussiness_id;
            $this->deleteAction->execute((int)$id, $businessId);

            return ApiHelper::success('Supplier was successfully deleted', null, 200);
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 500;
            return ApiHelper::error($e->getMessage(), $code);
        }
    }
}
