<?php

namespace App\Domain\Inventory\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Inventory\Models\Inventory;
use App\Domain\Inventory\Http\Requests\StockAdjustmentRequest;
use App\Domain\Inventory\Actions\AdjustStockAction;
use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    protected AdjustStockAction $adjustStockAction;

    public function __construct(AdjustStockAction $adjustStockAction)
    {
        $this->adjustStockAction = $adjustStockAction;
    }

    public function index(Request $request)
    {
        try {
            $query = Inventory::with(['product', 'status', 'location']);

            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('inventory_code', 'like', "%{$search}%")
                      ->orWhereHas('product', function ($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      });
                });
            }

            if ($request->has('status') && $request->status) {
                $query->whereHas('status', function ($q) use ($request) {
                    $q->where('code', $request->status);
                });
            }

            if ($request->has('date_from') && $request->date_from) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            if ($request->has('date_to') && $request->date_to) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            if ($request->filled('category_id')) {
                $categoryId = $request->query('category_id');
                $query->whereHas('product', function ($q) use ($categoryId) {
                    $q->where('category_id', $categoryId);
                });
            }

            $query->where('bussiness_id', auth()->guard('api')->user()->bussiness_id);

            $allowedSorts = ['quantity', 'expired_date', 'created_at', 'inventory_code'];
            $sort = $request->query('sort');
            $order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';

            if ($sort && in_array($sort, $allowedSorts, true)) {
                if ($sort === 'expired_date') {
                    $query->orderByRaw("(SELECT expired_date FROM products WHERE products.id = inventories.product_id) {$order}");
                } else {
                    $query->orderBy($sort, $order);
                }
            } else {
                $query->orderBy('created_at', 'desc');
            }

            $inventories = $query->paginate($request->get('items', 15));

            return response()->json([
                'status' => true,
                'message' => 'Inventories retrieved successfully.',
                'data' => $inventories,
            ]);
        } catch (\Exception $e) {
            $code = $e->getCode();
            $code = is_int($code) && $code >= 100 && $code < 600 ? $code : 500;
            return ApiHelper::error($e->getMessage(), $code);
        }
    }

    public function show($id)
    {
        try {
            $inventory = Inventory::with(['product', 'status', 'location', 'logs.location', 'logs.fromStatus', 'logs.toStatus', 'logs.user'])
                ->find($id);

            if (!$inventory) {
                return response()->json([
                    'status' => false,
                    'message' => 'Inventory not found.',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Inventory retrieved successfully.',
                'data' => $inventory,
            ]);
        } catch (\Exception $e) {
            $code = $e->getCode();
            $code = is_int($code) && $code >= 100 && $code < 600 ? $code : 500;
            return ApiHelper::error($e->getMessage(), $code);
        }
    }

    public function updateStatus(StockAdjustmentRequest $request, $id)
    {
        try {
            $userId = auth()->guard('api')->id();
            
            $inventory = $this->adjustStockAction->execute(
                (int) $id,
                $request->new_status_code,
                $userId,
                $request->notes,
                $request->location_id
            );

            event(new LoggingEvent('Inventory ' . $inventory->inventory_code . ' status updated to ' . $request->new_status_code, 'inventories'));

            return response()->json([
                'status' => true,
                'message' => 'Inventory status updated successfully.',
                'data' => $inventory
            ]);
        } catch (\Exception $e) {
            $code = $e->getCode();
            $code = is_int($code) && $code >= 100 && $code < 600 ? $code : 500;
            return ApiHelper::error($e->getMessage(), $code);
        }
    }
}
