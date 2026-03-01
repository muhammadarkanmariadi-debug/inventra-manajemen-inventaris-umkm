<?php

namespace Database\Seeders;

use App\Models\Bussiness;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BussinessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Bussiness::create([
            'name' => 'Inventra',
            'address' => 'Jl. Contoh Alamat No. 123, Kota Contoh, Negara Contoh',
            'phone' => '+62 812-3456-7890',
            'email' => 'info@inventra.com',
            'website' => 'www.inventra.com',
         
        ]);
    }
}
