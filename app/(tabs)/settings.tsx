import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Colors } from '@/constants/theme';
import { getSettings } from '@/stores/storage';

function SettingsRow({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  right,
  onPress,
}: {
  icon: string;
  iconColor?: string;
  iconBg?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center bg-card rounded-2xl p-4 mb-3 border border-border active:scale-[0.98]"
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: iconBg ?? 'rgba(255, 102, 0, 0.1)' }}
      >
        <Ionicons name={icon as any} size={20} color={iconColor ?? Colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-foreground">{title}</Text>
        {subtitle && (
          <Text className="text-xs text-muted-foreground mt-0.5">{subtitle}</Text>
        )}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={20} color={Colors.mutedForeground} />}
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      className="text-xs font-bold text-muted-foreground uppercase mb-3 ml-1"
      style={{ letterSpacing: 1.5 }}
    >
      {title}
    </Text>
  );
}

export default function SettingsScreen() {
  const settings = getSettings();
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-center px-6 py-4 border-b border-border">
          <Text className="text-lg font-bold text-foreground" style={{ letterSpacing: -0.5 }}>
            Settings
          </Text>
        </View>

        {/* Profile Card */}
        <View className="px-6 mt-4 mb-6">
          <View
            className="bg-card rounded-3xl p-5 border border-border overflow-hidden"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
          >
            <View className="flex-row items-center gap-4">
              <View
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 102, 0, 0.1)' }}
              >
                <Ionicons name="person" size={24} color={Colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground">Free Plan</Text>
                <Text className="text-xs text-muted-foreground mt-0.5">3 habits per routine</Text>
              </View>
              <Pressable
                className="px-4 py-2 bg-primary rounded-full"
                style={{ shadowColor: Colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 8 }}
              >
                <Text className="text-primary-foreground text-xs font-bold">Upgrade</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <View className="px-6 mb-6">
          <SectionHeader title="Notifications" />
          <SettingsRow
            icon="notifications"
            iconColor="#3B82F6"
            iconBg="rgba(59, 130, 246, 0.1)"
            title="Push Notifications"
            subtitle="Reminders and blocking alerts"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.secondary, true: Colors.primary }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingsRow
            icon="warning"
            iconColor="#F97316"
            iconBg="rgba(249, 115, 22, 0.1)"
            title="Notification Aggressiveness"
            subtitle={`Currently: ${settings.notificationAggressiveness}`}
          />
        </View>

        {/* Routines */}
        <View className="px-6 mb-6">
          <SectionHeader title="Routines" />
          <SettingsRow
            icon="alarm"
            iconColor="#EAB308"
            iconBg="rgba(234, 179, 8, 0.1)"
            title="Morning Alarm"
            subtitle="6:00 AM with motivational audio"
          />
          <SettingsRow
            icon="moon"
            iconColor="#8B5CF6"
            iconBg="rgba(139, 92, 246, 0.1)"
            title="Night Reminder"
            subtitle="9:30 PM wind-down trigger"
          />
          <SettingsRow
            icon="musical-notes"
            iconColor="#EC4899"
            iconBg="rgba(236, 72, 153, 0.1)"
            title="Audio Library"
            subtitle="5 clips available"
          />
        </View>

        {/* Blocking */}
        <View className="px-6 mb-6">
          <SectionHeader title="App Blocking" />
          <SettingsRow
            icon="lock-closed"
            iconColor="#EF4444"
            iconBg="rgba(239, 68, 68, 0.1)"
            title="Blocked Apps"
            subtitle="4 apps in jail"
          />
          <SettingsRow
            icon="timer"
            iconColor="#F97316"
            iconBg="rgba(249, 115, 22, 0.1)"
            title="Notification Interval"
            subtitle="Every 2 minutes when in blocked app"
          />
        </View>

        {/* Account */}
        <View className="px-6 mb-8">
          <SectionHeader title="Account" />
          <SettingsRow
            icon="star"
            iconColor="#EAB308"
            iconBg="rgba(234, 179, 8, 0.1)"
            title="Upgrade to Premium"
            subtitle="Unlimited habits, full audio library"
          />
          <SettingsRow
            icon="cloud-upload"
            iconColor="#10B981"
            iconBg="rgba(16, 185, 129, 0.1)"
            title="Backup Data"
            subtitle="Sync across devices"
          />
          <SettingsRow
            icon="information-circle"
            iconColor={Colors.mutedForeground}
            iconBg={Colors.secondary}
            title="About Locked In"
            subtitle="Version 1.0.0"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
