// Gunakan fungsi ini di dalam useEffect di komponen Client (misal: layout.tsx atau page.tsx)
import { messaging } from "@/lib/firebase";
import { getToken } from "firebase/messaging";


export async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted" && messaging) {
        const token = await getToken(messaging, {
            vapidKey: "BAjYD-kRVhEGegffyLQ0bM10KC7exmouLpCmRljsFyINg6KpB4qa5Z4UZy_monNAGowljGzv6S5A7VrWLzGC1rY",
        });
        console.log("Token User:", token);
        // Simpan token ini ke database-mu jika ingin mengirim notifikasi nanti
    }
}
