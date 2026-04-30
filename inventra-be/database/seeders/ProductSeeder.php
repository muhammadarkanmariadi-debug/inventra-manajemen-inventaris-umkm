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
        $faker = \Faker\Factory::create('id_ID');
        $businesses = \App\Models\Business::all();
        $readyStatusId = \App\Models\InventoryStatus::where('code', 'READY')->first()->id ?? 4;

        foreach ($businesses as $business) {
            $categories = \App\Models\Category::where('bussiness_id', $business->id)->get();
            if ($categories->isEmpty()) continue;

            for ($i = 1; $i <= 10; $i++) {
                $category = $categories->random();
                $prefix = strtoupper(substr($business->name, 0, 3));
                
                $product = Product::firstOrCreate(
                    ['sku' => "{$prefix}-" . $faker->unique()->numerify('SKU####')],
                    [
                        'category_id'   => $category->id,
                        'name'          => $faker->words(3, true),
                        'product_type'  => 'barang',
                        'unit'          => $faker->randomElement(['pcs', 'box', 'kg', 'lusin']),
                        'bussiness_id'  => $business->id,
                        'selling_price' => $faker->numberBetween(10000, 500000),
                        'expired_date'  => $faker->optional(0.3)->dateTimeBetween('now', '+2 years'),
                    ]
                );

                \App\Models\Inventory::firstOrCreate(
                    ['inventory_code' => "INV-{$prefix}-" . $faker->unique()->numerify('####')],
                    [
                        'product_id' => $product->id,
                        'current_status_id' => $readyStatusId,
                        'quantity' => $faker->numberBetween(10, 500),
                    ]
                );
            }
        }
    }
}
