<?php

namespace App\Domain\Auth\Actions;

use App\Models\User;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as GoogleUser;

class FindOrCreateUserFromGoogleAction
{
    /**
     * Cari atau buat pengguna baru berdasarkan data Google dari Socialite.
     */
    public function execute(GoogleUser $googleUser): User
    {
        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($user) {
            // Update google_id & google_avatar jika user sebelumnya mendaftar via email biasa
            if (!$user->google_id) {
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'google_avatar' => $googleUser->getAvatar(),
                ]);
            }

            return $user;
        }

        // Tentukan username unik untuk menghindari duplikasi
        $baseUsername = $googleUser->getName() ?: explode('@', $googleUser->getEmail())[0];
        $baseUsername = preg_replace('/[^a-zA-Z0-9_]/', '', $baseUsername) ?: 'user';
        $username = $baseUsername;
        $counter = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . '_' . rand(100, 9999);
            $counter++;
            if ($counter > 10) {
                $username = $baseUsername . '_' . Str::random(6);
                break;
            }
        }

        $newUser = User::create([
            'username' => $username,
            'email' => $googleUser->getEmail(),
            'password' => bcrypt(Str::random(16)),
            'google_id' => $googleUser->getId(),
            'google_avatar' => $googleUser->getAvatar(),
        ]);

        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'OWNER', 'guard_name' => 'api']);
        $newUser->assignRole('OWNER');
        $newUser->markEmailAsVerified();

        return $newUser;
    }
}
