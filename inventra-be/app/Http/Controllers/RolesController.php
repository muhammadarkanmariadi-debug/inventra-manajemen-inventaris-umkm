<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
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
                'name'          => 'required|string|unique:roles,name',
                'permissions'   => 'required|array',
                'permissions.*' => 'string|exists:permissions,name',
            ];

            $data = $this->requestService->postData(Roles::class, $request, $rules);
            $permissions = $request->input('permissions', []);
            $data->syncPermissions($permissions);

            if (!$data) {
                ApiHelper::error('Failed to create role', 500);
            } else {
                ApiHelper::success('Role was successfully created', $data, 201);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function updateRole(Request $request, $id)
    {
        try {
            $rules = [
                'name'          => 'sometimes|string|unique:roles,name,' . $id,
                'permissions'   => 'sometimes|array',
                'permissions.*' => 'string|exists:permissions,name',
            ];

            $data = $this->requestService->updateDataById(Roles::class, $id, $request, $rules);
            $permissions = $request->input('permissions', []);
            $data->syncPermissions($permissions);

            if (!$data) {
                ApiHelper::error('Failed to update role', 500);
            } else {
                ApiHelper::success('Role was successfully updated', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function deleteRole($id)
    {
        try {
            $data = $this->requestService->deleteDataById(Roles::class, $id);

            if (!$data) {
                ApiHelper::error('Failed to delete role', 500);
            } else {
                ApiHelper::success('Role was successfully deleted', null, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getRoles()
    {
        try {
            $data = Roles::get();

            if (!$data) {
                ApiHelper::error('Failed to get roles', 500);
            } else {
                ApiHelper::success('Roles was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getRoleById($id)
    {
        try {
            $data = Roles::with('permissions')->where('id', $id)->first();

            if (!$data) {
                ApiHelper::error('Role not found', 404);
            } else {
                ApiHelper::success('Role was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getPermissions()
    {
        try {
            $data = Permission::get();

            if (!$data) {
                ApiHelper::error('Failed to get permissions', 500);
            } else {
                ApiHelper::success('Permissions was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }
}
