// services/notifications.ts
import * as Notifications from "expo-notifications";

// iOS: global handler (supported fields only)

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true, 
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function ensureNotifPermission() {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.status !== "granted") {
    const req = await Notifications.requestPermissionsAsync();
    if (req.status !== "granted") {
      throw new Error("Notification permission not granted");
    }
  }
}

export async function scheduleResultsReady(atISO: string) {
  const when = new Date(atISO);
  if (Number.isNaN(when.getTime())) throw new Error("Invalid date");
  if (when.getTime() <= Date.now()) return undefined; // don't schedule in the past

  // On iOS you can pass a Date directly as the trigger
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to read your results",
      body: "Your 10-minute wait is done.",
      // sound: true, // uncomment if you want sound
    },
    trigger: { type: 'date', date: when } as Notifications.DateTriggerInput,
  });

  return id;
}

export async function cancelNotification(id?: string) {
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
}