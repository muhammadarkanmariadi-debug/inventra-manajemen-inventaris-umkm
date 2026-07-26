<?php

use App\Domain\Subscription\Http\Controllers\SubscriptionController;
use App\Http\Middleware\AuthenticateMiddleware;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes for pricing page
    Route::get('/plans', [SubscriptionController::class, 'indexPlans']);
    Route::get('/addons', [SubscriptionController::class, 'indexAddons']);

    // Authenticated routes for tenant billing & subscription management
    Route::middleware(AuthenticateMiddleware::class)->group(function () {
        Route::get('/tenant/subscription', [SubscriptionController::class, 'getTenantSubscription']);
        Route::post('/tenant/subscription/upgrade', [SubscriptionController::class, 'upgradeSubscription']);
        Route::post('/tenant/subscription/addons', [SubscriptionController::class, 'toggleAddon']);
        Route::get('/tenant/usage', [SubscriptionController::class, 'getUsage']);
    });
});
