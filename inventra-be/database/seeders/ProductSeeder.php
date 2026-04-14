<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = Product::firstOrCreate(
            ['sku' => 'SKU002'],
            [
            'category_id'   => 1,
            'name'          => 'Smartphone XYZ',
            'product_type'  => 'barang',
            'unit'          => 'pcs',
            'bussiness_id'  => 1,
            'selling_price' => '5000.00',
            'expired_date'  => null,
        ]);

      
        \App\Models\Inventory::firstOrCreate(
            ['inventory_code' => 'INV-SEED-01'],
            [
            'product_id' => $product->id,
            'current_status_id' => \App\Models\InventoryStatus::where('code', 'READY')->first()->id,
            'quantity' => 16,
        ]);
    }
}
