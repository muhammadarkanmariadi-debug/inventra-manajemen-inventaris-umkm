<?php

namespace App\Domain\Sales\Http\Controllers;

use App\Domain\Sales\Actions\CreateSaleAction;
use App\Domain\Sales\Actions\DeleteSaleAction;
use App\Domain\Sales\Http\Requests\SaleRequest;
use App\Domain\Sales\Models\Sale;
use App\Events\SaleCreated;
use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SaleController extends Controller
{
    protected CreateSaleAction $createSaleAction;
    protected DeleteSaleAction $deleteSaleAction;

    public function __construct(CreateSaleAction $createSaleAction, DeleteSaleAction $deleteSaleAction)
    {
        $this->createSaleAction = $createSaleAction;
        $this->deleteSaleAction = $deleteSaleAction;
    }

    public function store(SaleRequest $request)
    {
        try {
            $businessId = auth()->guard('api')->user()->bussiness_id;
            $userId = auth()->guard('api')->id();

            $sale = $this->createSaleAction->execute($request->validated(), $businessId, $userId);

            return ApiHelper::success('Sale was successfully created', $sale, 201);
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 500;
            return ApiHelper::error($e->getMessage(), $code);
        }
    }

    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $query   = Sale::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product');

            if ($request->has('date_from') && $request->date_from) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            if ($request->has('date_to') && $request->date_to) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            $data = $query->orderBy('created_at', 'desc')->paginate($perPage);

            if ($data->isEmpty()) {
                return ApiHelper::error('No sales found', 404);
            }

            return ApiHelper::success('Sales retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $data = Sale::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product')
                ->first();

            if (!$data) {
                return ApiHelper::error('Sale not found', 404);
            }
            event(new SaleCreated($data));
            return ApiHelper::success('Sale retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            return ApiHelper::error('Updating sales quantity directly is discontinued under the new audit log system. Delete and recreate.', 405);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $businessId = auth()->guard('api')->user()->bussiness_id;
            $userId = auth()->guard('api')->id();

            $this->deleteSaleAction->execute((int)$id, $businessId, $userId);

            return ApiHelper::success('Sale was successfully deleted', null, 200);
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 500;
            return ApiHelper::error($e->getMessage(), $code);
        }
    }
}
