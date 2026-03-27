<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Models\Product;
use App\Models\Sale;
use Carbon\Carbon;
use Google\Service\ApigeeRegistry\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;



class StatisticController extends Controller
{

    public function penjualan(Request $request)
    {
        try {
            $startDate = Carbon::parse($request->startDate)->startOfDay();
            $endDate = Carbon::parse($request->endDate)->endOfDay();
   

            $totalPenjualan = Sale::count();
            $totalKeuntungan = Sale::sum('profit');
            $query = Sale::select(DB::raw('date_format(created_at, "%M %Y") as yearmonth'), DB::raw('count(*) as total_penjualan, sum(profit) as keuntungan'));
            if ($request->has($startDate) || $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }

            $data = $query->groupBy(DB::raw('yearmonth'))->get();

            if ($data->isEmpty()) {
                return ApiHelper::error('Statistik penjualan tidak ditemukan', 404);
            }
            return ApiHelper::success('Statistik penjualan ', ['data' => $data , 'total_keuntungan' => $totalKeuntungan, 'total_penjualan' => $totalPenjualan], 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred ' . $e->getMessage(), 500);
        }
    }
    public function produk()
    {
        try {
            $data = Product::select(
                'products.id',
                'products.name',
                'categories.name as category_name',
                DB::raw('COUNT(sales.id) as penjualan_produk')
            )
                ->join('sales', 'sales.product_id', '=', 'products.id')
                ->join('categories', 'categories.id', '=', 'products.category_id')
                ->groupBy('products.id', 'products.name')
                ->orderBy('penjualan_produk', 'desc')
                ->limit(2)
                ->get();

            if ($data->isEmpty()) {
                return ApiHelper::error('Statistik penjualan produk tidak ditemukan', 404);
            }
            return ApiHelper::success('Statistik penjualan produk', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred ' . $e->getMessage(), 500);
        }
    }
}
