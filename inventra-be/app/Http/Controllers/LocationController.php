<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Request $request)
    {
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
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:locations,name',
        ]);

        $location = Location::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Location created successfully.',
            'data' => $location,
        ], 201);
    }

    public function show($id)
    {
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
    }

    public function update(Request $request, $id)
    {
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

        return response()->json([
            'status' => true,
            'message' => 'Location updated successfully.',
            'data' => $location,
        ]);
    }

    public function destroy($id)
    {
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

        return response()->json([
            'status' => true,
            'message' => 'Location deleted successfully.',
        ]);
    }
}
