import { apiPost } from "../../../../lib/api";

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface SubscribePushPayload {
  endpoint: string;
  keys: PushSubscriptionKeys;
}

/**
 * Mendaftarkan subscription WebPush ke backend.
 */
export async function subscribeNotificationApi(payload: SubscribePushPayload) {
  return apiPost("/notification/subscribe", payload);
}

/**
 * Menghapus langganan WebPush dari backend berdasarkan endpoint.
 */
export async function unsubscribeNotificationApi(endpoint: string) {
  return apiPost("/notification/unsubscribe", { endpoint });
}
