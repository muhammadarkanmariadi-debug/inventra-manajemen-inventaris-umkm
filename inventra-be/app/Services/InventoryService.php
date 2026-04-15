<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\InventoryLog;
use App\Models\InventoryStatus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class InventoryService
{
    /**
     * Process a QR scan by inventory code.
     * Logs a SCAN event every time an inventory is scanned.
     */
    public function processScan(string $inventoryCode, ?int $userId = null)
    {
        $inventory = Inventory::where('inventory_code', $inventoryCode)
            ->with(['product', 'status', 'location', 'logs.location', 'logs.fromStatus', 'logs.toStatus', 'logs.user'])
            ->first();

        if (!$inventory) {
            throw new Exception('Inventory not found.', 404);
        }

        // Log the SCAN event
        InventoryLog::create([
            'inventory_id'   => $inventory->id,
            'from_status_id' => $inventory->current_status_id,
            'to_status_id'   => $inventory->current_status_id,
            'action'         => 'SCAN',
            'quantity'       => $inventory->quantity,
            'user_id'        => $userId,
            'notes'          => 'QR Code scanned',
        ]);

        // Reload to include the new SCAN log
        $inventory->load(['logs.location', 'logs.fromStatus', 'logs.toStatus', 'logs.user']);

        return $inventory;
    }

    /**
     * Create a new inventory batch with proper INV-YYYY-XXXX code format.
     */
    public function createInventory(int $productId, int $quantity, ?int $locationId = null, ?int $userId = null, string $action = 'CREATED', string $notes = 'Inventory batch created'): Inventory
    {
        $unreleasedStatus = InventoryStatus::where('code', 'UNRELEASED')->firstOrFail();
        $code = $this->generateInventoryCode();

        $inventory = Inventory::create([
            'inventory_code'    => $code,
            'product_id'        => $productId,
            'current_status_id' => $unreleasedStatus->id,
            'quantity'          => $quantity,
            'location_id'       => $locationId,
        ]);

        // Log creation event
        InventoryLog::create([
            'inventory_id'   => $inventory->id,
            'from_status_id' => null,
            'to_status_id'   => $unreleasedStatus->id,
            'action'         => $action,
            'quantity'       => $quantity,
            'user_id'        => $userId,
            'notes'          => $notes,
            'location_id'    => $locationId,
        ]);

        return $inventory->load(['product', 'status', 'location']);
    }

    /**
     * Update the status of an inventory batch with transition validation.
     */
    public function updateStatus(int $inventoryId, string $newStatusCode, ?int $userId, ?string $notes = null, ?int $locationId = null)
    {
        return DB::transaction(function () use ($inventoryId, $newStatusCode, $userId, $notes, $locationId) {
            $inventory = Inventory::with('status')->lockForUpdate()->findOrFail($inventoryId);
         $currentStatus = $inventory->status->code;
            
            $newStatus = InventoryStatus::where('code', $newStatusCode)->first();
            if (!$newStatus) {
                throw new Exception('Invalid status code.', 400);
            }

            // Validate allowed transitions
            $this->validateTransition($currentStatus, $newStatusCode);

            // Create Log
            InventoryLog::create([
                'inventory_id'   => $inventory->id,
                'from_status_id' => $inventory->current_status_id,
                'to_status_id'   => $newStatus->id,
                'action'         => 'STATUS_CHANGE',
                'quantity'       => $inventory->quantity,
                'user_id'        => $userId,
                'notes'          => $notes,
                'location_id'    => $inventory->location_id,
            ]);

            // Update Status
            $inventory->update([
                'current_status_id' => $newStatus->id,
                'location_id'    => $locationId
            ]);

            // Return full inventory with logs for immediate UI refresh
            return $inventory->fresh(['product', 'status', 'location', 'logs.location', 'logs.fromStatus', 'logs.toStatus', 'logs.user']);
        });
    }

    /**
     * Calculate available stock dynamically.
     */
    public function getAvailableStock(int $productId): int
    {
        return (int) Inventory::where('product_id', $productId)
            ->whereHas('status', function($query) {
                $query->where('code', 'READY');
            })
            ->sum('quantity');
    }

    /**
     * Generate inventory code with INV-YYYY-XXXX format.
     */
    private function generateInventoryCode(): string
    {
        $year = date('Y');
        $random = strtoupper(Str::random(6));
        $code = "INV-{$year}-{$random}";

        // Ensure uniqueness
        while (Inventory::where('inventory_code', $code)->exists()) {
            $random = strtoupper(Str::random(6));
            $code = "INV-{$year}-{$random}";
        }

        return $code;
    }

    /**
     * Strict transition rules (state machine).
     */
    private function validateTransition(string $current, string $new)
    {
        $allowed = [
            'UNRELEASED' => ['READY', 'ON_HOLD', 'REJECT'],
            'ON_HOLD'    => ['READY', 'REJECT'],
            'READY'      => ['ON_HOLD', 'REJECT'],
            'REJECT'     => [] // Cannot transition out of REJECT
        ];

        if (!isset($allowed[$current]) || !in_array($new, $allowed[$current])) {
            throw new Exception("Invalid status transition from {$current} to {$new}.", 422);
        }
    }
}
