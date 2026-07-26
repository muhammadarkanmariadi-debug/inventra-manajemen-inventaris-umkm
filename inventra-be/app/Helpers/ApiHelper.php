<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;

class ApiHelper
{
    public static function success(
        string $message = 'Success',
        $data = null,
        int $statusCode = 200
    ): JsonResponse {
        return response()->json([
            'status'  => true,
            'message' => $message,
            'data'    => $data
        ], $statusCode);
    }

    public static function error(
        string $message = 'Error',
        int $statusCode = 400
    ): JsonResponse {
        return response()->json([
            'status'  => false,
            'message' => $message,

        ], $statusCode);
    }

  
}
