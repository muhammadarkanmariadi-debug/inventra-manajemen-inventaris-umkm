<?php

namespace App\Domain\Inventory\Actions;

use App\Domain\Inventory\Models\Product;
use Exception;

class UpdateProductAction
{
    public function execute(int $productId, array $data, ?int $businessId = null): Product
    {
        $query = Product::where('id', $productId);
        if ($businessId) {
            $query->where('bussiness_id', $businessId);
        }

        /** @var Product|null $product */
        $product = $query->first();
        if (!$product) {
            throw new Exception('Product not found', 404);
        }

        unset($data['stock']); // Stock is calculated from inventory batches
        $product->update($data);

        return $product->fresh(['category']);
    }
}
