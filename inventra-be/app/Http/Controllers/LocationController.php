<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        try {
        $query = Location::withCount('inventories');

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
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
        $request->validate([
            'name' => 'required|string|max:255|unique:locations,name',
        ]);

        $location = Location::create([
            'name' => $request->name,
        ]);

        event(new LoggingEvent('Location ' . $location->name . ' created successfully.', 'locations'));

        return response()->json([
            'status' => true,
            'message' => 'Location created successfully.',
            'data' => $location,
        ], 201);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
        $location = Location::withCount('inventories')->with('inventories.product', 'inventories.status')->find($id);

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
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                'status' => false,
                'message' => 'Location not found.',
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:locations,name,' . $id,
        ]);

        $location->update(['name' => $request->name]);

        event(new LoggingEvent('Location ' . $location->name . ' updated successfully.', 'locations'));

        return response()->json([
            'status' => true,
            'message' => 'Location updated successfully.',
            'data' => $location,
        ]);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
        $location = Location::withCount('inventories')->find($id);

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
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }
}
