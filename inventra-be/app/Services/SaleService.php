<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\InventoryLog;
use App\Models\InventoryStatus;
use App\Models\Product;
use App\Models\Sale;
use App\Events\LoggingEvent;
use Illuminate\Support\Facades\DB;
use Exception;

class SaleService
{
    /**
     * Handle the sale creation with explicit inventory batch handling
     * Only consumes READY stock from the designated inventory ID.
     */
    public function createSale(array $data, int $bussinessId, int $userId): Sale
    {
        return DB::transaction(function () use ($data, $bussinessId, $userId) {
            $inventory = Inventory::lockForUpdate()->findOrFail($data['inventory_id']);
            $product = Product::lockForUpdate()->findOrFail($inventory->product_id);

            if ($product->bussiness_id !== $bussinessId) {
                throw new Exception("Unauthorized product access", 403);
            }

            $readyStatus = InventoryStatus::where('code', 'READY')->firstOrFail();

            if ($inventory->current_status_id !== $readyStatus->id) {
                throw new Exception("Selected inventory batch is not READY", 422);
            }

            if ($inventory->quantity < $data['quantity']) {
                throw new Exception("Insufficient stock available in this batch", 422);
            }

            $totalPrice = $data['selling_price'] * $data['quantity'];

            $sale = Sale::create([
                'product_id'    => $product->id, // Maintain aggregate correlation
                'quantity'      => $data['quantity'],
                'selling_price' => $data['selling_price'],
                'total_price'   => $totalPrice,
                'bussiness_id'  => $bussinessId,
            ]);

            // Strictly reduce the explicitly selected physical inventory batch
            $this->reduceInventory($sale, $inventory, $data['quantity'], $userId);

            event(new LoggingEvent('Sale was successfully created', 'sales'));

            return $sale->load('product');
        });
    }

    /**
     * Consume stock strictly from the provided inventory batch
     */
    public function reduceInventory(Sale $sale, Inventory $inventory, int $quantity, int $userId): void
    {
        $readyStatus = InventoryStatus::where('code', 'READY')->firstOrFail();
        
        $inventory->decrement('quantity', $quantity);
        
        InventoryLog::create([
            'inventory_id'   => $inventory->id,
            'from_status_id' => $readyStatus->id,
            'to_status_id'   => $readyStatus->id,
            'action'         => 'SALES_OUT',
            'quantity'       => $quantity,
            'user_id'        => $userId,
            'notes'          => 'Distributed against Sale Order #' . $sale->id,
        ]);
    }
}
