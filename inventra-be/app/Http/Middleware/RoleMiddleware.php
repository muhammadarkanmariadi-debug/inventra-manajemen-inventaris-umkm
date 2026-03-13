<?php

namespace App\Http\Middleware;

use App\Helpers\ApiHelper;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if ($user && $user->role === $role) {
            return $next($request);
        }

        return ApiHelper::error(
            'You do not have the ' . $role . ' role to access this resource.',
            403
        );
    }
}
