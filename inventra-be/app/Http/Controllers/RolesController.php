<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\Roles;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class RolesController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function createRoles(Request $request)
    {
        try {
            $rules = [
                'name' => 'required|string|unique:roles,name',
                'permissions' => 'required|array',
                'permissions.*' => 'string|exists:permissions,name',
            ];


            $this->requestService->postData(Roles::class, $request, $rules);
            $role = $request->input('name');
            $permissions = $request->input('permissions', []);
            $role->syncPermissions($permissions);
            return response()->json(['message' => 'Roles created successfully'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create roles', 'message' => $e->getMessage()], 500);
        }
    }

    public function getRoles()
    {
        try {
            $roles = Roles::get();
            if (count($roles) == 0) {
                return response()->json(['error' => 'No roles found'], 404);
            }
            return response()->json(['message' => 'Roles retrieved successfully', 'data' => $roles], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    public function getRoleById($id)
    {
        try {
            $role = Roles::with('permissions')->find($id);
            if (!$role) {
                return response()->json(['error' => 'Role not found'], 404);
            }
            return response()->json(['message' => 'Role retrieved successfully', 'data' => $role], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    public function deleteRole($id)
    {
        try {
            $role = Roles::find($id);
            if (!$role) {
                return response()->json(['error' => 'Role not found'], 404);
            }
            $role->delete();
            return response()->json(['message' => 'Role deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateRole(Request $request, $id)
    {
        try {
            $rules = [
                'name' => 'required|string|unique:roles,name,' . $id,
                'permissions' => 'required|array',
                'permissions.*' => 'string|exists:permissions,name',
            ];

            $this->requestService->updateDataById(Roles::class, $id, $request, $rules);
            $role = Roles::find($id);
            $permissions = $request->input('permissions', []);
            $role->syncPermissions($permissions);
            return response()->json(['message' => 'Role updated successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update role', 'message' => $e->getMessage()], 500);
        }
    }

    public function getPermissions()
    {
        try {
            $permissions = Permission::get();
            if (count($permissions) == 0) {
                return response()->json(['error' => 'No permissions found'], 404);
            }
            return response()->json(['message' => 'Permissions retrieved successfully', 'data' => $permissions], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred', 'message' => $e->getMessage()], 500);
        }
    }
}
