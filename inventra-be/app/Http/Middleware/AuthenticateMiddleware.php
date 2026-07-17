<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthenticateMiddleware
{
    public function handle(Request $request, Closure $next)
    {
 
        if (!$request->bearerToken()) {
            return response()->json([
                'status'  => false,
                'message' => 'Token tidak ditemukan',
                'data'    => null,
            ], 401);
        }

        try {
            $user = \Tymon\JWTAuth\Facades\JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'status'  => false,
                    'message' => 'User tidak ditemukan',
                    'data'    => null,
                ], 401);
            }

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['status' => false, 'message' => 'Token expired', 'data' => null], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['status' => false, 'message' => 'Token invalid', 'data' => null], 401);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => 'Unauthorized', 'data' => null], 401);
        }

        return $next($request);
    }
}