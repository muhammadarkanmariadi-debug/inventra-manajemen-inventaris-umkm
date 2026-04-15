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
        $users = [
            [
                'username' => 'Owner User',
                'email' => 'owner@example.com',
                'password' => bcrypt('owner1234'),
                'role' => 'USER',
                'roles' => 'owner',

            ],
            [
                'username' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('admin1234'),
                'role' => 'USER',
                'roles' => 'admin',

            ],
            [
                'username' => 'Staff User',
                'email' => 'staff@example.com',
                'password' => bcrypt('staff1234'),

                'role' => 'USER',
                'roles' =>  'staff',
            ],
            [
                'username' => 'Superadmin User',
                'email' => 'superadmin@example.com',
                'password' => bcrypt('superadmin1234'),
                'role' => 'SUPERADMIN',
                'roles' => ['owner', 'admin', 'staff'],

            ]
        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                [
                    'username' => $user['username'],
                    'password' => $user['password'],
                    'role' => $user['role'],
                    'bussiness_id' => 1,
                ]
            );
        }

        foreach ($users as $user) {
            $userModel = User::where('email', $user['email'])->first();
            if ($userModel) {
                $userModel->assignRole($user['roles']);
            }
        }
    }
}
