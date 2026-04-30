<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Purchase;
use App\Services\PurchaseService;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    protected PurchaseService $purchaseService;

    public function __construct(PurchaseService $purchaseService)
    {
        $this->purchaseService = $purchaseService;
    }

    /**
     * Create a new purchase with items.
     */
    public function store(Request $request)
    {
        try {
        $bussinessId = auth()->guard('api')->user()->bussiness_id;

        $purchase = $this->purchaseService->createPurchase(
            $request->all(),
            $bussinessId
        );

        event(new LoggingEvent('Purchase created successfully', 'purchases'));

        return ApiHelper::success('Purchase created successfully', $purchase, 201);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get all purchases with pagination.
     */
    public function index(Request $request)
    {
        try {
        $perPage = (int) $request->query('items', 10);
        $bussinessId = auth()->guard('api')->user()->bussiness_id;

        $query = Purchase::where('bussiness_id', $bussinessId)
            ->with(['supplier', 'items.product'])
            ->orderBy('purchase_date', 'desc');

        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->query('supplier_id'));
        }

        if ($request->has('from') && $request->has('to')) {
            $query->whereBetween('purchase_date', [
                $request->query('from'),
                $request->query('to'),
            ]);
        }

        $purchases = $query->paginate($perPage);

        if ($purchases->isEmpty()) {
            return ApiHelper::error('No purchases found', 404);
        }

        return ApiHelper::success('Purchases retrieved successfully', $purchases, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a single purchase by ID.
     */
    public function show($id)
    {
        try {
        $bussinessId = auth()->guard('api')->user()->bussiness_id;

        $purchase = Purchase::with(['supplier', 'items.product'])
            ->where('id', $id)
            ->where('bussiness_id', $bussinessId)
            ->first();

        if (!$purchase) {
            return ApiHelper::error('Purchase not found', 404);
        }

        return ApiHelper::success('Purchase retrieved successfully', $purchase, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }
}
