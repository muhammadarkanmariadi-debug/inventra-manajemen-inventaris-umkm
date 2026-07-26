<?php

namespace App\Domain\Purchase\Actions;

use App\Domain\Purchase\Models\Purchase;
use App\Domain\Purchase\Models\PurchaseItem;
use App\Events\LoggingEvent;
use App\Services\InventoryService;
use Illuminate\Support\Facades\DB;

class CreatePurchaseAction
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function execute(array $data, int $businessId, int $userId): Purchase
    {
        return DB::transaction(function () use ($data, $businessId, $userId) {
            $purchase = Purchase::create([
                'supplier_id'   => $data['supplier_id'],
                'bussiness_id'  => $businessId,
                'purchase_date' => $data['purchase_date'],
                'notes'         => $data['notes'] ?? null,
                'total_amount'  => 0,
            ]);

            $totalAmount = 0;

            foreach ($data['items'] as $item) {
                $subtotal = $item['quantity'] * $item['price'];
                $totalAmount += $subtotal;

                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id'  => $item['product_id'],
                    'quantity'    => $item['quantity'],
                    'price'       => $item['price'],
                    'subtotal'    => $subtotal,
                ]);

                $this->inventoryService->createInventory(
                    $item['product_id'],
                    $item['quantity'],
                    null,
                    $userId,
                    'PURCHASE_IN',
                    'Generated from Purchase ID: ' . $purchase->id
                );
            }

            $purchase->update(['total_amount' => $totalAmount]);

            event(new LoggingEvent('Purchase created successfully', 'purchases'));

            return $purchase->load(['supplier', 'items.product']);
        });
    }
}
