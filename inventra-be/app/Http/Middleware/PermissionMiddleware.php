<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Permission\Middleware\PermissionMiddleware as SpatiePermissionMiddleware;
use Spatie\Permission\Exceptions\UnauthorizedException;

class PermissionMiddleware extends SpatiePermissionMiddleware
{
    public function handle(Request $request, Closure $next, $permission, ?string $guard = null): mixed
    {
        try {
            return parent::handle($request, $next, $permission, $guard);
        } catch (UnauthorizedException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 403);
        }
    }
}