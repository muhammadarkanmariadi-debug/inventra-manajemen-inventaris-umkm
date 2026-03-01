<?php

use App\Http\Controllers\BussinessController;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\FinancialCategoryController;
use App\Http\Controllers\FinancialTransactionController;
use App\Http\Controllers\HppComponentsController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\StockTransactionController;
use App\Http\Controllers\SuppliersController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\RolesMiddleware;
use App\Models\User;
use Google\Service\Compute\Router;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Tymon\JWTAuth\Http\Middleware\Authenticate as MiddlewareAuthenticate;



Route::controller(UserController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
});

Route::middleware(MiddlewareAuthenticate::class)->group(function () {

    Route::controller(UserController::class)->group(function () {
        Route::get('/profile', 'getProfile');
        Route::post('/logout', 'logout');
        Route::put('/profile', 'updateProfile');
    });

    Route::controller(BussinessController::class)->prefix('bussiness')->group(function () {
        Route::post('/', 'createBusiness')->withoutMiddleware(PermissionMiddleware::class . ':bussiness.*');
        Route::get('/me', 'getMyBussiness')->middleware(PermissionMiddleware::class . ':bussiness.view');
        Route::get('/', 'getAllBussiness')->middleware(PermissionMiddleware::class . ':bussiness.view')->middleware(RolesMiddleware::class . ':SUPERADMIN');
        Route::get('/{id}', 'getBussinessById')->middleware(PermissionMiddleware::class . ':bussiness.view')->middleware(RolesMiddleware::class . ':SUPERADMIN');
        Route::put('/{id}', 'updateBussiness')->middleware(PermissionMiddleware::class . ':bussiness.update');
        Route::delete('/{id}', 'deleteBussiness')->middleware(PermissionMiddleware::class . ':bussiness.delete');
    });

    Route::controller(UserController::class)->prefix('user')->group(function () {
        Route::post('/', 'addUser')->middleware(PermissionMiddleware::class . ':user.create');
        Route::get('/{id}', 'getUser')->middleware(PermissionMiddleware::class . ':user.view');
        Route::put('/{id}', 'updateUser')->middleware(PermissionMiddleware::class . ':user.update');
        Route::get('/', 'getAllUsers')->middleware(PermissionMiddleware::class . ':user.view');
        Route::delete('/{id}', 'deleteUser')->middleware(PermissionMiddleware::class . ':user.delete');
    });

    Route::controller(ProductsController::class)->prefix('products')->group(function () {
        Route::post('/', 'createProduct')->middleware(PermissionMiddleware::class . ':product.create');
        Route::put('/{id}', 'updateProduct')->middleware(PermissionMiddleware::class . ':product.update');
        Route::get('/', 'getProducts')->middleware(PermissionMiddleware::class . ':product.view');
        Route::get('/{id}', 'getProduct')->middleware(PermissionMiddleware::class . ':product.view');
        Route::delete('/{id}', 'deleteProduct')->middleware(PermissionMiddleware::class . ':product.delete');
    });

    Route::controller(CategoriesController::class)->prefix('categories')->group(function () {
        Route::post('/', 'createCategory')->middleware(PermissionMiddleware::class . ':category.create');
        Route::put('/{id}', 'updateCategory')->middleware(PermissionMiddleware::class . ':category.update');
        Route::get('/', 'getCategories')->middleware(PermissionMiddleware::class . ':category.view');
        Route::get('/{id}', 'getCategory')->middleware(PermissionMiddleware::class . ':category.view');
        Route::delete('/{id}', 'deleteCategory')->middleware(PermissionMiddleware::class . ':category.delete');
    });

    Route::controller(SuppliersController::class)->prefix('suppliers')->group(function () {
        Route::post('/', 'createSupplier')->middleware(PermissionMiddleware::class . ':supplier.create');
        Route::get('/', 'getSuppliers')->middleware(PermissionMiddleware::class . ':supplier.view');
        Route::get('/{id}', 'getSupplier')->middleware(PermissionMiddleware::class . ':supplier.view');
        Route::put('/{id}', 'updateSupplier')->middleware(PermissionMiddleware::class . ':supplier.update');
        Route::delete('/{id}', 'deleteSupplier')->middleware(PermissionMiddleware::class . ':supplier.delete');
    });

    Route::controller(RolesController::class)->prefix('roles')->group(function () {
        Route::post('/', 'createRole')->middleware(PermissionMiddleware::class . ':roles.create');
        Route::get('/', 'getRoles')->middleware(PermissionMiddleware::class . ':roles.view');
        Route::get('/{id}', 'getRole')->middleware(PermissionMiddleware::class . ':roles.view');
        Route::put('/{id}', 'updateRole')->middleware(PermissionMiddleware::class . ':roles.update');
        Route::delete('/{id}', 'deleteRole')->middleware(PermissionMiddleware::class . ':roles.delete');
    });

    Route::controller(StockTransactionController::class)->prefix('stock-transactions')->group(function () {
        Route::post('/', 'createStockTransaction')->middleware(PermissionMiddleware::class . ':stockTransaction.create');
        Route::get('/', 'getStockTransactions')->middleware(PermissionMiddleware::class . ':stockTransaction.view');
        Route::get('/{id}', 'getStockTransaction')->middleware(PermissionMiddleware::class . ':stockTransaction.view');
        Route::put('/{id}', 'updateStockTransaction')->middleware(PermissionMiddleware::class . ':stockTransaction.update');
        Route::delete('/{id}', 'deleteStockTransaction')->middleware(PermissionMiddleware::class . ':stockTransaction.delete');
    });

    Route::controller(SalesController::class)->prefix('sales')->group(function () {
        Route::post('/', 'createSale')->middleware(PermissionMiddleware::class . ':sales.create');
        Route::get('/', 'getSales')->middleware(PermissionMiddleware::class . ':sales.view');
        Route::get('/{id}', 'getSale')->middleware(PermissionMiddleware::class . ':sales.view');
        Route::put('/{id}', 'updateSale')->middleware(PermissionMiddleware::class . ':sales.update');
        Route::delete('/{id}', 'deleteSale')->middleware(PermissionMiddleware::class . ':sales.delete');
    });

    Route::controller(HppComponentsController::class)->prefix('hpp-components')->group(function () {
        Route::post('/', 'createHppComponent')->middleware(PermissionMiddleware::class . ':hppComponents.create');
        Route::get('/', 'getHppComponents')->middleware(PermissionMiddleware::class . ':hppComponents.view');
        Route::get('/{id}', 'getHppComponent')->middleware(PermissionMiddleware::class . ':hppComponents.view');
        Route::put('/{id}', 'updateHppComponent')->middleware(PermissionMiddleware::class . ':hppComponents.update');
        Route::delete('/{id}', 'deleteHppComponent')->middleware(PermissionMiddleware::class . ':hppComponents.delete');
    });

    Route::controller(FinancialCategoryController::class)->prefix('financial-categories')->group(function () {
    Route::post('/', 'createFinancialCategory')->middleware(PermissionMiddleware::class . ':financialCategory.create');
    Route::get('/', 'getAllFinancialCategory')->middleware(PermissionMiddleware::class . ':financialCategory.view');
    Route::get('/{id}', 'getFinancialCategoryById')->middleware(PermissionMiddleware::class . ':financialCategory.view');
    Route::put('/{id}', 'updateFinancialCategory')->middleware(PermissionMiddleware::class . ':financialCategory.update');
    Route::delete('/{id}', 'deleteFinancialCategory')->middleware(PermissionMiddleware::class . ':financialCategory.delete');
});

Route::controller(FinancialTransactionController::class)->prefix('financial-transactions')->group(function () {
    Route::post('/', 'createFinancialTransaction')->middleware(PermissionMiddleware::class . ':financialTransaction.create');
    Route::get('/', 'getAllFinancialTransaction')->middleware(PermissionMiddleware::class . ':financialTransaction.view');
    Route::get('/{id}', 'getFinancialTransactionById')->middleware(PermissionMiddleware::class . ':financialTransaction.view');
    Route::put('/{id}', 'updateFinancialTransaction')->middleware(PermissionMiddleware::class . ':financialTransaction.update');
    Route::delete('/{id}', 'deleteFinancialTransaction')->middleware(PermissionMiddleware::class . ':financialTransaction.delete');
});
});
