<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create one Global Superadmin
        $superadmin = User::firstOrCreate(
            ['email' => 'superadmin@inventra.com'],
            [
                'username' => 'Superadmin Master',
                'password' => bcrypt('superadmin123'),
                'role' => 'SUPERADMIN',
                'bussiness_id' => null,
            ]
        );
        $superadmin->assignRole(['owner', 'admin', 'staff']); // Just in case, but Superadmin usually bypasses permission checks

        // 2. Create users for each business
        $businesses = \App\Models\Business::all();
        
        foreach ($businesses as $index => $business) {
            $prefix = explode(' ', strtolower($business->name))[0];
            
            // Owner
            $owner = User::firstOrCreate(
                ['email' => "owner@{$prefix}.com"],
                [
                    'username' => "Owner {$business->name}",
                    'password' => bcrypt('owner123'),
                    'role' => 'USER',
                    'bussiness_id' => $business->id,
                ]
            );
            $owner->assignRole('owner');

            // Admin
            $admin = User::firstOrCreate(
                ['email' => "admin@{$prefix}.com"],
                [
                    'username' => "Admin {$business->name}",
                    'password' => bcrypt('admin123'),
                    'role' => 'USER',
                    'bussiness_id' => $business->id,
                ]
            );
            $admin->assignRole('admin');

            // Staff 1 & 2
            for ($i = 1; $i <= 2; $i++) {
                $staff = User::firstOrCreate(
                    ['email' => "staff{$i}@{$prefix}.com"],
                    [
                        'username' => "Staff {$i} {$business->name}",
                        'password' => bcrypt('staff123'),
                        'role' => 'USER',
                        'bussiness_id' => $business->id,
                    ]
                );
                $staff->assignRole('staff');
            }
        }
    }
}
