<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Business;

class SendWebhook implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $businessId;
    public $event;
    public $payload;

    /**
     * Create a new job instance.
     */
    public function __construct($businessId, $event, $payload)
    {
        $this->businessId = $businessId;
        $this->event = $event;
        $this->payload = $payload;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $business = Business::find($this->businessId);

        // Assume the business model has webhook_url and webhook_secret columns, 
        // or they are stored in a related settings table.
        // For the sake of this prompt, we'll check if they exist or use mock data.
        $webhookUrl = $business->webhook_url ?? env('TEST_WEBHOOK_URL');
        $webhookSecret = $business->webhook_secret ?? env('TEST_WEBHOOK_SECRET', 'inventra-secret-key');

        if (!$webhookUrl) {
            return;
        }

        $data = [
            'event' => $this->event,
            'timestamp' => now()->toIso8601String(),
            'data' => $this->payload
        ];

        $jsonPayload = json_encode($data);
        $signature = hash_hmac('sha256', $jsonPayload, $webhookSecret);

        try {
            $response = Http::withHeaders([
                'X-Inventra-Signature' => $signature,
                'Content-Type' => 'application/json'
            ])->post($webhookUrl, $data);

            if (!$response->successful()) {
                Log::warning("Webhook delivery failed for event {$this->event} to {$webhookUrl}. Status: {$response->status()}");
            }
        } catch (\Exception $e) {
            Log::error("Webhook delivery error: " . $e->getMessage());
        }
    }
}
