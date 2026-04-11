import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_ENABLED_KEY = 'push_notifications_enabled';
const REMINDER_HOUR_KEY = 'reminder_hour';
const REMINDER_MINUTE_KEY = 'reminder_minute';

// Web-safe wrapper — expo-notifications is not available on web
let Notifications: typeof import('expo-notifications') | null = null;

async function loadNotifications() {
  if (Platform.OS === 'web') return null;
  if (Notifications) return Notifications;
  try {
    Notifications = await import('expo-notifications');
    return Notifications;
  } catch {
    return null;
  }
}

/**
 * Request push notification permissions and return the Expo push token.
 * Returns null on web or if permission is denied.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  const mod = await loadNotifications();
  if (!mod) return null;

  const { status: existingStatus } = await mod.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await mod.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  // Configure notification channel for Android
  if (Platform.OS === 'android') {
    await mod.setNotificationChannelAsync('default', {
      name: '학습 알림',
      importance: mod.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  try {
    const token = await mod.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}

/**
 * Schedule a daily learning reminder at the given hour/minute.
 * Default: 9:00 AM
 */
export async function scheduleDailyReminder(hour = 9, minute = 0): Promise<void> {
  const mod = await loadNotifications();
  if (!mod) return;

  // Cancel existing daily reminders first
  await cancelDailyReminder();

  await mod.scheduleNotificationAsync({
    content: {
      title: '쓰잉 - 오늘의 학습',
      body: "오늘의 3문장이 기다리고 있어요! ✏️",
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    },
    identifier: 'daily-reminder',
  });

  await AsyncStorage.setItem(REMINDER_HOUR_KEY, String(hour));
  await AsyncStorage.setItem(REMINDER_MINUTE_KEY, String(minute));
}

/**
 * Schedule a streak reminder at 8PM daily.
 */
export async function scheduleStreakReminder(): Promise<void> {
  const mod = await loadNotifications();
  if (!mod) return;

  await cancelStreakReminder();

  await mod.scheduleNotificationAsync({
    content: {
      title: '쓰잉 - 스트릭 알림',
      body: "스트릭이 끊기기 전에 3문장만 써보세요! 🔥",
      sound: true,
    },
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
    },
    identifier: 'streak-reminder',
  });
}

/**
 * Cancel all scheduled notifications.
 */
export async function cancelAllNotifications(): Promise<void> {
  const mod = await loadNotifications();
  if (!mod) return;
  await mod.cancelAllScheduledNotificationsAsync();
}

/**
 * Cancel only the daily reminder.
 */
export async function cancelDailyReminder(): Promise<void> {
  const mod = await loadNotifications();
  if (!mod) return;
  try {
    await mod.cancelScheduledNotificationAsync('daily-reminder');
  } catch {
    // identifier may not exist
  }
}

/**
 * Cancel only the streak reminder.
 */
export async function cancelStreakReminder(): Promise<void> {
  const mod = await loadNotifications();
  if (!mod) return;
  try {
    await mod.cancelScheduledNotificationAsync('streak-reminder');
  } catch {
    // identifier may not exist
  }
}

/**
 * Enable push notifications: register + schedule reminders.
 */
export async function enablePushNotifications(): Promise<boolean> {
  const token = await registerForPushNotifications();
  if (!token && Platform.OS !== 'web') return false;

  const hour = parseInt((await AsyncStorage.getItem(REMINDER_HOUR_KEY)) || '9', 10);
  const minute = parseInt((await AsyncStorage.getItem(REMINDER_MINUTE_KEY)) || '0', 10);

  await scheduleDailyReminder(hour, minute);
  await scheduleStreakReminder();
  await AsyncStorage.setItem(PUSH_ENABLED_KEY, 'true');
  return true;
}

/**
 * Disable push notifications: cancel all scheduled.
 */
export async function disablePushNotifications(): Promise<void> {
  await cancelAllNotifications();
  await AsyncStorage.setItem(PUSH_ENABLED_KEY, 'false');
}

/**
 * Check if push notifications are currently enabled.
 */
export async function isPushEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(PUSH_ENABLED_KEY);
  return val === 'true';
}

/**
 * Get saved reminder time.
 */
export async function getReminderTime(): Promise<{ hour: number; minute: number }> {
  const hour = parseInt((await AsyncStorage.getItem(REMINDER_HOUR_KEY)) || '9', 10);
  const minute = parseInt((await AsyncStorage.getItem(REMINDER_MINUTE_KEY)) || '0', 10);
  return { hour, minute };
}
