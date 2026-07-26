<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventory;
use App\Models\Sale;
use Carbon\Carbon;
use Faker\Factory as Faker;

class SaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // We want to generate sales for the past 180 days (6 months) for AI Prophet forecasting
        $days = 180;

        // Get all inventories with products
        $inventories = Inventory::with('product')->where('quantity', '>', 0)->get();

        foreach ($inventories as $inventory) {
            $product = $inventory->product;
            if (!$product) continue;

            $bussiness_id = $inventory->bussiness_id;

            // Randomize how many days this product had sales
            $daysWithSales = $faker->numberBetween(15, 60);

            for ($i = 0; $i < $daysWithSales; $i++) {
                if ($inventory->quantity <= 0) {
                    break;
                }

                $quantitySold = $faker->numberBetween(1, min(10, $inventory->quantity));
                
                // Reduce the inventory by the sold amount
                $inventory->quantity -= $quantitySold;
                $inventory->save();

                $sellingPrice = $product->selling_price;
                $totalPrice = $quantitySold * $sellingPrice;

                // Random date in the last 180 days
                $randomDate = Carbon::now()->subDays($faker->numberBetween(0, 180))->subMinutes($faker->numberBetween(0, 1440));

                Sale::create([
                    'product_id'    => $product->id,
                    'inventory_id'  => $inventory->id,
                    'quantity'      => $quantitySold,
                    'selling_price' => $sellingPrice,
                    'total_price'   => $totalPrice,
                    'bussiness_id'  => $bussiness_id,
                    'buyer_name'    => $faker->optional(0.5)->name,
                    'buyer_phone'   => $faker->optional(0.5)->phoneNumber,
                    'buyer_address' => $faker->optional(0.3)->address,
                    'created_at'    => $randomDate,
                    'updated_at'    => $randomDate,
                ]);
            }
        }
    }
}
