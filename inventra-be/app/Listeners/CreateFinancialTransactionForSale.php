<?php

namespace App\Listeners;

use App\Events\SaleCreated;
use App\Models\FinancialCategory;
use App\Models\FinancialTransaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreateFinancialTransactionForSale
{
    public function __construct()
    {
        //
    }

    public function handle(SaleCreated $event): void
    {
        $sale = $event->sale;

        $category = FinancialCategory::firstOrCreate(
            ['name' => 'Penjualan', 'bussiness_id' => $sale->bussiness_id],
            ['type' => 'income']
        );

        FinancialTransaction::create([
            'financial_category_id' => $category->id,
            'type' => 'income',
            'amount' => $sale->total_price,
            'note' => 'Pendapatan dari penjualan #' . $sale->id,
            'transaction_date' => now()->toDateString(),
            'bussiness_id' => $sale->bussiness_id
        ]);
    }
}
