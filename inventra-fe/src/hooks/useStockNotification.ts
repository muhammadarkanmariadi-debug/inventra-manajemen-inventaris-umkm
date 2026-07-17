"use client";

import { usePushSubscription } from "@/modules/notification/hooks/use-push-subscription";

export { usePushSubscription };

/**
 * @deprecated Gunakan hook `usePushSubscription()` dari `@/modules/notification/hooks/use-push-subscription`.
 */
export async function requestPermission() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;
    const registration = await navigator.serviceWorker.register("/sw.js");
    return registration;
  } catch (e) {
    console.error("requestPermission failed:", e);
    return null;
  }
}
