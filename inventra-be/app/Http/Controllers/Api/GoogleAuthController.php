<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                // Link account if registering externally initially
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->id,
                        'google_avatar' => $googleUser->avatar
                    ]);
                }
            } else {
                // Register new external user
                $user = User::create([
                    'email' => $googleUser->email,
                    'username' => explode('@', $googleUser->email)[0] . rand(10,99),
                    'password' => Hash::make(Str::random(16)),
                    'google_id' => $googleUser->id,
                    'google_avatar' => $googleUser->avatar,
                    // Basic Setup
                ]);
                $user->assignRole('OWNER'); 
                $user->markEmailAsVerified();
            }

            // Generate JWT using Tymon JWTAuth facade
            $token = Auth::guard('api')->login($user);

            // Redirect back to frontend
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->away($frontendUrl . '/auth/callback?token=' . $token);

        } catch (\Exception $e) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->away($frontendUrl . '/auth/callback?error=' . urlencode($e->getMessage()));
        }
    }
}
