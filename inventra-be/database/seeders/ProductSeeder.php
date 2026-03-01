<?php

namespace Database\Seeders;

use App\Models\Products;
use Google\Service\AdExchangeBuyer\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $products =  Products::create([
            "category_id" => 1,
            "name" => "Smartphone XYZ",
            "sku" => "SKU002",
            "product_type" => "barang",
            "unit" => "pcs",
            "stock" => 16,
            "bussiness_id" => 1,
            "selling_price" => "5000.00",
            "expired_date" => null,
            "created_at" => "2026-02-28T03:31:53.000000Z",
            "updated_at" => "2026-02-28T03:31:53.000000Z",



        ]);
      $products->supplier()->attach(1);


    }
}
