<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Helpers\ApiHelper;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
    public function firebaseGoogle(Request $request)
    {
        try {
            $token = $request->input('token');
            if (!$token) {
                return ApiHelper::error('Missing token', 400);
            }

            // Fetch Google Secure Token Public Keys (cached optimally in production)
            $keysJson = file_get_contents('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
            $keys = json_decode($keysJson, true);
            
            // Extract the 'kid' (Key ID) from the JWT header
            $tks = explode('.', $token);
            if (count($tks) != 3) {
                 return ApiHelper::error('Wrong number of segments in token', 400);
            }
            $header = json_decode(base64_decode(strtr($tks[0], '-_', '+/')));
            if (!$header || !isset($header->kid)) {
                 return ApiHelper::error('Invalid JWT Header', 400);
            }
            $kid = $header->kid;
            
            if (!isset($keys[$kid])) {
                 return ApiHelper::error('Invalid signature kid', 400);
            }

            // Decode the token using the corresponding public key
            $decoded = JWT::decode($token, new Key($keys[$kid], 'RS256'));

            // Determine user data from token
            $email = $decoded->email ?? null;
            $googleId = $decoded->sub ?? null;
            $name = $decoded->name ?? (explode('@', $email)[0] . rand(10,99));
            $avatar = $decoded->picture ?? null;

            if (!$email) {
                return ApiHelper::error('Token incomplete, missing email.', 400);
            }

            $user = User::where('email', $email)->first();

            if ($user) {
                // Link account if registering externally initially
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleId,
                        'google_avatar' => $avatar
                    ]);
                }
            } else {
                // Register new external user
                $user = User::create([
                    'email' => $email,
                    'username' => $name,
                    'password' => Hash::make(Str::random(16)),
                    'google_id' => $googleId,
                    'google_avatar' => $avatar,
                ]);
                $user->assignRole('OWNER'); 
                $user->markEmailAsVerified();
            }

            // Generate application JWT using Tymon JWTAuth facade
            $jwtAuthToken = Auth::guard('api')->login($user);

            return ApiHelper::success('Sukses login menggunakan Google Firebase.', [
                'user' => $user,
                'token' => $jwtAuthToken,
                'token_type' => 'bearer',
            ], 200);

        } catch (Exception $e) {
            Log::error('Firebase Google Auth error: ' . $e->getMessage());
            return ApiHelper::error('Gagal verifikasi Google token: ' . $e->getMessage(), 500);
        }
    }
}
