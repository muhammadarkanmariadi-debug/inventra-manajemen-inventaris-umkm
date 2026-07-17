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
            // Permission check
            if (!$request->user()->hasPermissionTo('Lihat Log', 'api')) {
                return ApiHelper::error('Unauthorized access to logs', 403);
            }

            $perPage = (int) $request->query('items', 10);
            
            // Filter by business_id
            $query = Log::with('user');
            
            // Assuming business users are always scoped by bussiness_id. 
            // Superadmins might want to see everything, but for the user dashboard context, we'll scope it.
            $query->where('bussiness_id', $request->user()->bussiness_id);
            
            $data = $query->latest()->paginate($perPage);

            if ($data->isEmpty()) {
                return ApiHelper::success('No logs found', $data, 200);
            }

            return ApiHelper::success('Logs retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
