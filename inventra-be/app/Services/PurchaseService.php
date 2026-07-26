<?php

namespace App\Services;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Exceptions\ApiException;

class PurchaseService
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Create a purchase with items inside a database transaction and generate inventory.
     */
    public function createPurchase(array $data, int $bussinessId): Purchase
    {
        $validator = Validator::make($data, [
            'supplier_id'        => 'required|integer|exists:suppliers,id',
            'purchase_date'      => 'required|date',
            'notes'              => 'nullable|string',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity'   => 'required|integer|min:1',
            'items.*.price'      => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        return DB::transaction(function () use ($data, $bussinessId) {
            $purchase = Purchase::create([
                'supplier_id'   => $data['supplier_id'],
                'bussiness_id'  => $bussinessId,
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

                // Create inventory batch directly from purchase logic
                $userId = auth()->guard('api')->id();
                $this->inventoryService->createInventory(
                    $item['product_id'],
                    $item['quantity'],
                    null, // location_id not mandated yet
                    $userId,
                    'PURCHASE_IN',
                    'Generated from Purchase ID: ' . $purchase->id
                );
            }

            $purchase->update(['total_amount' => $totalAmount]);

            return $purchase->load(['supplier', 'items.product']);
        });
    }
}
