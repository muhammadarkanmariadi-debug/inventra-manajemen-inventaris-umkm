<?php

namespace Database\Seeders;

use Google\Service\AndroidEnterprise\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission as ModelsPermission;
use Spatie\Permission\Models\Role;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner = Role::create(['name' => 'owner', 'guard_name' => 'api']);
        $admin = Role::create(['name' => 'admin', 'guard_name' => 'api']);
        $staff = Role::create(['name' => 'staff', 'guard_name' => 'api']);


        $owner->syncPermissions([ModelsPermission::all()]);
        $admin->syncPermissions([ModelsPermission::where('name', 'not like', 'user.%')->get()]);
        $staff->syncPermissions([ModelsPermission::where('name', 'like', 'product.%')
            ->orWhere('name', 'like', 'supplier.%')
            ->orWhere('name', 'like', 'bussiness.%')
            ->get()]);
            
    }
}
