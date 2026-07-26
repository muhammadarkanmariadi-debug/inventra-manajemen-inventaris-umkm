<?php

use Illuminate\Support\Facades\Route;
use App\Domain\Notification\Http\Controllers\PushSubscriptionController;

// Domain Routes for Notification (Prefixed with /api automatically via DomainServiceProvider)
Route::middleware(['auth:sanctum', 'throttle:api'])->prefix('notification')->group(function () {
    Route::post('/subscribe', [PushSubscriptionController::class, 'store']);
    Route::post('/unsubscribe', [PushSubscriptionController::class, 'destroy']);
    Route::get('/subscriptions', [PushSubscriptionController::class, 'index']);
});
