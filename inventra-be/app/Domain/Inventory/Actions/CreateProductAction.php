<?php

namespace App\Domain\Inventory\Actions;

use App\Domain\Inventory\Models\Product;
use App\Services\InventoryService;
use Illuminate\Support\Facades\DB;

class CreateProductAction
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function execute(array $data, ?int $businessId = null, ?int $userId = null): Product
    {
        return DB::transaction(function () use ($data, $businessId, $userId) {
            $initialStock = $data['stock'] ?? 0;
            unset($data['stock']);

            if ($businessId && !isset($data['bussiness_id'])) {
                $data['bussiness_id'] = $businessId;
            }

            $product = Product::create($data);

            if ($initialStock > 0) {
                $this->inventoryService->createInventory(
                    $product->id,
                    (int) $initialStock,
                    $data['location_id'] ?? null,
                    $userId,
                    'INITIAL_STOCK',
                    'Initial stock created upon product creation'
                );
            }

            return $product->fresh(['category']);
        });
    }
}
