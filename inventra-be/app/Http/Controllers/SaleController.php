<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Inventory;
use App\Models\InventoryLog;
use App\Models\InventoryStatus;
use App\Services\RequestService;
use Illuminate\Http\Request;
use App\Services\SaleService;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    protected $requestService;
    protected SaleService $saleService;

    public function __construct(RequestService $requestService, SaleService $saleService)
    {
        $this->requestService = $requestService;
        $this->saleService = $saleService;
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id'    => 'required|exists:products,id',
                'quantity'      => 'required|integer|min:1',
                'selling_price' => 'required|numeric|min:0',
            ]);

            $bussinessId = auth()->guard('api')->user()->bussiness_id;
            $userId = auth()->guard('api')->id();
            
            $sale = $this->saleService->createSale($request->all(), $bussinessId, $userId);

            return ApiHelper::success('Sale was successfully created', $sale, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $data    = Sale::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product')
                ->paginate($perPage);

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

            return ApiHelper::success('Sale retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        // Updating a sale is vastly more complex with event-driven inventory (restoring specific batches). 
        // For now, disallow updating sales quantity directly (Best Practice for immutable ERP logs).
        return ApiHelper::error('Updating sales quantity directly is discontinued under the new audit log system. Delete and recreate.', 405);
    }

    public function destroy($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $sale = Sale::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)->findOrFail($id);

                // Instead of simple product increment, we must find logs or just spawn an IN correction
                $readyStatus = InventoryStatus::where('code', 'READY')->firstOrFail();
                
                // Let's create an inventory batch returning the sold items
                $inventory = Inventory::create([
                    'inventory_code' => 'RET-SALE-' . $sale->id . '-' . strtoupper(uniqid()),
                    'product_id' => $sale->product_id,
                    'current_status_id' => $readyStatus->id,
                    'quantity' => $sale->quantity,
                ]);

                InventoryLog::create([
                    'inventory_id' => $inventory->id,
                    'from_status_id' => null,
                    'to_status_id' => $readyStatus->id,
                    'action' => 'RETURN_SALE',
                    'quantity' => $sale->quantity,
                    'user_id' => auth()->guard('api')->user()->id,
                    'notes' => 'Rolled back Sale ID: ' . $sale->id,
                ]);

                $this->requestService->deleteDataById(Sale::class, $id);

                event(new LoggingEvent('Sale with id: ' . $id . ' deleted successfully', 'sales'));

                return ApiHelper::success('Sale was successfully deleted', null, 200);
            });
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
