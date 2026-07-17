<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Models\FinancialTransaction;
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
            $query = Sale::select(DB::raw('date_format(created_at, "%M %Y") as yearmonth'), DB::raw('count(*) as total_penjualan'));
            if ($request->has($startDate) || $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }

            $data = $query->groupBy(DB::raw('yearmonth'))->orderBy(DB::raw("MIN(created_at)"), 'asc')->get();

            if ($data->isEmpty()) {
                return ApiHelper::error('Statistik penjualan tidak ditemukan', 404);
            }
            return ApiHelper::success('Statistik penjualan ', ['data' => $data, 'total_penjualan' => $totalPenjualan], 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred ' . $e->getMessage(), 500);
        }
    }

    public function incomeExpenses(Request $request)
    {
        try {
            $startDate = Carbon::parse($request->startDate)->startOfDay();
            $endDate = Carbon::parse($request->endDate)->endOfDay();

            $query = FinancialTransaction::select(
                DB::raw('DATE_FORMAT(created_at, "%M %Y") as yearmonth'),
                'type',
                DB::raw('SUM(amount) as total') // Kita butuh SUM untuk menghitung nominalnya
            );

            // Perbaikan logika if: cek string inputnya, bukan objek Carbon
            if ($request->filled(['startDate', 'endDate'])) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
            $rawData = $query->groupBy(['yearmonth', 'type'])
                ->orderBy('yearmonth', 'asc')
                ->get();

            if ($rawData->isEmpty()) {
                return ApiHelper::error('Statistik pemasukan tidak ditemukan', 404);
            }

            // --- TRANSFORMASI DATA ---
            // Kita grouping berdasarkan 'yearmonth' (Bulan Tahun)
            $formattedData = $rawData->groupBy('yearmonth')->map(function ($items) {
                // Di dalam tiap bulan, kita buat key 'income' dan 'expense'
                return [
                    'income'  => $items->where('type', 'income')->sum('total'),
                    'expense' => $items->where('type', 'expense')->sum('total'),
                ];
            });


            return ApiHelper::success('Statistik penjualan', ['data' => $formattedData], 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred: ' . $e->getMessage(), 500);
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

    public function keuangan(Request $request)
    {
        try {
            $query = \App\Models\FinancialTransaction::query();
            if ($request->has('startDate') && $request->has('endDate')) {
                $startDate = Carbon::parse($request->startDate)->startOfDay();
                $endDate = Carbon::parse($request->endDate)->endOfDay();
                $query->whereBetween('transaction_date', [$startDate, $endDate]);
            }

            $income = (clone $query)->where('type', 'income')->sum('amount');
            $expense = (clone $query)->where('type', 'expense')->sum('amount');

            return ApiHelper::success('Statistik keuangan', [
                'income' => $income,
                'expense' => $expense
            ], 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred ' . $e->getMessage(), 500);
        }
    }


    public function prediksi($id)
    {
        try {
            $history = DB::table('sales')
                ->selectRaw('
                    product_id,
                    SUM(quantity) as sales,
                    DATE(created_at) as date
                ')
                ->where('product_id', $id)
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy(DB::raw('DATE(created_at)'), 'product_id')
                ->orderBy(DB::raw('DATE(created_at)'), 'asc')
                ->get();

            if ($history->isEmpty()) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Tidak ada data penjualan dalam 30 hari terakhir',
                    'data'    => []
                ]);
            }

            $currentStock = DB::table('inventories')
                ->where('product_id', $id)
                ->sum('quantity');

            $records = $history->map(fn($row) => [
                'product_id' => (int) $row->product_id,
                'stock'      => (int) $currentStock,
                'sales'      => (int) $row->sales,
            ])->values()->toArray();

            return response()->json([
                'status' => true,
                'data'   => $records
            ]);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }


    public function defect($id)
    {
        try {
            $totalUnreleased = DB::table('inventory_logs')
                ->join('inventories', 'inventories.id', '=', 'inventory_logs.inventory_id')
                ->join('inventory_statuses', 'inventory_statuses.id', '=', 'inventory_logs.to_status_id')
                ->where('inventories.product_id', $id)
                ->where('inventory_logs.action', 'CREATED')
                ->where('inventory_statuses.code', 'UNRELEASED')
                ->sum('inventory_logs.quantity');

            $totalRejected = DB::table('inventory_logs')
                ->join('inventories', 'inventories.id', '=', 'inventory_logs.inventory_id')
                ->join('inventory_statuses', 'inventory_statuses.id', '=', 'inventory_logs.to_status_id')
                ->where('inventories.product_id', $id)
                ->where('inventory_logs.action', 'STATUS_CHANGE')
                ->where('inventory_statuses.code', 'REJECT')
                ->sum('inventory_logs.quantity');

            $currentUnreleased = DB::table('inventories')
                ->join('inventory_statuses', 'inventory_statuses.id', '=', 'inventories.current_status_id')
                ->where('inventories.product_id', $id)
                ->where('inventory_statuses.code', 'UNRELEASED')
                ->sum('inventories.quantity');

            return response()->json([
                'status' => true,
                'data' => [
                    'product_id' => (int) $id,
                    'total_unreleased' => (int) $totalUnreleased,
                    'total_rejected' => (int) $totalRejected,
                    'current_unreleased_stock' => (int) $currentUnreleased,
                ]
            ]);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
