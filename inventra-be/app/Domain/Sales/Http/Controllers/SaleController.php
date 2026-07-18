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

            if ($request->filled('search')) {
                $search = $request->query('search');
                $query->where(function ($q) use ($search) {
                    $q->where('buyer_name', 'like', "%{$search}%")
                      ->orWhereHas('product', function ($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      });
                });
            }

            $from = $request->query('from', $request->query('date_from'));
            $to = $request->query('to', $request->query('date_to'));
            if ($from && $to) {
                $query->whereBetween('created_at', [$from . ' 00:00:00', $to . ' 23:59:59']);
            } elseif ($from) {
                $query->where('created_at', '>=', $from . ' 00:00:00');
            } elseif ($to) {
                $query->where('created_at', '<=', $to . ' 23:59:59');
            }

            $allowedSorts = ['quantity', 'total_price', 'created_at', 'id'];
            $sort = $request->query('sort');
            $order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';

            if ($sort && in_array($sort, $allowedSorts, true)) {
                $query->orderBy($sort, $order);
            } else {
                $query->orderBy('created_at', 'desc');
            }

            $data = $query->paginate($perPage);

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
