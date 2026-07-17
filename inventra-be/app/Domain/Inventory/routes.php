<?php

use App\Domain\Inventory\Http\Controllers\ProductController;
use App\Domain\Inventory\Http\Controllers\CategoryController;
use App\Domain\Inventory\Http\Controllers\LocationController;
use App\Domain\Inventory\Http\Controllers\InventoryController;
use App\Http\Middleware\AuthenticateMiddleware;
use App\Http\Middleware\PermissionMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(AuthenticateMiddleware::class)->group(function () {
    Route::controller(ProductController::class)->prefix('products')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Produk');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Produk');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Produk');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Produk');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Produk');
    });

    Route::controller(CategoryController::class)->prefix('categories')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Kategori');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Kategori');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Kategori');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Kategori');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Kategori');
    });

    Route::controller(LocationController::class)->prefix('locations')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Produk');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Produk');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Produk');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Produk');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Produk');
    });

    Route::get('/inventories', [InventoryController::class, 'index'])->middleware(PermissionMiddleware::class . ':Lihat Produk');
    Route::get('/inventories/{id}', [InventoryController::class, 'show'])->middleware(PermissionMiddleware::class . ':Lihat Produk');
    Route::put('/inventory/{id}/status', [InventoryController::class, 'updateStatus'])->middleware(PermissionMiddleware::class . ':Tambah Transaksi Stok');
});
