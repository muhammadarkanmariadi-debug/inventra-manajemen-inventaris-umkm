<?php

namespace App\Domain\Inventory\Actions;

use App\Domain\Inventory\Models\Inventory;
use App\Services\InventoryService;

class AdjustStockAction
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function execute(int $inventoryId, string $newStatusCode, ?int $userId = null, ?string $notes = null, ?int $locationId = null): Inventory
    {
        return $this->inventoryService->updateStatus(
            $inventoryId,
            $newStatusCode,
            $userId,
            $notes,
            $locationId
        );
    }
}
