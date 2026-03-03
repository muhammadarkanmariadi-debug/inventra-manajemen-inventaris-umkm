<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Models\logs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

use function PHPUnit\Framework\isEmpty;

class logsController extends Controller
{
    public function getLogs()
    {
        try {
            $data = Cache::remember('logs', 7200, function () {
                return logs::with('user')->get();
            });


            if (!$data || isEmpty($data)) {
                return ApiHelper::error('Failed to retrieve logs', 500);
            } else {
                return ApiHelper::error('Logs retrieved succefully', 200);
            }
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
