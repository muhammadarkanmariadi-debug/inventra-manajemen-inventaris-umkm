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
     * Handle the sale creation with strict inventory decrement handling
     * Only consumes READY stock.
     */
    public function createSale(array $data, int $bussinessId, int $userId): Sale
    {
        return DB::transaction(function () use ($data, $bussinessId, $userId) {
            $product = Product::lockForUpdate()->findOrFail($data['product_id']);

            if ($product->bussiness_id !== $bussinessId) {
                throw new Exception("Unauthorized product access", 403);
            }

            if ($product->stock < $data['quantity']) {
                throw new Exception("Insufficient stock available", 422);
            }

            $totalPrice = $data['selling_price'] * $data['quantity'];

            $sale = Sale::create([
                'product_id'    => $data['product_id'],
                'quantity'      => $data['quantity'],
                'selling_price' => $data['selling_price'],
                'total_price'   => $totalPrice,
                'bussiness_id'  => $bussinessId,
            ]);

            // Now reduce the physical inventory strictly
            $this->reduceInventory($sale, $product, $data['quantity'], $userId);

            event(new LoggingEvent('Sale was successfully created', 'sales'));

            return $sale->load('product');
        });
    }

    /**
     * Consume available READY stock strictly using FIFO ordering
     */
    public function reduceInventory(Sale $sale, Product $product, int $quantity, int $userId): void
    {
        $readyStatus = InventoryStatus::where('code', 'READY')->firstOrFail();
        $remainingToDeduct = $quantity;
        
        $inventories = Inventory::where('product_id', $product->id)
            ->where('current_status_id', $readyStatus->id)
            ->where('quantity', '>', 0)
            ->orderBy('created_at', 'asc') // FIFO strategy
            ->lockForUpdate()
            ->get();
            
        foreach ($inventories as $inv) {
            if ($remainingToDeduct <= 0) break;
            
            $deduct = min($inv->quantity, $remainingToDeduct);
            $inv->decrement('quantity', $deduct);
            $remainingToDeduct -= $deduct;
            
            InventoryLog::create([
                'inventory_id'   => $inv->id,
                'from_status_id' => $readyStatus->id,
                'to_status_id'   => $readyStatus->id,
                'action'         => 'SALES_OUT',
                'quantity'       => $deduct,
                'user_id'        => $userId,
                'notes'          => 'Distributed against Sale Order #' . $sale->id,
            ]);
        }

        // Failsafe in case tracking didn't align
        if ($remainingToDeduct > 0) {
            throw new Exception("CRITICAL: Physical stock deduction failed. Short by $remainingToDeduct.", 500);
        }
    }
}
