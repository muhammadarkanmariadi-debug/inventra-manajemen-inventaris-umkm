<?php

namespace Tests\Feature\Domain\Notification;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PushSubscriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_subscribe_to_webpush(): void
    {
        $user = User::factory()->create();

        $payload = [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/test-endpoint-12345',
            'keys' => [
                'p256dh' => 'dummy-p256dh-key-string',
                'auth' => 'dummy-auth-token-string',
            ],
        ];

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/notification/subscribe', $payload);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Push subscription saved successfully.']);

        $this->assertDatabaseHas('push_subscriptions', [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/test-endpoint-12345',
        ]);
    }

    public function test_authenticated_user_can_unsubscribe_from_webpush(): void
    {
        $user = User::factory()->create();
        $user->updatePushSubscription('https://fcm.googleapis.com/fcm/send/test-endpoint-12345', 'key', 'token');

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/notification/unsubscribe', [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/test-endpoint-12345',
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Push subscription deleted successfully.']);

        $this->assertDatabaseMissing('push_subscriptions', [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/test-endpoint-12345',
        ]);
    }

    public function test_unauthenticated_user_cannot_subscribe_to_webpush(): void
    {
        $payload = [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/test-endpoint-12345',
            'keys' => [
                'p256dh' => 'dummy-p256dh-key-string',
                'auth' => 'dummy-auth-token-string',
            ],
        ];

        $response = $this->postJson('/api/notification/subscribe', $payload);

        $response->assertStatus(401);
    }
}
