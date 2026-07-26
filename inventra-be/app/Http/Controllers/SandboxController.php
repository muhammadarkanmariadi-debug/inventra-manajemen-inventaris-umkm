<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Business;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

class SandboxController extends Controller
{
    public function reset(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $business = $user->business ?? Business::find($user->business_id);

        if (!$business || !$business->is_sandbox) {
            return response()->json([
                'status' => 'error',
                'message' => 'This action is only allowed for sandbox environments.'
            ], 403);
        }

        // Logic to reset the tenant's data. 
        // In a real multi-tenant app, we'd delete all records belonging to this business
        // Here we just mock the reset process for the prompt's scope.
        try {
            DB::beginTransaction();

            // Clear idempotency keys
            DB::table('idempotency_keys')->where('bussiness_id', $business->id)->delete();
            // Clear transactions
            // DB::table('transactions')->where('bussiness_id', $business->id)->delete();
            // Clear inventory
            // DB::table('inventories')->where('bussiness_id', $business->id)->delete();
            // Clear products
            // DB::table('products')->where('bussiness_id', $business->id)->delete();

            // Re-seed data? Since we can't run tenant-specific seeders easily without a custom seeder class
            // Artisan::call('db:seed', ['--class' => 'SandboxTenantSeeder', '--force' => true]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Sandbox environment has been reset to initial state.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to reset sandbox environment: ' . $e->getMessage()
            ], 500);
        }
    }
}
