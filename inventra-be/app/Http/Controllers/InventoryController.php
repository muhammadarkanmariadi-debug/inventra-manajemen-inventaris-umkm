<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Http\Requests\UpdateInventoryStatusRequest;
use App\Models\Inventory;
use App\Services\InventoryService;
use App\Helpers\ApiHelper;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * List all inventories with pagination, search, and status filter.
     */
    public function index(Request $request)
    {
        try {
            $query = Inventory::with(['product', 'status', 'location']);

            // Search by inventory_code or product name
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('inventory_code', 'like', "%{$search}%")
                      ->orWhereHas('product', function ($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      });
                });
            }

            // Filter by status code
            if ($request->has('status') && $request->status) {
                $query->whereHas('status', function ($q) use ($request) {
                    $q->where('code', $request->status);
                });
            }

            // Filter by date range
            if ($request->has('date_from') && $request->date_from) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            if ($request->has('date_to') && $request->date_to) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            $inventories = $query->orderBy('created_at', 'desc')
                ->paginate($request->get('items', 15));

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

    /**
     * Show a single inventory with its full log history.
     */
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

    /**
     * Update Inventory status using state machine transition rules.
     */
    public function updateStatus(UpdateInventoryStatusRequest $request, $id)
    {
        try {
            $userId = auth()->guard('api')->id();
            
            $inventory = $this->inventoryService->updateStatus(
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
