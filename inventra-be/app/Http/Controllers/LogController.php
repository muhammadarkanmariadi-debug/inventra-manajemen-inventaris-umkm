<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Models\Log;
use Illuminate\Http\Request;

class LogController extends Controller
{
    /**
     * Get all logs.
     */
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $data    = Log::with('user')->paginate($perPage);

            if ($data->isEmpty()) {
                return ApiHelper::error('No logs found', 404);
            }

            return ApiHelper::success('Logs retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
