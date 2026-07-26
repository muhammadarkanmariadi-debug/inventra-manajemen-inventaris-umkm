<?php

use App\Domain\Purchase\Http\Controllers\PurchaseController;
use App\Domain\Purchase\Http\Controllers\SupplierController;
use App\Http\Middleware\AuthenticateMiddleware;
use App\Http\Middleware\PermissionMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(AuthenticateMiddleware::class)->group(function () {
    Route::controller(SupplierController::class)->prefix('suppliers')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Supplier');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Supplier');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Supplier');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Supplier');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Supplier');
    });

    Route::controller(PurchaseController::class)->prefix('purchases')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Pembelian');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Pembelian');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Pembelian');
    });
});
