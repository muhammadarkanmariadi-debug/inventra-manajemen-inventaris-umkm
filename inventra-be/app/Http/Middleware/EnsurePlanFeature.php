<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Helpers\ApiHelper;

class EnsurePlanFeature
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $featureKey): Response
    {
        $user = auth()->guard('api')->user();

        if (!$user || !$user->bussiness_id) {
            return ApiHelper::error('Unauthorized or business not found.', 401);
        }

        if ($user->role === 'SUPERADMIN') {
            return $next($request);
        }

        $business = $user->business;
        if (!$business || !$business->hasFeature($featureKey)) {
            return response()->json([
                'status' => false,
                'message' => 'Fitur ini memerlukan paket atau add-on tertentu yang aktif. Silakan upgrade paket Anda untuk menggunakan fitur ini.',
                'error_code' => 'PLAN_FEATURE_RESTRICTED',
                'required_feature' => $featureKey,
            ], 403);
        }

        return $next($request);
    }
}
