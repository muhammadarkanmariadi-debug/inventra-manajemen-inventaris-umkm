<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

use function Symfony\Component\Translation\t;

class UserController extends Controller
{
    protected $requestService;
    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }
    public function addUser(Request $request)
    {
        try {
            $rules = [
                'username' => 'required|string|max:255|unique:users,username',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                'roles' => 'required|array',
                'roles.*' => 'string|exists:roles,name',
            ];

            $data = $this->requestService->postData(User::class, $request, $rules);
            /** @disregard */
            $data->assignRole($request->input('roles', []));

            if (!$data) {
                return ApiHelper::error('Failed to create user', 500);
            } else {
                return ApiHelper::success('User created successfully', $data, 201);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function getProfile()
    {

        try {
            $user = auth()->guard('api')->user();
            /** @disregard */
            $roles = $user->getRoleNames();
            return ApiHelper::success('User profile retrieved successfully', compact(['user', 'roles']));
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $userId = auth()->guard('api')->id();
            $rules = [
                'username' => 'sometimes|required|string|max:255|unique:users,username,' . $userId,
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $userId,
                'password' => 'sometimes|required|string|min:8',
            ];

            $data = $this->requestService->updateDataById(User::class, $userId, $request, $rules);
            if (!$data) {
                return ApiHelper::error('Failed to update profile', 500);
            } else {
                return ApiHelper::success('User profile updated successfully', $data);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try {
            $rules = [
                'username' => 'sometimes|required|string|max:255|unique:users,username,' . $id,
                'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|required|string|min:8',
            ];

            $data = $this->requestService->updateDataById(User::class, $id, $request, $rules);
            if (!$data) {
                return ApiHelper::error('Failed to update user', 500);
            } else {
                return ApiHelper::success('User profile updated successfully', $data);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }


    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        if (!$user) {
            return ApiHelper::error('User not found', [], 404);
        }
        $user->delete();
        return ApiHelper::success('User account deleted successfully');
    }


    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return ApiHelper::error('Unauthorized', ['error' => 'Invalid credentials'], 401);
        }

        $token = auth()->guard('api')->login($user);


        return ApiHelper::success('Login successful', [
            'token' => $token,
            'token_type' => 'bearer',
        ]);
    }

    public function register(Request $request)
    {
        $rules = [
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ];

        $data = $this->requestService->postData(User::class, $request, $rules);

        if (!$data) {
            return ApiHelper::error('Failed to register user', 500);
        } else {
            return ApiHelper::success('User registered successfully', $data, 201);
        }
    }

    public function logout()
    {
        $user = auth()->guard('api')->logout();

        return ApiHelper::success('Successfully logged out');
    }




    public function getAllUsers()
    {
        $users = User::all();

        if (count($users) === 0) {
            return ApiHelper::error('No users found', [], 404);
        }
        return ApiHelper::success('Users retrieved successfully', $users);
    }
    public function getUser($id)
    {
        $user = User::findOrFail($id);

        if (!$user) {
            return ApiHelper::error('User not found', [], 404);
        }
        return ApiHelper::success('User retrieved successfully', $user);
    }
}
