<?php

namespace App\Listeners;

use App\Events\StockTransactionEvent;
use App\Models\Products;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class UpdateStock
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {

    }

    /**
     * Handle the event.
     */
    public function handle(StockTransactionEvent $event): void
    {
        $stockTransaction = $event->stockTransaction;
        $product = Products::find($stockTransaction->product_id);

        if ($stockTransaction->type === 'IN') {
            $product->stock += $stockTransaction->quantity;
        } elseif ($stockTransaction->type === 'OUT') {
            $product->stock -= $stockTransaction->quantity;
        } elseif ($stockTransaction->type === 'ADJUST') {
            $product->stock = $stockTransaction->quantity;
        }

        $product->save();
    }
}
