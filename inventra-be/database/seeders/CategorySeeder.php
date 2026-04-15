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
        Category::firstOrCreate(['name' => 'Elektronik'], [
            'description' => 'Kategori untuk produk elektronik seperti smartphone, laptop, dan televisi.',
            'bussiness_id' => 1
        ]);
    }
}
