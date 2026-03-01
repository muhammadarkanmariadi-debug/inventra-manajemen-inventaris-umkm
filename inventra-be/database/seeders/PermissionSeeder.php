<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'user.create',
            'user.view',
            'user.update',
            'user.delete',
            'bussiness.create',
            'bussiness.update',
            'bussiness.delete',
            'bussiness.view',
            'bussiness.me',
            'supplier.create',
            'supplier.view',
            'supplier.update',
            'supplier.delete',
            'product.create',
            'product.view',
            'product.update',
            'product.delete',
            'category.create',
            'category.view',
            'category.update',
            'category.delete',
            'roles.create',
            'roles.view',
            'roles.update',
            'roles.delete',
            'stockTransaction.create',
            'stockTransaction.view',
            'stockTransaction.update',
            'stockTransaction.delete',
            'hppComponents.create',
            'hppComponents.view',
            'hppComponents.update',
            'hppComponents.delete',
            'sales.create',
            'sales.view',
            'sales.update',
            'sales.delete',
            'financialCategory.create',
            'financialCategory.view',
            'financialCategory.update',
            'financialCategory.delete',
            'financialTransaction.create',
            'financialTransaction.view',
            'financialTransaction.update',
            'financialTransaction.delete',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'api']);
        }
    }
}
