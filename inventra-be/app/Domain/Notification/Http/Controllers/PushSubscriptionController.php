<?php

namespace App\Domain\Notification\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Notification\Http\Requests\SubscribePushRequest;
use App\Domain\Notification\Services\PushSubscriptionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    public function __construct(
        protected PushSubscriptionService $pushService
    ) {}

    /**
     * Subscribe current user to WebPush notifications.
     */
    public function store(SubscribePushRequest $request): JsonResponse
    {
        $this->pushService->subscribe($request->user(), $request->validated());

        return response()->json([
            'message' => 'Push subscription saved successfully.'
        ], 200);
    }

    /**
     * Unsubscribe current user from WebPush notifications by endpoint.
     */
    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'endpoint' => ['required', 'string', 'max:500'],
        ]);

        $this->pushService->unsubscribe($request->user(), $validated['endpoint']);

        return response()->json([
            'message' => 'Push subscription deleted successfully.'
        ], 200);
    }

    /**
     * List current user's push subscriptions.
     */
    public function index(Request $request): JsonResponse
    {
        $subscriptions = $this->pushService->getSubscriptions($request->user());

        return response()->json([
            'subscriptions' => $subscriptions
        ], 200);
    }
}
