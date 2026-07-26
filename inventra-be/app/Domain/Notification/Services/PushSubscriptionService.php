<?php

namespace App\Domain\Notification\Services;

use App\Models\User;
use NotificationChannels\WebPush\PushSubscription;
use Illuminate\Database\Eloquent\Collection;

class PushSubscriptionService
{
    /**
     * Subscribe user to WebPush notification channel.
     */
    public function subscribe(User $user, array $data): PushSubscription
    {
        return $user->updatePushSubscription(
            $data['endpoint'],
            $data['keys']['p256dh'],
            $data['keys']['auth']
        );
    }

    /**
     * Unsubscribe user from WebPush notification channel.
     */
    public function unsubscribe(User $user, string $endpoint): void
    {
        $user->deletePushSubscription($endpoint);
    }

    /**
     * Get all active push subscriptions for a user.
     */
    public function getSubscriptions(User $user): Collection
    {
        return $user->pushSubscriptions;
    }
}
