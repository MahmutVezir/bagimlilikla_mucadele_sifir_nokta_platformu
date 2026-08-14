import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

let configured = false;

export async function configureNotifications(): Promise<void> {
  if (configured) return;
  if (Platform.OS === 'web') {
    configured = true;
    return;
  }
  try {
    Notifications.setNotificationHandler({
      handleNotification: () =>
        Promise.resolve({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        } as any),
    });
    configured = true;
  } catch {
    configured = true;
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const perm = await Notifications.requestPermissionsAsync();
    return (perm as any).status === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Sıfır Nokta',
        body: 'Bugünkü kaydını oluşturmayı unutma. Kendin için bir adım daha.',
      },
      trigger: {
        hour,
        minute,
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
      } as any,
    });
  } catch {
    // Silent fail on web / unsupported platforms
  }
}

export async function sendImmediateNotification(title: string, body: string): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: { seconds: 1, type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL } as any,
    });
  } catch {
    // Silent fail
  }
}
