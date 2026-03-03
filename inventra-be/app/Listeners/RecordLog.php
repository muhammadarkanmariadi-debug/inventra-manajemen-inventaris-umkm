<?php

namespace App\Listeners;

use App\Events\LoggingEvent;
use App\Events\StockTransactionEvent;
use App\Models\logs;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class RecordLog
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(LoggingEvent $event): void
    {
        $user = auth()->guard('api')->id();
        logs::create([
            'message' => $event->message,
            'categories' => $event->categories,
            'user_id' => $user
        ]);
    }
}
