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
            'Tambah Pengguna',
            'Lihat Pengguna',
            'Ubah Pengguna',
            'Hapus Pengguna',
            
            'Tambah Bisnis',
            'Ubah Bisnis',
            'Hapus Bisnis',
            'Lihat Bisnis',
            'Bisnis Saya',
            
            'Tambah Supplier',
            'Lihat Supplier',
            'Ubah Supplier',
            'Hapus Supplier',
            
            'Tambah Produk',
            'Lihat Produk',
            'Ubah Produk',
            'Hapus Produk',
            
            'Tambah Kategori',
            'Lihat Kategori',
            'Ubah Kategori',
            'Hapus Kategori',
            
            'Tambah Peran',
            'Lihat Peran',
            'Ubah Peran',
            'Hapus Peran',
            
            'Tambah Transaksi Stok',
            'Lihat Transaksi Stok',
            'Ubah Transaksi Stok',
            'Hapus Transaksi Stok',

            'Tambah Penjualan',
            'Lihat Penjualan',
            'Ubah Penjualan',
            'Hapus Penjualan',
            
            'Tambah Kategori Keuangan',
            'Lihat Kategori Keuangan',
            'Ubah Kategori Keuangan',
            'Hapus Kategori Keuangan',
            
            'Tambah Transaksi Keuangan',
            'Lihat Transaksi Keuangan',
            'Ubah Transaksi Keuangan',
            'Hapus Transaksi Keuangan',
            
            'Lihat Dashboard',
            
            'Tambah Hak Akses',
            'Lihat Hak Akses',
            'Ubah Hak Akses',
            'Hapus Hak Akses',
            
            'Tambah Pembelian',
            'Lihat Pembelian',
            'Ubah Pembelian',
            'Hapus Pembelian',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'api']);
        }
    }
}
