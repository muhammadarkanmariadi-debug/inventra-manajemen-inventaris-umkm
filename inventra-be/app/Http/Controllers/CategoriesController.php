<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoriesController extends Controller
{

    protected $requestService;


    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }


    public function createCategory(Request $request)
    {

        try {

            $userbussinessId = auth()->guard('api')->user()->bussiness_id;
            $rules = [
                'name' => 'required|string|max:255|unique:categories,name',
                'description' => 'nullable|string',
            ];

            $request->merge(['bussiness_id' => $userbussinessId]);


            $data = $this->requestService->postData(Categories::class, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to create category', 500);
            } else {
                return ApiHelper::success('Category created successfully', $data, 201);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred', 'error' => $e->getMessage()], 500);
        }
    }
    public function getCategories()
    {
      try{
          $categories = Categories::with('products')->get();
        if (count($categories) == 0) {
            return ApiHelper::error('No categories found', 404);
        }
        return ApiHelper::success('Categories retrieved successfully', $categories, 200);
      }catch (\Exception $e) {
          return ApiHelper::error('An error occurred', $e->getMessage(), 500);
      }
    }

    public function getCategory($id)
    {
        try {
            $category = Categories::with('products')->find($id);
            if (!$category) {
                return ApiHelper::error('Category not found', 404);
            }
            return ApiHelper::success('Category retrieved successfully', $category, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }



    public function updateCategory(Request $request, $id)
    {
        try {
            $rules = [
                'name' => 'required|string|max:255|unique:categories,name,' . $id,
                'description' => 'nullable|string',
            ];

            $data = $this->requestService->updateDataById(Categories::class, $id, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to update category', 500);
            } else {
                return ApiHelper::success('Category updated successfully', $data, 200);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }


    public function deleteCategory($id)
    {
       try {
            $data = $this->requestService->deleteDataById(Categories::class, $id);
            if (!$data) {
                return ApiHelper::error('Failed to delete category', 500);
        } else {
                return ApiHelper::success('Category deleted successfully', null, 200);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }
}
