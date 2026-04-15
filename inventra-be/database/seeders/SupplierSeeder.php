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
        Supplier::firstOrCreate(['name' => 'PT. Sumber Rejeki'], [
            'address' => 'Jl. Contoh Alamat No. 456, Kota Contoh, Negara Contoh',
            'phone' => '+62 812-9876-5432',
            'bussiness_id' => 1,
        ]);
    }
}
