<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Permission;
use App\Helpers\ApiHelper;


class PermissionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $data = Permission::all();
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
            return ApiHelper::success('Permission deleted successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
