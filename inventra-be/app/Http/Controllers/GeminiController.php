<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Models\FinancialTransaction;
use App\Models\Product;
use App\Models\Sale;
use App\Services\GeminiService;
use Illuminate\Http\Request;

class GeminiController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }


    public function analyzeInventory()
    {
        try {
            $businessId = auth()->guard('api')->user()->bussiness_id;

            $products = Product::where('bussiness_id', $businessId)
                ->with(['category', 'suppliers'])
                ->get();

            if ($products->isEmpty()) {
                return ApiHelper::error('Tidak ada data produk untuk dianalisis', 404);
            }

            $result = $this->geminiService->analyzeInventory($products);

            return ApiHelper::success('Analisis inventori berhasil',  $result, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }


    public function analyzeSales()
    {
        try {
            $businessId = auth()->guard('api')->user()->bussiness_id;

            $sales = Sale::where('bussiness_id', $businessId)
                ->with('product')
                ->get();

            if ($sales->isEmpty()) {
                return ApiHelper::error('Tidak ada data penjualan untuk dianalisis', 404);
            }

            $result = $this->geminiService->analyzeSales($sales);

            return ApiHelper::success('Analisis penjualan berhasil', ['analysis' => $result], 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }


    public function analyzeFinancial()
    {
        try {
            $businessId = auth()->guard('api')->user()->bussiness_id;

            $transactions = FinancialTransaction::where('bussiness_id', $businessId)
                ->with('financialCategory')
                ->get();

            if ($transactions->isEmpty()) {
                return ApiHelper::error('Tidak ada data keuangan untuk dianalisis', 404);
            }
            

            $data = [
                'total_income'  => $transactions->where('type', 'income')->sum('amount'),
                'total_expense' => $transactions->where('type', 'expense')->sum('amount'),
                'transactions'  => $transactions,
            ];

            $result = $this->geminiService->analyzeFinancial($data);
       
         
            return ApiHelper::success('Analisis keuangan berhasil', ['analysis' => $result], 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }


    public function ask(Request $request)
    {
        try {
            $request->validate([
                'question' => 'required|string|max:1000',
            ]);

            $businessId = auth()->guard('api')->user()->bussiness_id;

            $context = [
                'products' => Product::where('bussiness_id', $businessId)->with('category')->get(),
                'sales'    => Sale::where('bussiness_id', $businessId)->with('product')->get(),
                'financial' => [
                    'income'  => FinancialTransaction::where('bussiness_id', $businessId)->where('type', 'income')->sum('amount'),
                    'expense' => FinancialTransaction::where('bussiness_id', $businessId)->where('type', 'expense')->sum('amount'),
                ],
            ];

            $result = $this->geminiService->askWithContext($request->question, $context);

            return ApiHelper::success('Pertanyaan berhasil dijawab',  $result, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
