<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner = Role::firstOrCreate(['name' => 'owner', 'guard_name' => 'api']);
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'api']);
        $staff = Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'api']);

        $owner->syncPermissions(Permission::all());

        $admin->syncPermissions(
            Permission::where('name', 'not like', '%Pengguna')
                ->where('name', '!=', 'Lihat Bisnis')
                ->get()
        );

        $staff->syncPermissions(
            Permission::where('name', 'Lihat Produk')
                ->orWhere('name', 'Lihat Supplier')
                ->orWhere('name', 'Lihat Kategori')
                ->orWhere('name', 'Tambah Transaksi Stok')
                ->orWhere('name', 'Lihat Transaksi Stok')
                ->orWhere('name', 'Tambah Penjualan')
                ->orWhere('name', 'Lihat Penjualan')
                ->orWhere('name', 'Lihat Kategori Keuangan')
                ->orWhere('name', 'Tambah Transaksi Keuangan')
                ->orWhere('name', 'Lihat Transaksi Keuangan')
                ->orWhere('name', 'Bisnis Saya')
                ->get()
        );
    }
}
