<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSandbox
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Get the tenant/business
        $business = $user->business ?? \App\Models\Business::find($user->business_id);
        
        if (!$business) {
            return response()->json(['message' => 'No business associated with user'], 403);
        }

        $isSandboxRoute = $request->is('api/*/sandbox/*') || $request->is('sandbox/*');

        // If it's a sandbox route, ensure the business is a sandbox business
        if ($isSandboxRoute && !$business->is_sandbox) {
            return response()->json([
                'status' => 'error',
                'message' => 'This token belongs to a production environment and cannot access sandbox endpoints.'
            ], 403);
        }

        // If it's a production route, ensure the business is NOT a sandbox business
        if (!$isSandboxRoute && $business->is_sandbox) {
            return response()->json([
                'status' => 'error',
                'message' => 'This token belongs to a sandbox environment and cannot access production endpoints.'
            ], 403);
        }

        return $next($request);
    }
}
