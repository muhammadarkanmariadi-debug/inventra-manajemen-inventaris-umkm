<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin     = Role::firstOrCreate(['name' => 'super_admin',      'guard_name' => 'api']);
        $owner          = Role::firstOrCreate(['name' => 'owner',            'guard_name' => 'api']);
        $manager        = Role::firstOrCreate(['name' => 'manager',          'guard_name' => 'api']);
        $operatorGudang = Role::firstOrCreate(['name' => 'operator_gudang',  'guard_name' => 'api']);
        $qc             = Role::firstOrCreate(['name' => 'qc',               'guard_name' => 'api']);

        // Super Admin & Owner: semua permission
        $superAdmin->syncPermissions(Permission::all());
        $owner->syncPermissions(Permission::all());

        // Manager: semua kecuali manajemen pengguna, peran, & kelola bisnis level owner
        $manager->syncPermissions(
            Permission::where('name', 'not like', '%Pengguna')
                ->where('name', 'not like', '%Peran')
                ->where('name', '!=', 'Lihat Bisnis')
                ->where('name', '!=', 'Kelola Role')
                ->get()
        );

        // Operator Gudang: fokus operasional stok & penjualan
        $operatorGudang->syncPermissions(
            Permission::whereIn('name', [
                'Bisnis Saya',
                // Produk & Kategori (read + input)
                'Lihat Produk',
                'Tambah Produk',
                'Ubah Produk',
                'Lihat Kategori',
                // Supplier (read only)
                'Lihat Supplier',
                // Stok & Gudang (full operasional)
                'Lihat Transaksi Stok',
                'Tambah Transaksi Stok',
                'Lihat Stok Opname',
                'Tambah Stok Opname',
                // QC (read only)
                'Lihat Pemeriksaan QC',
                // Penjualan (input & read)
                'Lihat Penjualan',
                'Tambah Penjualan',
                // Pembelian & Supplier
                'Lihat Pembelian',
                // Keuangan (terbatas)
                'Lihat Kategori Keuangan',
                'Lihat Transaksi Keuangan',
                'Tambah Transaksi Keuangan',
                // Laporan & Dokumen
                'Lihat Laporan Stok',
                'Lihat Dokumen',
                'Tambah Dokumen',
                'Lihat Dashboard',
            ])->get()
        );

        // QC: fokus pemeriksaan kualitas & visibilitas data
        $qc->syncPermissions(
            Permission::whereIn('name', [
                'Bisnis Saya',
                // Produk & Supplier (read only)
                'Lihat Produk',
                'Lihat Kategori',
                'Lihat Supplier',
                // Stok (read only)
                'Lihat Transaksi Stok',
                'Lihat Stok Opname',
                // QC (full operasional kecuali hapus)
                'Lihat Pemeriksaan QC',
                'Tambah Pemeriksaan QC',
                'Ubah Pemeriksaan QC',
                // Laporan stok & Dokumen
                'Lihat Laporan Stok',
                'Lihat Dokumen',
                'Tambah Dokumen',
                'Lihat Dashboard',
            ])->get()
        );

        $sales = Role::firstOrCreate(['name' => 'sales', 'guard_name' => 'api']);
        // Sales: fokus penjualan & visibilitas produk/stok
        $sales->syncPermissions(
            Permission::whereIn('name', [
                'Bisnis Saya',
                // Produk & Kategori (read only)
                'Lihat Produk',
                'Lihat Kategori',
                // Penjualan (full operasional)
                'Lihat Penjualan',
                'Tambah Penjualan',
                'Ubah Penjualan',
                // Stok (read only)
                'Lihat Transaksi Stok',
                // Dashboard & Laporan
                'Lihat Dashboard',
                'Lihat Laporan Stok',
                'Lihat Dokumen',
                'Tambah Dokumen',
            ])->get()
        );
    }
}