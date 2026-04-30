<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\LoggingEvent;
use App\Models\Permission;
use App\Helpers\ApiHelper;


class PermissionController extends Controller
{
    public function index(Request $request)
    {

        try {
            $perPage = (int) $request->query('items', 10);
            $data = Permission::paginate($perPage);
            return ApiHelper::success('Permissions retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'guard_name' => 'required|string|max:255',
            ]);

            $data = Permission::create($request->all());
            event(new LoggingEvent('Permission ' . $data->name . ' created successfully', 'permissions'));
            return ApiHelper::success('Permission created successfully', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $data = Permission::findOrFail($id);
            return ApiHelper::success('Permission retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'guard_name' => 'required|string|max:255',
            ]);

            $data = Permission::findOrFail($id);
            $data->update($request->all());
            event(new LoggingEvent('Permission ' . $data->name . ' updated successfully', 'permissions'));
            return ApiHelper::success('Permission updated successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $data = Permission::findOrFail($id);
            $data->delete();
            event(new LoggingEvent('Permission ' . $data->name . ' deleted successfully', 'permissions'));
            return ApiHelper::success('Permission deleted successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
