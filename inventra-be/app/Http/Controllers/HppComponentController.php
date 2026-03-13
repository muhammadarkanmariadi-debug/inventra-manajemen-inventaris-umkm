<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\HppComponent;
use App\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class HppComponentController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new HPP component.
     */
    public function store(Request $request)
    {
        try {
            $userBusinessId = auth()->guard('api')->user()->bussiness_id;

            $rules = [
                'name'       => 'required|string|max:255',
                'product_id' => 'required|integer|exists:products,id',
                'cost'       => 'required|numeric|min:0',
            ];

            $request->merge(['bussiness_id' => $userBusinessId]);

            $data = $this->requestService->postData(HppComponent::class, $request, $rules);

            if (!$data instanceof HppComponent) {
                return ApiHelper::error('Failed to create HPP Component', 500);
            }

            event(new LoggingEvent('HPP Component was successfully created', 'hppComponents'));

            return ApiHelper::success('HPP Component created successfully', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get HPP components by product ID.
     */
    public function indexByProduct($productId)
    {
        try {
            $hppComponents = Cache::remember('hpp_product_' . $productId, 7200, function () use ($productId) {
                return HppComponent::where('product_id', $productId)
                    ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                    ->get();
            });

            return ApiHelper::success('HPP Components retrieved successfully', $hppComponents, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get an HPP component by ID.
     */
    public function show($id)
    {
        try {
            $hppComponent = HppComponent::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->first();

            if (!$hppComponent) {
                return ApiHelper::error('HPP Component not found', 404);
            }

            return ApiHelper::success('HPP Component retrieved successfully', $hppComponent, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete an HPP component by ID.
     */
    public function destroy($id)
    {
        try {
            $this->requestService->deleteDataById(HppComponent::class, $id);

            event(new LoggingEvent('HPP Component with id: ' . $id . ' deleted successfully', 'hppComponents'));

            return ApiHelper::success('HPP Component deleted successfully', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update an HPP component by ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'name'       => 'sometimes|required|string|max:255',
                'product_id' => 'sometimes|required|integer|exists:products,id',
                'cost'       => 'sometimes|required|numeric|min:0',
            ];

            $data = $this->requestService->updateDataById(HppComponent::class, $id, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to update HPP Component', 500);
            }

            event(new LoggingEvent('HPP Component with id: ' . $id . ' updated successfully', 'hppComponents'));

            return ApiHelper::success('HPP Component updated successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
