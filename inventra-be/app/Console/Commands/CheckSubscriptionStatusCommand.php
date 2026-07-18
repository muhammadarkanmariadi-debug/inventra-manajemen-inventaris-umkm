<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Domain\Subscription\Models\TenantSubscription;
use App\Events\LoggingEvent;
use Carbon\Carbon;

class CheckSubscriptionStatusCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'subscription:check-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Periksa status langganan tenant dan ubah status menjadi past_due jika melewati tanggal jatuh tempo';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredSubscriptions = TenantSubscription::where('status', 'active')
            ->whereNotNull('current_period_end')
            ->where('current_period_end', '<', Carbon::now())
            ->get();

        $count = 0;
        foreach ($expiredSubscriptions as $sub) {
            $sub->update(['status' => 'past_due']);
            event(new LoggingEvent("Langganan untuk bussiness_id {$sub->bussiness_id} telah jatuh tempo dan diubah menjadi past_due.", 'subscriptions'));
            $count++;
        }

        $this->info("Pemeriksaan selesai. Sebanyak {$count} langganan diupdate ke status past_due.");
        return Command::SUCCESS;
    }
}
