<?php

use App\Http\Controllers\SuperadminController;

use App\Http\Controllers\BusinessController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FinancialCategoryController;
use App\Http\Controllers\FinancialTransactionController;
use App\Http\Controllers\GeminiController;

use App\Http\Controllers\LogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\StockTransactionController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AuthenticateMiddleware;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;
use  App\Http\Middleware\PermissionMiddleware;
use Tymon\JWTAuth\Http\Middleware\Authenticate as MiddlewareAuthenticate;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\Api\VerificationController;
use App\Http\Controllers\Api\GoogleAuthController;

Route::controller(UserController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
});

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');
Route::post('/auth/firebase-google', [GoogleAuthController::class, 'firebaseGoogle']);

Route::middleware(AuthenticateMiddleware::class)->group(function () {
    Route::post('/email/resend', [VerificationController::class, 'resend']);

    Route::controller(GeminiController::class)->prefix('gemini')->group(function () {
        Route::get('/inventory', 'analyzeInventory');
        Route::get('/sales',     'analyzeSales');
        Route::get('/financial', 'analyzeFinancial');
        Route::post('/ask',      'ask');
    });
    Route::controller(UserController::class)->group(function () {
        Route::get('/profile', 'getProfile');
        Route::post('/logout', 'logout');
        Route::put('/update-profile', 'updateProfile');
    });

    Route::get('/logs', [LogController::class, 'index']);

    Route::controller(BusinessController::class)->prefix('bussiness')->group(function () {
        Route::post('/', 'store')->withoutMiddleware(PermissionMiddleware::class . ':Tambah Bisnis');
        Route::get('/me', 'showOwn')->middleware(PermissionMiddleware::class . ':Bisnis Saya');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Bisnis')->middleware(RoleMiddleware::class . ':SUPERADMIN');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Bisnis')->middleware(RoleMiddleware::class . ':SUPERADMIN');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Bisnis');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Bisnis');
    });

    Route::controller(UserController::class)->prefix('user')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Pengguna');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Pengguna');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Pengguna');
        Route::get('/', 'indexByBusiness')->middleware(PermissionMiddleware::class . ':Lihat Pengguna');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Pengguna');
    });

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

    Route::controller(RoleController::class)->prefix('roles')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Peran');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Peran');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Peran');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Peran');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Peran');
    });

    Route::controller(SaleController::class)->prefix('sales')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Penjualan');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Penjualan');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Penjualan');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Penjualan');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Penjualan');
    });

    Route::controller(FinancialCategoryController::class)->prefix('financial-categories')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Kategori Keuangan');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Kategori Keuangan');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Kategori Keuangan');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Kategori Keuangan');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Kategori Keuangan');
    });

    Route::controller(FinancialTransactionController::class)->prefix('financial-transactions')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Transaksi Keuangan');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Transaksi Keuangan');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Transaksi Keuangan');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Transaksi Keuangan');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Transaksi Keuangan');
    });

    Route::controller(StatisticController::class)->prefix('statistic')->group(function () {
        Route::get('/products', 'produk');
        Route::get('/sales', 'penjualan');
        Route::get('/financial', 'keuangan');
        Route::get('/prediksi/{id}', 'prediksi');
        Route::get('/defect/{id}', 'defect');
        Route::get('/incomeexpenses', 'incomeExpenses');
    });

    Route::post('/scan', [ScanController::class, 'scan'])->middleware(PermissionMiddleware::class . ':Lihat Produk');
    Route::get('/inventories', [InventoryController::class, 'index'])->middleware(PermissionMiddleware::class . ':Lihat Produk');
    Route::get('/inventories/{id}', [InventoryController::class, 'show'])->middleware(PermissionMiddleware::class . ':Lihat Produk');
    Route::put('/inventory/{id}/status', [InventoryController::class, 'updateStatus'])->middleware(PermissionMiddleware::class . ':Tambah Transaksi Stok');
    Route::post('/transactions', [TransactionController::class, 'store'])->middleware(PermissionMiddleware::class . ':Tambah Transaksi Stok');

    Route::controller(LocationController::class)->prefix('locations')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Produk');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Produk');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Produk');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Produk');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Produk');
    });

    Route::controller(PermissionController::class)->prefix('permissions')->group(function () {
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Hak Akses');
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Hak Akses');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Hak Akses');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Hak Akses');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Hak Akses');
    });

    Route::controller(DocumentController::class)->prefix('documents')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::get('/{id}/download', 'download');
        Route::delete('/{id}', 'destroy');
    });

    // ========== SUPERADMIN ROUTES ==========
    Route::middleware(RoleMiddleware::class . ':SUPERADMIN')->prefix('superadmin')->group(function () {
        Route::get('/users', [SuperadminController::class, 'allUsers']);
        Route::get('/users/{id}', [SuperadminController::class, 'showUser']);
        Route::put('/users/{id}', [SuperadminController::class, 'updateUser']);
        Route::delete('/users/{id}', [SuperadminController::class, 'deleteUser']);

        Route::get('/businesses', [SuperadminController::class, 'allBusinesses']);
        Route::get('/businesses/{id}', [SuperadminController::class, 'showBusiness']);
        Route::put('/businesses/{id}', [SuperadminController::class, 'updateBusiness']);
        Route::delete('/businesses/{id}', [SuperadminController::class, 'deleteBusiness']);
    });
});
