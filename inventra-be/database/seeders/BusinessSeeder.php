<?php

namespace Database\Seeders;

use App\Models\Business;
use Illuminate\Database\Seeder;

class BusinessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create('id_ID');

        $businessNames = ['Tech Nusantara', 'Sembako Sejahtera', 'Fashion Indah'];

        foreach ($businessNames as $name) {
            Business::firstOrCreate(['name' => $name], [
                'address' => $faker->address,
                'phone'   => $faker->phoneNumber,
                'email'   => $faker->companyEmail,
                'website' => 'www.' . strtolower(str_replace(' ', '', $name)) . '.com',
                'description' => $faker->sentence(6),
            ]);
        }
    }
}
