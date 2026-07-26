<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');
        $businesses = \App\Models\Business::all();

        foreach ($businesses as $business) {
            for ($i = 0; $i < 3; $i++) {
                Supplier::firstOrCreate(
                    ['name' => $faker->company, 'bussiness_id' => $business->id],
                    [
                        'address' => $faker->address,
                        'phone' => $faker->phoneNumber,
                    ]
                );
            }
        }
    }
}
