<?php

use App\Http\Controllers\BusinessController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FinancialCategoryController;
use App\Http\Controllers\FinancialTransactionController;
use App\Http\Controllers\GeminiController;

use App\Http\Controllers\HppComponentController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\StockTransactionController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AuthenticateMiddleware;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;
use  App\Http\Middleware\PermissionMiddleware;
use Tymon\JWTAuth\Http\Middleware\Authenticate as MiddlewareAuthenticate;
use App\Http\Controllers\PermissionController;

Route::controller(UserController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
});




Route::middleware(AuthenticateMiddleware::class)->group(function () {

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
        Route::post('/', 'store')->withoutMiddleware(PermissionMiddleware::class . ':bussiness.*');
        Route::get('/me', 'showOwn')->middleware(PermissionMiddleware::class . ':bussiness.me');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':bussiness.view')->middleware(RoleMiddleware::class . ':SUPERADMIN');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':bussiness.view')->middleware(RoleMiddleware::class . ':SUPERADMIN');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':bussiness.update');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':bussiness.delete');
    });

    Route::controller(UserController::class)->prefix('user')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':user.create');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':user.view');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':user.update');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':user.view');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':user.delete');
    });

    Route::controller(ProductController::class)->prefix('products')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':product.create');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':product.update');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':product.view');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':product.view');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':product.delete');
    });

    Route::controller(CategoryController::class)->prefix('categories')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':category.create');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':category.update');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':category.view');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':category.view');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':category.delete');
    });

    Route::controller(SupplierController::class)->prefix('suppliers')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':supplier.create');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':supplier.view');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':supplier.view');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':supplier.update');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':supplier.delete');
    });

    Route::controller(RoleController::class)->prefix('roles')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':roles.create');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':roles.view');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':roles.view');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':roles.update');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':roles.delete');
    });

    Route::controller(StockTransactionController::class)->prefix('stock-transactions')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':stockTransaction.create');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':stockTransaction.view');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':stockTransaction.view');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':stockTransaction.update');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':stockTransaction.delete');
    });

    Route::controller(SaleController::class)->prefix('sales')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':sales.create');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':sales.view');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':sales.view');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':sales.update');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':sales.delete');
    });

    Route::controller(HppComponentController::class)->prefix('hpp-components')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':hppComponents.create');
        Route::get('/', 'indexByProduct')->middleware(PermissionMiddleware::class . ':hppComponents.view');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':hppComponents.view');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':hppComponents.update');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':hppComponents.delete');
    });

    Route::controller(FinancialCategoryController::class)->prefix('financial-categories')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':financialCategory.create');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':financialCategory.view');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':financialCategory.view');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':financialCategory.update');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':financialCategory.delete');
    });

    Route::controller(FinancialTransactionController::class)->prefix('financial-transactions')->group(function () {
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':financialTransaction.create');
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':financialTransaction.view');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':financialTransaction.view');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':financialTransaction.update');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':financialTransaction.delete');
    });

    Route::controller(StatisticController::class)->prefix('statistic')->group(function () {
        Route::get('/products', 'produk');
        Route::get('/sales', 'penjualan');
    });

    Route::controller(PermissionController::class)->prefix('permissions')->group(function () {
        Route::get('/', 'index')->middleware(PermissionMiddleware::class . ':permission.view');
        Route::post('/', 'store')->middleware(PermissionMiddleware::class . ':permission.create');
        Route::get('/{id}', 'show')->middleware(PermissionMiddleware::class . ':permission.view');
        Route::put('/{id}', 'update')->middleware(PermissionMiddleware::class . ':permission.update');
        Route::delete('/{id}', 'destroy')->middleware(PermissionMiddleware::class . ':permission.delete');
    });
});
