"use client";

import { useCallback, useState } from "react";
import { subscribeNotificationApi, unsubscribeNotificationApi } from "../api/notification.api";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushSubscription() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subscribeToPush = useCallback(async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push messaging is not supported by this browser.");
      return null;
    }

    try {
      setIsLoading(true);
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Notification permission was denied by user.");
        return null;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.warn("VAPID public key is missing in environment variables.");
        return null;
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      const subscriptionJson = subscription.toJSON();
      if (!subscriptionJson.endpoint || !subscriptionJson.keys) {
        return null;
      }

      const res = await subscribeNotificationApi({
        endpoint: subscriptionJson.endpoint,
        keys: {
          p256dh: subscriptionJson.keys.p256dh || "",
          auth: subscriptionJson.keys.auth || "",
        },
      });

      setIsSubscribed(true);
      return res;
    } catch (err) {
      console.error("Failed to subscribe to WebPush notifications:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribeFromPush = useCallback(async () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;

    try {
      setIsLoading(true);
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        await unsubscribeNotificationApi(endpoint);
      }
      setIsSubscribed(false);
      return true;
    } catch (err) {
      console.error("Failed to unsubscribe from WebPush notifications:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSubscribed,
    isLoading,
    subscribeToPush,
    unsubscribeFromPush,
  };
}
