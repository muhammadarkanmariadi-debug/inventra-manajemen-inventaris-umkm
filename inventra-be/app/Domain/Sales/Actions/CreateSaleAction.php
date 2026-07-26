<?php

namespace App\Domain\Sales\Actions;

use App\Events\LoggingEvent;
use App\Events\SaleCreated;
use App\Models\Inventory;
use App\Models\InventoryLog;
use App\Models\InventoryStatus;
use App\Models\Product;
use App\Domain\Sales\Models\Sale;
use Exception;
use Illuminate\Support\Facades\DB;

class CreateSaleAction
{
    public function execute(array $data, int $businessId, int $userId): Sale
    {
        return DB::transaction(function () use ($data, $businessId, $userId) {
            $inventory = Inventory::lockForUpdate()->findOrFail($data['inventory_id']);
            $product = Product::lockForUpdate()->findOrFail($inventory->product_id);

            if ($product->bussiness_id !== $businessId) {
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
                'product_id'    => $product->id,
                'inventory_id'  => $inventory->id,
                'quantity'      => $data['quantity'],
                'selling_price' => $data['selling_price'],
                'total_price'   => $totalPrice,
                'bussiness_id'  => $businessId,
                'buyer_name'    => $data['buyer_name'] ?? null,
                'buyer_phone'   => $data['buyer_phone'] ?? null,
                'buyer_address' => $data['buyer_address'] ?? null,
            ]);

            $inventory->decrement('quantity', $data['quantity']);

            InventoryLog::create([
                'inventory_id'   => $inventory->id,
                'from_status_id' => $readyStatus->id,
                'to_status_id'   => $readyStatus->id,
                'action'         => 'SALES_OUT',
                'quantity'       => $data['quantity'],
                'user_id'        => $userId,
                'notes'          => 'Distributed against Sale Order #' . $sale->id,
            ]);

            event(new SaleCreated($sale));
            event(new LoggingEvent('Sale was successfully created', 'sales'));

            return $sale->load('product');
        });
    }
}
