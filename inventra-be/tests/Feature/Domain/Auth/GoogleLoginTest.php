<?php

namespace Tests\Feature\Domain\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Mockery;
use Tests\TestCase;

class GoogleLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_google_redirect_returns_redirect_response(): void
    {
        $response = $this->get('/api/auth/google/redirect');

        $response->assertStatus(302);
        $this->assertStringContainsString('google.com', $response->headers->get('Location'));
    }

    public function test_google_callback_creates_user_and_logs_in(): void
    {
        $abstractUser = Mockery::mock(\Laravel\Socialite\Two\User::class);
        $abstractUser->shouldReceive('getId')->andReturn('google-123456');
        $abstractUser->shouldReceive('getEmail')->andReturn('testuser@google.com');
        $abstractUser->shouldReceive('getName')->andReturn('Test User');
        $abstractUser->shouldReceive('getAvatar')->andReturn('https://avatar.com/photo.jpg');

        Socialite::shouldReceive('driver')->with('google')->andReturnSelf();
        Socialite::shouldReceive('stateless')->andReturnSelf();
        Socialite::shouldReceive('user')->andReturn($abstractUser);

        $response = $this->get('/api/auth/google/callback');

        $response->assertStatus(302);
        $this->assertStringContainsString('/auth/callback?token=', $response->headers->get('Location'));

        $this->assertDatabaseHas('users', [
            'email' => 'testuser@google.com',
            'google_id' => 'google-123456',
        ]);

        $user = User::where('email', 'testuser@google.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('OWNER'));
        $this->assertAuthenticated();
    }
}
