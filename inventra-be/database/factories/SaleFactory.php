<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
            $quantity = $this->faker->numberBetween(1, 20);
        $selling_price = $this->faker->randomElement([10000, 25000, 50000, 75000, 100000, 150000, 200000]);
        $total_price = $quantity * $selling_price;
        

        $hpp = $total_price * $this->faker->randomFloat(2, 0.60, 0.80);
        $profit = $total_price - $hpp;

        return [
            'product_id'    => 1,
            'quantity'      => $quantity,
            'selling_price' => $selling_price,
            'total_price'   => $total_price,
            'hpp'           => round($hpp, 2),
            'profit'        => round($profit, 2),
            'bussiness_id'  => 1,
            'created_at'    => $this->faker->dateTimeBetween('-12 months', 'now'),
            'updated_at'    => now(),
        ];
    }
}
