<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class EnsureIdempotency
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only apply idempotency to state-changing methods
        if (!in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            return $next($request);
        }

        $idempotencyKey = $request->header('Idempotency-Key');

        if (!$idempotencyKey) {
            // Depending on strictness, we might enforce it or just let it pass
            // In the prompt, it was mentioned: "Kalau header Idempotency-Key tidak dikirim untuk endpoint yang mewajibkannya -> return 400"
            return response()->json([
                'status' => 'error',
                'message' => 'Idempotency-Key header is required for this request.'
            ], 400);
        }

        // Get tenant (business_id) from the authenticated user or route
        // Assuming user()->business_id is the tenant or we can just scope to user
        $businessId = $request->user()?->business_id ?? $request->user()?->id ?? 1;

        $requestHash = md5(json_encode($request->all()));

        $existingKey = DB::table('idempotency_keys')
            ->where('key', $idempotencyKey)
            ->where('bussiness_id', $businessId)
            ->first();

        if ($existingKey) {
            if ($existingKey->request_hash !== $requestHash) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Idempotency key mismatch: request body changed for the same key.'
                ], 409);
            }

            // Return cached response
            return response(
                $existingKey->response_body,
                $existingKey->response_status
            )->header('Content-Type', 'application/json')
             ->header('Idempotency-Retried', 'true');
        }

        // Process request
        $response = $next($request);

        // Store response
        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 500) {
            try {
                DB::table('idempotency_keys')->insert([
                    'key' => $idempotencyKey,
                    'bussiness_id' => $businessId,
                    'request_hash' => $requestHash,
                    'response_body' => $response->getContent(),
                    'response_status' => $response->getStatusCode(),
                    'expires_at' => now()->addHours(24),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            } catch (\Exception $e) {
                Log::error("Failed to store idempotency key: " . $e->getMessage());
            }
        }

        return $response;
    }
}
