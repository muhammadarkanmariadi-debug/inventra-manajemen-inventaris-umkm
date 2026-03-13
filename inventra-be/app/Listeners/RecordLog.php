<?php

namespace App\Listeners;

use App\Events\LoggingEvent;
use App\Models\Log;

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
        $userId = auth()->guard('api')->id();

        Log::create([
            'message'    => $event->message,
            'categories' => $event->categories,
            'user_id'    => $userId,
        ]);
    }
}
