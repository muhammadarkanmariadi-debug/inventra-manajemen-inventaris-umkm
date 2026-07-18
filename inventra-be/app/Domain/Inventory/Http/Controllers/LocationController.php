<?php

namespace App\Domain\Inventory\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Inventory\Models\Location;
use App\Domain\Inventory\Http\Requests\LocationRequest;
use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        try {
            $user = auth()->guard('api')->user();
            $query = Location::withCount('inventories');

            if ($user && $user->role !== 'SUPERADMIN' && $user->bussiness_id) {
                $query->where('bussiness_id', $user->bussiness_id);
            }

            if ($request->has('search') && $request->search) {
                $query->where('name', 'like', "%{$request->search}%");
            }

            $locations = $query->orderBy('name', 'asc')
                ->paginate($request->get('items', 15));

            return response()->json([
                'status' => true,
                'message' => 'Locations retrieved successfully.',
                'data' => $locations,
            ]);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function store(LocationRequest $request)
    {
        try {
            $user = auth()->guard('api')->user();
            $data = $request->validated();
            if ($user && $user->bussiness_id) {
                $data['bussiness_id'] = $user->bussiness_id;
            }

            $location = Location::create($data);

            event(new LoggingEvent('Location ' . $location->name . ' created successfully.', 'locations'));

            return response()->json([
                'status' => true,
                'message' => 'Location created successfully.',
                'data' => $location,
            ], 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $user = auth()->guard('api')->user();
            $query = Location::withCount('inventories')->with('inventories.product', 'inventories.status')->where('id', $id);
            if ($user && $user->role !== 'SUPERADMIN' && $user->bussiness_id) {
                $query->where('bussiness_id', $user->bussiness_id);
            }
            $location = $query->first();

            if (!$location) {
                return response()->json([
                    'status' => false,
                    'message' => 'Location not found.',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'message' => 'Location retrieved successfully.',
                'data' => $location,
            ]);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function update(LocationRequest $request, $id)
    {
        try {
            $user = auth()->guard('api')->user();
            $query = Location::where('id', $id);
            if ($user && $user->role !== 'SUPERADMIN' && $user->bussiness_id) {
                $query->where('bussiness_id', $user->bussiness_id);
            }
            $location = $query->first();

            if (!$location) {
                return response()->json([
                    'status' => false,
                    'message' => 'Location not found.',
                ], 404);
            }

            $location->update($request->validated());

            event(new LoggingEvent('Location ' . $location->name . ' updated successfully.', 'locations'));

            return response()->json([
                'status' => true,
                'message' => 'Location updated successfully.',
                'data' => $location,
            ]);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = auth()->guard('api')->user();
            $query = Location::withCount('inventories')->where('id', $id);
            if ($user && $user->role !== 'SUPERADMIN' && $user->bussiness_id) {
                $query->where('bussiness_id', $user->bussiness_id);
            }
            $location = $query->first();

            if (!$location) {
                return response()->json([
                    'status' => false,
                    'message' => 'Location not found.',
                ], 404);
            }

            if ($location->inventories_count > 0) {
                return response()->json([
                    'status' => false,
                    'message' => 'Cannot delete location with existing inventory.',
                ], 422);
            }

            $location->delete();

            event(new LoggingEvent('Location ' . $location->name . ' deleted successfully.', 'locations'));

            return response()->json([
                'status' => true,
                'message' => 'Location deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
