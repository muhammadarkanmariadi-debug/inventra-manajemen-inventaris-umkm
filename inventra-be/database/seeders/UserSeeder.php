<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Business;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- 1. AKUN DEMO SPESIFIK ---
        $demoBusiness = Business::first() ?? Business::create(['name' => 'Bisnis Demo', 'address' => 'Alamat Demo']);
        // Super Admin Demo
        $superAdmin = User::updateOrCreate(
            ['email' => 'superadmin@demo.com'],
            [
                'username'     => 'Super Admin Demo',
                'password'     => Hash::make('demo1234'),
                'role'         => 'USER',
                'bussiness_id' => $demoBusiness->id,
            ]
        );
        $superAdmin->syncRoles(['super_admin']);

        // Manager Demo
        $manager = User::updateOrCreate(
            ['email' => 'manager@demo.com'],
            [
                'username'     => 'Manager Demo',
                'password'     => Hash::make('demo1234'),
                'role'         => 'USER',
                'bussiness_id' => $demoBusiness->id,
            ]
        );
        $manager->syncRoles(['manager']);

        // Operator Gudang Demo
        $operator = User::updateOrCreate(
            ['email' => 'operator@demo.com'],
            [
                'username'     => 'Operator Demo',
                'password'     => Hash::make('demo1234'),
                'role'         => 'USER',
                'bussiness_id' => $demoBusiness->id,
            ]
        );
        $operator->syncRoles(['operator_gudang']);

        // QC Demo
        $qc = User::updateOrCreate(
            ['email' => 'qc@demo.com'],
            [
                'username'     => 'QC Demo',
                'password'     => Hash::make('demo1234'),
                'role'         => 'USER',
                'bussiness_id' => $demoBusiness->id,
            ]
        );
        $qc->syncRoles(['qc']);

        // Sales Demo
        $sales = User::updateOrCreate(
            ['email' => 'sales@demo.com'],
            [
                'username'     => 'Sales Demo',
                'password'     => Hash::make('demo1234'),
                'role'         => 'USER',
                'bussiness_id' => $demoBusiness->id,
            ]
        );
        $sales->syncRoles(['sales']);
    }
}