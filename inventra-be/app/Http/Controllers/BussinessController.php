<?php

namespace App\Http\Controllers;

use App\Events\BussinessEvent;
use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\Bussiness;
use App\Models\User;
use App\Observers\AttachBID;
use Illuminate\Http\Request;



class BussinessController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function createBusiness(Request $request)
    {
        try {
            $rules = [
                'name' => 'required|string|max:255',
                'address' => 'required|string',
                'phone' => 'required|string|max:20',
                'email' => 'required|string|email|max:255',
                'website' => 'nullable|string|max:255',
            ];

            $data = $this->requestService->postData(Bussiness::class, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to create business', 500);
            } else {
             
                return ApiHelper::success('Business created successfully', $data, 201);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred',  500);
        }
    }



    public function getAllBussiness()
    {
        try {
            $bussiness = Bussiness::get();
            if ($bussiness->isEmpty()) {
                return ApiHelper::error('Bussiness not found',  404);
            }

            return ApiHelper::success('Bussiness retrieved successfully', $bussiness, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred',  500);
        }
    }


    public function getMyBussiness(Request $request)
    {
        try {
            $userId = auth()->guard('api')->id();
            $bussiness = User::findOrFail($userId)->bussiness;

            if (!$bussiness) {
                return ApiHelper::error('Bussiness not found', 404);
            }


            if ($request->has('include')) {
                $includes = explode(',', $request->query('include'));

                $allowed = ['users', 'products', 'suppliers', 'categories', 'financialTransactions', 'hppComponents', 'stockTransactions', 'financialCategories'];
                $validIncludes = array_intersect($includes, $allowed);

                if (!empty($validIncludes)) {
                    $bussiness->load($validIncludes);
                }
            }

            return ApiHelper::success('Bussiness retrieved successfully', $bussiness, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', 500);
        }
    }

    public function getBussinessById($id, Request $request)
    {
        try {
            $bussiness = Bussiness::find($id);

            if (!$bussiness) {
                return ApiHelper::error('Bussiness not found', 404);
            }


            if ($request->has('include')) {
                $includes = explode(',', $request->query('include'));

                $allowed = ['users', 'products', 'suppliers', 'categories', 'financialTransactions', 'hppComponents', 'stockTransactions', 'financialCategories'];
                $validIncludes = array_intersect($includes, $allowed);

                if (!empty($validIncludes)) {
                    $bussiness->load($validIncludes);
                }
            }

            return ApiHelper::success('Bussiness retrieved successfully', $bussiness, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', 500);
        }
    }

    public function updateBussiness(Request $request, $id)
    {
        try {
            $rules = [
                'name' => 'required|string|max:255',
                'address' => 'required|string',
                'phone' => 'required|string|max:20',
                'email' => 'required|string|email|max:255',
                'website' => 'nullable|string|max:255',
            ];

            $data = $this->requestService->updateDataById(Bussiness::class, $id, $request, $rules);

            if (!$data) {
                return response()->json(['message' => 'Failed to update business'], 500);
            } else {
                return ApiHelper::success('Business updated successfully', $data, 200);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred',  500);
        }
    }


    public function deleteBussiness($id)
    {
        try {
            $data = $this->requestService->deleteDataById(Bussiness::class, $id);

            if (!$data) {
                return ApiHelper::error('Failed to delete business',  500);
            } else {
                return ApiHelper::success('Business deleted successfully', 200);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred',  500);
        }
    }
}
