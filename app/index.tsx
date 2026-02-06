import { Redirect } from 'expo-router';
import { getSettings } from '@/stores/storage';

export default function Index() {
  const settings = getSettings();

  if (settings.hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/welcome" />;
}
