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
        $errors = null,
        int $statusCode = 400
    ): JsonResponse {
        return response()->json([
            'status'  => false,
            'message' => $message,
            'errors'  => $errors
        ], $statusCode);
    }

    public static function pagination(
        $data,
        string $message = 'Success'
    ): JsonResponse {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
                'last_page' => $data->lastPage(),
            ]
        ]);
    }
}
