<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Models\Log;
use Illuminate\Support\Facades\Cache;

class LogController extends Controller
{
    /**
     * Get all logs.
     */
    public function index()
    {
        try {
            $data = Cache::remember('logs', 7200, function () {
                return Log::with('user')->get();
            });

            if ($data->isEmpty()) {
                return ApiHelper::error('No logs found', 404);
            }

            return ApiHelper::success('Logs retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
