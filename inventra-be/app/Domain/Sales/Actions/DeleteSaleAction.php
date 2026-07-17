<?php

namespace App\Domain\Sales\Actions;

use App\Events\LoggingEvent;
use App\Models\Inventory;
use App\Models\InventoryLog;
use App\Models\InventoryStatus;
use App\Domain\Sales\Models\Sale;
use App\Services\RequestService;
use Exception;
use Illuminate\Support\Facades\DB;

class DeleteSaleAction
{
    protected RequestService $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function execute(int $id, int $businessId, int $userId): bool
    {
        return DB::transaction(function () use ($id, $businessId, $userId) {
            $sale = Sale::where('bussiness_id', $businessId)->findOrFail($id);

            $readyStatus = InventoryStatus::where('code', 'READY')->firstOrFail();

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
                'user_id' => $userId,
                'notes' => 'Rolled back Sale ID: ' . $sale->id,
            ]);

            $this->requestService->deleteDataById(Sale::class, $id);

            event(new LoggingEvent('Sale with id: ' . $id . ' deleted successfully', 'sales'));

            return true;
        });
    }
}
