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
// use App\Http\Controllers\Api\GoogleAuthController; // Deprecated, moved to Domain/Auth

Route::controller(UserController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
});

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify');
// Route::post('/auth/firebase-google', [GoogleAuthController::class, 'firebaseGoogle']); // Deprecated, migrated to Socialite Domain/Auth

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

    Route::get('/logs', [LogController::class, 'index'])->middleware(PermissionMiddleware::class . ':Lihat Log');

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

    // Migrated to Domain/Inventory/routes.php:
    // Route::controller(ProductController::class)->prefix('products')->group(...)
    // Route::controller(CategoryController::class)->prefix('categories')->group(...)

    // Migrated to Domain/Purchase/routes.php:
    // Route::controller(SupplierController::class)->prefix('suppliers')->group(function () { ... });
    // Route::controller(PurchaseController::class)->prefix('purchases')->group(function () { ... });

    Route::controller(RoleController::class)->prefix('roles')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Peran');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Peran');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Peran');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Peran');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Peran');
    });

    // Migrated to Domain/Sales/routes.php:
    // Route::controller(SaleController::class)->prefix('sales')->group(function () { ... });

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

    Route::controller(StatisticController::class)->prefix('statistic')->middleware(PermissionMiddleware::class . ':Lihat Statistik')->group(function () {
        Route::get('/products', 'produk');
        Route::get('/sales', 'penjualan');
        Route::get('/financial', 'keuangan');
        Route::get('/prediksi/{id}', 'prediksi');
        Route::get('/defect/{id}', 'defect');
        Route::get('/incomeexpenses', 'incomeExpenses');
    });

    Route::post('/scan', [ScanController::class, 'scan'])->middleware(PermissionMiddleware::class . ':Lihat Produk');
    // Migrated to Domain/Inventory/routes.php:
    // Route::get('/inventories', [InventoryController::class, 'index'])->middleware(PermissionMiddleware::class . ':Lihat Produk');
    // Route::get('/inventories/{id}', [InventoryController::class, 'show'])->middleware(PermissionMiddleware::class . ':Lihat Produk');
    // Route::put('/inventory/{id}/status', [InventoryController::class, 'updateStatus'])->middleware(PermissionMiddleware::class . ':Tambah Transaksi Stok');
    Route::post('/transactions', [TransactionController::class, 'store'])->middleware(PermissionMiddleware::class . ':Tambah Transaksi Stok');

    // Migrated to Domain/Inventory/routes.php:
    // Route::controller(LocationController::class)->prefix('locations')->group(...)

    Route::controller(PermissionController::class)->prefix('permissions')->group(function () {
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Hak Akses');
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Hak Akses');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Hak Akses');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':Ubah Hak Akses');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Hak Akses');
    });

    Route::controller(DocumentController::class)->prefix('documents')->group(function () {
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':Lihat Dokumen');
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':Tambah Dokumen');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':Lihat Dokumen');
        Route::get('/{id}/download', 'download')->middleware(PermissionMiddleware::class . ':Lihat Dokumen');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':Hapus Dokumen');
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

    // ========== SANDBOX ROUTES ==========
    Route::middleware(['sandbox'])->prefix('sandbox')->group(function () {
        Route::post('/reset', [\App\Http\Controllers\SandboxController::class, 'reset']);
    });

    // ========== ERP INTEGRATION ROUTES (IDEMPOTENCY) ==========
    Route::middleware(['idempotency'])->group(function () {
        // Minimal viable endpoints untuk ERP
        Route::post('/purchases', [\App\Http\Controllers\PurchaseController::class, 'store'])->middleware(PermissionMiddleware::class . ':Tambah Pembelian');
    });

    // ========== ERP INTEGRATION ROUTES (READ) ==========
    Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index'])->middleware(PermissionMiddleware::class . ':Lihat Produk');
    Route::get('/stock', [\App\Http\Controllers\InventoryController::class, 'index'])->middleware(PermissionMiddleware::class . ':Lihat Produk');
    Route::get('/sales', [\App\Http\Controllers\SaleController::class, 'index'])->middleware(PermissionMiddleware::class . ':Lihat Penjualan');
});
