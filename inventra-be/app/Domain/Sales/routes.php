<?php

use App\Domain\Sales\Http\Controllers\SaleController;
use App\Http\Middleware\AuthenticateMiddleware;
use App\Http\Middleware\PermissionMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(AuthenticateMiddleware::class)->group(function () {
    Route::controller(SaleController::class)->prefix('sales')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Penjualan');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Penjualan');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Penjualan');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Penjualan');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Penjualan');
    });
});
