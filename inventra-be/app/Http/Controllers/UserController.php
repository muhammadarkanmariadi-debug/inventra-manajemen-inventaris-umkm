<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function register(Request $request)
    {
        try {
            $rules = [
                'username' => 'required|string|max:255|unique:users,username',
                'email'    => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
            ];

            $data = $this->requestService->postData(User::class, $request, $rules);

            if (!$data) {
                ApiHelper::error('Failed to register user', 500);
            } else {
                ApiHelper::success('User was successfully registered', $data, 201);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');
            $user        = User::where('email', $credentials['email'])->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                ApiHelper::error('Invalid credentials', 401);
            }

            $token = auth()->guard('api')->login($user);

            ApiHelper::success('Login was successfully', [
                'token'      => $token,
                'token_type' => 'bearer',
            ], 200);
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function logout()
    {
        try {
            auth()->guard('api')->logout();

            ApiHelper::success('Successfully logged out', null, 200);
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function addUser(Request $request)
    {
        try {
            $rules = [
                'username'  => 'required|string|max:255|unique:users,username',
                'email'     => 'required|string|email|max:255|unique:users,email',
                'password'  => 'required|string|min:8',
                'roles'     => 'required|array',
                'roles.*'   => 'string|exists:roles,name',
            ];

            $data = $this->requestService->postData(User::class, $request, $rules);
            /** @disregard */
            $data->assignRole($request->input('roles', []));

            if (!$data) {
                ApiHelper::error('Failed to create user', 500);
            } else {
                ApiHelper::success('User was successfully created', $data, 201);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $rules = [
                'username' => 'sometimes|string|max:255|unique:users,username,' . $id,
                'email'    => 'sometimes|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|string|min:8',
            ];

            $data = $this->requestService->updateDataById(User::class, $id, $request, $rules);

            if (!$data) {
                ApiHelper::error('Failed to update user', 500);
            } else {
                ApiHelper::success('User was successfully updated', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function deleteUser($id)
    {
        try {
            $data = $this->requestService->deleteDataById(User::class, $id);

            if (!$data) {
                ApiHelper::error('Failed to delete user', 500);
            } else {
                ApiHelper::success('User was successfully deleted', null, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getAllUser()
    {
        try {
            $data = User::with('roles')->get();

            if (!$data) {
                ApiHelper::error('Failed to get users', 500);
            } else {
                ApiHelper::success('Users was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getUserById($id)
    {
        try {
            $data = User::with('roles')->where('id', $id)->first();

            if (!$data) {
                ApiHelper::error('User not found', 404);
            } else {
                ApiHelper::success('User was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getProfile()
    {
        try {
            $user = auth()->guard('api')->user();
            /** @disregard */
            $roles = $user->getRoleNames();

            ApiHelper::success('User profile was successfully retrieved', compact('user', 'roles'), 200);
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $userId = auth()->guard('api')->id();

            $rules = [
                'username' => 'sometimes|string|max:255|unique:users,username,' . $userId,
                'email'    => 'sometimes|string|email|max:255|unique:users,email,' . $userId,
                'password' => 'sometimes|string|min:8',
            ];

            $data = $this->requestService->updateDataById(User::class, $userId, $request, $rules);

            if (!$data) {
                ApiHelper::error('Failed to update profile', 500);
            } else {
                ApiHelper::success('User profile was successfully updated', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }
}
