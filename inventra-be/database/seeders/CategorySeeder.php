<?php

namespace Database\Seeders;

use App\Models\Categories;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Categories::create([
            'name' => 'Elektronik',
            'description' => 'Kategori untuk produk elektronik seperti smartphone, laptop, dan televisi.',
            'bussiness_id' => 1
        ]);
    }
}
