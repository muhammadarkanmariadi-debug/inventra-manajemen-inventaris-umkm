<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\InventoryLog;
use App\Models\InventoryStatus;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class TransactionService
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Handle stock adjustments systematically.
     *
     * ADJUSTMENT_ADD: Creates new inventory batch with READY status (adds stock manually).
     * ADJUSTMENT_SUB: Deducts from a specific READY inventory batch (QR-scanned).
     */
    public function processTransaction(string $type, array $items, ?int $userId, ?string $notes = null)
    {
        return DB::transaction(function () use ($type, $items, $userId, $notes) {
            $transaction = Transaction::create([
                'type' => $type,
            ]);

            foreach ($items as $item) {
                if ($type === 'ADJUSTMENT_ADD') {
                    $this->processInbound($transaction, $item, $userId, $notes);
                } elseif ($type === 'ADJUSTMENT_SUB') {
                    $this->processOutbound($transaction, $item, $userId, $notes);
                }
            }

            return $transaction->load('items.inventory.product');
        });
    }

    /**
     * Process an inbound (ADJUSTMENT_ADD) transaction item.
     * Creates a new inventory batch with READY status.
     */
    private function processInbound(Transaction $transaction, array $item, ?int $userId, ?string $notes): void
    {
        if (!isset($item['product_id'])) {
            throw new Exception("Product ID is required for ADJUSTMENT_ADD.", 422);
        }

        // Use InventoryService to create with proper code format and logging
        $inventory = $this->inventoryService->createInventory(
            $item['product_id'],
            $item['quantity'],
            $item['location_id'] ?? null,
            $userId
        );

        TransactionItem::create([
            'transaction_id' => $transaction->id,
            'inventory_id'   => $inventory->id,
            'quantity'       => $item['quantity'],
        ]);

        // Make newly added adjustment stock READY instantly
        $readyStatus = InventoryStatus::where('code', 'READY')->firstOrFail();
        $inventory->update(['current_status_id' => $readyStatus->id]);

        // Additional ADJUSTMENT_ADD log
        InventoryLog::create([
            'inventory_id'   => $inventory->id,
            'from_status_id' => null,
            'to_status_id'   => $readyStatus->id,
            'action'         => 'ADJUSTMENT_ADD',
            'quantity'       => $item['quantity'],
            'user_id'        => $userId,
            'notes'          => $notes ?? 'Stock Adjustment (Add)',
        ]);
    }

    /**
     * Process an outbound (ADJUSTMENT_SUB) transaction item.
     * Only allowed on READY inventory batches.
     */
    private function processOutbound(Transaction $transaction, array $item, ?int $userId, ?string $notes): void
    {
        if (!isset($item['inventory_id'])) {
            throw new Exception("Inventory ID is required for ADJUSTMENT_SUB.", 422);
        }

        $readyStatus = InventoryStatus::where('code', 'READY')->firstOrFail();
        $inventory = Inventory::lockForUpdate()->findOrFail($item['inventory_id']);

        if ($inventory->current_status_id !== $readyStatus->id) {
            throw new Exception("Inventory {$inventory->inventory_code} is not READY for outbound.", 422);
        }

        if ($inventory->quantity < $item['quantity']) {
            throw new Exception("Insufficient quantity in inventory batch {$inventory->inventory_code}.", 422);
        }

        $inventory->decrement('quantity', $item['quantity']);

        TransactionItem::create([
            'transaction_id' => $transaction->id,
            'inventory_id'   => $inventory->id,
            'quantity'       => $item['quantity'],
        ]);

        InventoryLog::create([
            'inventory_id'   => $inventory->id,
            'from_status_id' => $readyStatus->id,
            'to_status_id'   => $readyStatus->id, // Remains READY but reduced quantity
            'action'         => 'ADJUSTMENT_SUB',
            'quantity'       => $item['quantity'],
            'user_id'        => $userId,
            'notes'          => $notes ?? 'Stock Adjustment (Sub)',
        ]);
    }
}
