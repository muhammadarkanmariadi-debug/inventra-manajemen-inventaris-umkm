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
        $product = Product::create([
            'category_id'   => 1,
            'name'          => 'Smartphone XYZ',
            'sku'           => 'SKU002',
            'product_type'  => 'barang',
            'unit'          => 'pcs',
            'stock'         => 16,
            'bussiness_id'  => 1,
            'selling_price' => '5000.00',
            'expired_date'  => null,
        ]);

        $product->suppliers()->attach(1);
    }
}
