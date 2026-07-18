<?php

namespace App\Domain\Purchase\Http\Controllers;

use App\Domain\Purchase\Actions\CreatePurchaseAction;
use App\Domain\Purchase\Http\Requests\PurchaseRequest;
use App\Domain\Purchase\Models\Purchase;
use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    protected CreatePurchaseAction $createPurchaseAction;

    public function __construct(CreatePurchaseAction $createPurchaseAction)
    {
        $this->createPurchaseAction = $createPurchaseAction;
    }

    public function store(PurchaseRequest $request)
    {
        try {
            $businessId = auth()->guard('api')->user()->bussiness_id;
            $userId = auth()->guard('api')->id();

            $purchase = $this->createPurchaseAction->execute($request->validated(), $businessId, $userId);

            return ApiHelper::success('Purchase created successfully', $purchase, 201);
        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 500;
            return ApiHelper::error($e->getMessage(), $code);
        }
    }

    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $businessId = auth()->guard('api')->user()->bussiness_id;

            $query = Purchase::where('bussiness_id', $businessId)
                ->with(['supplier', 'items.product']);

            if ($request->filled('search')) {
                $search = $request->query('search');
                $query->whereHas('supplier', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            }

            if ($request->filled('supplier_id')) {
                $query->where('supplier_id', $request->query('supplier_id'));
            }

            $from = $request->query('from', $request->query('date_from'));
            $to = $request->query('to', $request->query('date_to'));
            if ($from && $to) {
                $query->whereBetween('purchase_date', [$from, $to]);
            } elseif ($from) {
                $query->whereDate('purchase_date', '>=', $from);
            } elseif ($to) {
                $query->whereDate('purchase_date', '<=', $to);
            }

            $allowedSorts = ['purchase_date', 'total_amount', 'created_at', 'id'];
            $sort = $request->query('sort');
            $order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';

            if ($sort && in_array($sort, $allowedSorts, true)) {
                $query->orderBy($sort, $order);
            } else {
                $query->orderBy('purchase_date', 'desc');
            }

            $purchases = $query->paginate($perPage);

            if ($purchases->isEmpty()) {
                return ApiHelper::error('No purchases found', 404);
            }

            return ApiHelper::success('Purchases retrieved successfully', $purchases, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $businessId = auth()->guard('api')->user()->bussiness_id;

            $purchase = Purchase::with(['supplier', 'items.product'])
                ->where('id', $id)
                ->where('bussiness_id', $businessId)
                ->first();

            if (!$purchase) {
                return ApiHelper::error('Purchase not found', 404);
            }

            return ApiHelper::success('Purchase retrieved successfully', $purchase, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
