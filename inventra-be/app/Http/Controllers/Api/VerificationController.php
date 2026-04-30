<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use App\Helpers\ApiHelper;

class VerificationController extends Controller
{
    public function verify(Request $request, $id, $hash)
    {
        try {
            $user = User::findOrFail($id);

            if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
                return response()->json(['status' => false, 'message' => 'Link verifikasi tidak valid atau telah usang.'], 403);
            }

            if ($user->hasVerifiedEmail()) {
                return response()->json(['status' => true, 'message' => 'Email telah terverifikasi.'], 400);
            }

            if ($user->markEmailAsVerified()) {
                event(new \Illuminate\Auth\Events\Verified($user));
            }

            return response()->json(['status' => true, 'message' => 'Email berhasil diverifikasi!']);
        } catch (\Exception $e) {
            Log::error('Verification error: ' . $e->getMessage());
            return ApiHelper::error('Gagal memverifikasi akun.', 500);
        }
    }

    public function resend(Request $request)
    {
        try {
            $user = auth()->user();

            if ($user->hasVerifiedEmail()) {
                return response()->json(['status' => false, 'message' => 'Email sudah terverifikasi.'], 400);
            }

            $user->sendEmailVerificationNotification();

            return response()->json(['status' => true, 'message' => 'Link verifikasi telah dikirim.']);
        } catch (\Exception $e) {
            return ApiHelper::error('Gagal mengirim ulang verifikasi.', 500);
        }
    }
}
