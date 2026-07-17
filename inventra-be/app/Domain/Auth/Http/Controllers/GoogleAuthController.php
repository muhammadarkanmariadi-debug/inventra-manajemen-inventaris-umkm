<?php

namespace App\Domain\Auth\Http\Controllers;

use App\Domain\Auth\Actions\FindOrCreateUserFromGoogleAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect browser pengguna ke Google Consent Screen.
     */
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Tangani callback dari Google OAuth dan proses login/registrasi.
     */
    public function callback(Request $request, FindOrCreateUserFromGoogleAction $action)
    {
        $frontendUrl = rtrim(config('app.frontend_url', env('FRONTEND_URL', 'http://localhost:3000')), '/');

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $user = $action->execute($googleUser);

            // Login user via Sanctum (Stateful SPA Cookie Session di guard web)
            /** @var \Illuminate\Contracts\Auth\StatefulGuard $webGuard */
            $webGuard = auth()->guard('web');
            $webGuard->login($user);

            // Terbitkan token API (guard api) untuk kompabilitas hybrid dengan SPA Next.js eksisting
            /** @var \Tymon\JWTAuth\JWTGuard $apiGuard */
            $apiGuard = auth()->guard('api');
            $token = $apiGuard->login($user);

            return redirect($frontendUrl . '/auth/callback?token=' . urlencode($token));
        } catch (\Exception $e) {
            Log::error('Socialite Google Auth Callback Error: ' . $e->getMessage());
            return redirect($frontendUrl . '/auth/callback?error=' . urlencode('Gagal verifikasi dengan Google: ' . $e->getMessage()));
        }
    }
}
