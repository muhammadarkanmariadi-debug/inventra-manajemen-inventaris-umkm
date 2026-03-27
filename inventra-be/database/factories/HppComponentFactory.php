<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class HppComponentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {


        return [
            'product_id'   => 1,
            'name'         => 'test', // ambil dari produk
            'cost'         => $this->faker->randomElement([
                                5000, 8000, 10000, 15000, 
                                20000, 30000, 40000, 60000
                             ]),
            'bussiness_id' => 1,
            'created_at'   => now(),
            'updated_at'   => now(),
        ];
    }
}
