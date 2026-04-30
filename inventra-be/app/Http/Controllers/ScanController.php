<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use App\Helpers\ApiHelper;

class ScanController extends Controller
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Scan QR Code to retrieve inventory details.
     * Logs a SCAN event with the authenticated user.
     */
    public function scan(Request $request)
    {
        $request->validate([
            'inventory_code' => 'required|string',
        ]);

        try {
            $userId = auth()->guard('api')->id();
            $inventory = $this->inventoryService->processScan($request->inventory_code, $userId);

            event(new LoggingEvent('Scanned inventory: ' . $request->inventory_code, 'scan'));

            return response()->json([
                'status' => true,
                'message' => 'Inventory retrieved successfully.',
                'data' => $inventory
            ]);
        } catch (\Exception $e) {
            $code = $e->getCode();
            $code = is_int($code) && $code >= 100 && $code < 600 ? $code : 500;
            
            return ApiHelper::error($e->getMessage(), $code);
        }
    }
}
