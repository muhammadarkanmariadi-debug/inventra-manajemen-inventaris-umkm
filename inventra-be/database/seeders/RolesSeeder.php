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


        $owner->syncPermissions(ModelsPermission::all());

        $admin->syncPermissions(
            ModelsPermission::where('name', 'not like', 'user.%')
                ->where('name', 'not like', 'bussiness.view')
                ->get()
        );


        $staff->syncPermissions(
            ModelsPermission::where('name', 'like', 'product.view')
                ->orWhere('name', 'like', 'supplier.view')
                ->orWhere('name', 'like', 'category.view')
                ->orWhere('name', 'like', 'stockTransaction.create')
                ->orWhere('name', 'like', 'stockTransaction.view')
                ->orWhere('name', 'like', 'sales.create')
                ->orWhere('name', 'like', 'sales.view')
                ->orWhere('name', 'like', 'hppComponents.view')
                ->orWhere('name', 'like', 'financialCategory.view')
                ->orWhere('name', 'like', 'financialTransaction.create')
                ->orWhere('name', 'like', 'financialTransaction.view')
                ->orWhere('name', 'like', 'bussiness.me')
                ->get()
        );
    }

    }

