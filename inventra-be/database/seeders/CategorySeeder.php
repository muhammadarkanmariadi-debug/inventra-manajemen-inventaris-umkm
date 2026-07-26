<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        $businesses = \App\Models\Business::all();
        $categoriesNames = ['Elektronik', 'Pakaian', 'Makanan & Minuman', 'Perabotan', 'Alat Tulis'];

        foreach ($businesses as $business) {
            foreach ($categoriesNames as $name) {
                Category::firstOrCreate(
                    ['name' => $name, 'bussiness_id' => $business->id],
                    [
                        'description' => $faker->sentence(8),
                    ]
                );
            }
        }
    }
}
