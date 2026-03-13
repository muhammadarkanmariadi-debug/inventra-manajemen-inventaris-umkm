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
        Business::create([
            'name'    => 'Inventra',
            'address' => 'Jl. Contoh Alamat No. 123, Kota Contoh, Negara Contoh',
            'phone'   => '+62 812-3456-7890',
            'email'   => 'info@inventra.com',
            'website' => 'www.inventra.com',
        ]);
    }
}
