import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useMemo } from 'react';
import { useRoutineStore } from '@/stores/useRoutineStore';
import { Colors } from '@/constants/theme';
import { ProgressRing } from '@/components/ProgressRing';
import { getHabitStyle } from '@/components/HabitLibrary';
import type { Habit, RoutineType } from '@/types';

// --- Helpers ---

function parseTargetTime(timeStr: string): { hours24: number; minutes: number } {
  const [time, period] = timeStr.split(' ');
  const [h, m] = time.split(':').map(Number);
  let hours24 = h;
  if (period === 'PM' && h !== 12) hours24 += 12;
  if (period === 'AM' && h === 12) hours24 = 0;
  return { hours24, minutes: m };
}

function getActiveRoutineType(morningTime: string, nightTime: string): RoutineType {
  const now = new Date();
  const current = now.getHours() * 60 + now.getMinutes();

  const morning = parseTargetTime(morningTime);
  const night = parseTargetTime(nightTime);
  const morningMins = morning.hours24 * 60 + morning.minutes;
  const nightMins = night.hours24 * 60 + night.minutes;

  // Show whichever routine is nearest (forward or backward on the 24h clock)
  const distToMorning = Math.min(
    ((morningMins - current) + 1440) % 1440,
    ((current - morningMins) + 1440) % 1440,
  );
  const distToNight = Math.min(
    ((nightMins - current) + 1440) % 1440,
    ((current - nightMins) + 1440) % 1440,
  );

  return distToMorning <= distToNight ? 'morning' : 'night';
}

function getCountdownText(targetTime: string): string {
  const now = new Date();
  const { hours24, minutes } = parseTargetTime(targetTime);

  const target = new Date();
  target.setHours(hours24, minutes, 0, 0);

  // If target is in the past today, it's for tomorrow
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;

  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

// --- Blocked apps (matching routines page) ---

const BLOCKED_APPS = [
  { name: 'Instagram', icon: 'logo-instagram' },
  { name: 'TikTok', icon: 'videocam' },
  { name: 'X', icon: 'logo-twitter' },
  { name: 'Reddit', icon: 'logo-reddit' },
  { name: 'Facebook', icon: 'logo-facebook' },
];

// --- Components ---

function HabitItem({
  habit,
  isCurrent,
  onToggle,
}: {
  habit: Habit;
  isCurrent: boolean;
  onToggle: () => void;
}) {
  const style = getHabitStyle(habit.name, habit.icon);
  const iconName = habit.icon ?? style.icon;

  if (habit.completed) {
    return (
      <Pressable
        onPress={onToggle}
        className="flex-row items-center p-4 bg-card/50 border border-border rounded-2xl mb-3"
        style={{ opacity: 0.6 }}
      >
        <View className="mr-4">
          <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
        </View>
        <Text className="text-base font-medium text-muted-foreground line-through flex-1">
          {habit.name}
        </Text>
        <View
          className="w-8 h-8 rounded-full items-center justify-center"
          style={{ backgroundColor: style.bg }}
        >
          <Ionicons name={iconName as any} size={16} color={style.color} />
        </View>
      </Pressable>
    );
  }

  if (isCurrent) {
    return (
      <Pressable
        onPress={onToggle}
        className="flex-row items-center p-5 bg-card border rounded-2xl mb-3 overflow-hidden"
        style={{
          borderColor: 'rgba(255, 102, 0, 0.2)',
          transform: [{ scale: 1.02 }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <View
          className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"
          style={{ shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5 }}
        />
        <View className="w-6 h-6 rounded-full border-2 border-primary mr-4" />
        <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">{habit.name}</Text>
          <Text className="text-xs text-muted-foreground mt-0.5">Current Task</Text>
        </View>
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: style.bg }}
        >
          <Ionicons name={iconName as any} size={18} color={style.color} />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center p-4 bg-card border border-border rounded-2xl mb-3"
    >
      <View className="w-6 h-6 rounded-full border-2 border-border mr-4" />
      <Text className="text-base font-medium text-muted-foreground flex-1">
        {habit.name}
      </Text>
      <View
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: style.bg }}
      >
        <Ionicons name={iconName as any} size={16} color={style.color} />
      </View>
    </Pressable>
  );
}

function BlockedAppIcon({ icon, name }: { icon: string; name: string }) {
  return (
    <View className="items-center" style={{ width: 64 }}>
      <View
        className="w-14 h-14 rounded-2xl bg-background border items-center justify-center mb-1"
        style={{ borderColor: 'rgba(239, 68, 68, 0.15)' }}
      >
        <Ionicons name={icon as any} size={24} color={Colors.mutedForeground} />
        <View
          className="absolute inset-0 rounded-2xl items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        >
          <Ionicons name="lock-closed" size={14} color={Colors.error} />
        </View>
      </View>
      <Text className="text-xs text-muted-foreground text-center" numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}

// --- Main screen ---

export default function DashboardScreen() {
  const {
    morningRoutine,
    nightRoutine,
    streakData,
    toggleHabit,
    updateRoutine,
  } = useRoutineStore();

  const [now, setNow] = useState(new Date());

  // Tick every 30s to keep countdown fresh
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-detect which routine based on current time
  const routineType = useMemo(
    () => getActiveRoutineType(morningRoutine.targetTime, nightRoutine.targetTime),
    [morningRoutine.targetTime, nightRoutine.targetTime, now]
  );

  const routine = routineType === 'morning' ? morningRoutine : nightRoutine;
  const completedCount = routine.habits.filter((h) => h.completed).length;
  const totalCount = routine.habits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const isComplete = completedCount === totalCount && totalCount > 0;
  const currentTaskIndex = routine.habits.findIndex((h) => !h.completed);

  const countdown = useMemo(
    () => getCountdownText(routine.targetTime),
    [routine.targetTime, now]
  );

  // Estimated time remaining (5 min per task)
  const remainingTasks = totalCount - completedCount;
  const estimatedMinutes = remainingTasks * 5;
  const timeDisplay = isComplete
    ? '00:00'
    : `${String(Math.floor(estimatedMinutes / 60)).padStart(2, '0')}:${String(estimatedMinutes % 60).padStart(2, '0')}`;

  const handleToggleActive = () => {
    updateRoutine(routineType, { isActive: !routine.isActive });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-6 py-4 border-b border-border"
        style={{ backgroundColor: 'rgba(255, 247, 240, 0.8)' }}
      >
        <Text className="text-sm font-medium text-muted-foreground" style={{ fontVariant: ['tabular-nums'] }}>
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <View
          className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(255, 102, 0, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 102, 0, 0.2)' }}
        >
          <Ionicons name="flame" size={16} color={Colors.primary} />
          <Text className="text-xs font-bold tracking-wide" style={{ color: Colors.primary }}>
            {streakData.currentStreak} DAY STREAK
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Routine Type + Countdown + Toggle */}
        <View className="flex-row items-center justify-between px-6 pt-5 pb-2">
          <View>
            <Text className="text-xs font-bold text-muted-foreground uppercase" style={{ letterSpacing: 2 }}>
              {routineType === 'morning' ? 'Morning Routine' : 'Night Routine'}
            </Text>
            <View className="flex-row items-center gap-1.5 mt-1">
              <Ionicons name="time-outline" size={14} color={Colors.mutedForeground} />
              <Text className="text-xs text-muted-foreground">
                Starts in <Text className="font-semibold" style={{ color: Colors.primary }}>{countdown}</Text>
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleToggleActive}
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: routine.isActive ? 'rgba(52, 199, 89, 0.1)' : Colors.secondary,
              borderWidth: 1,
              borderColor: routine.isActive ? 'rgba(52, 199, 89, 0.2)' : Colors.border,
            }}
          >
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: routine.isActive ? Colors.success : Colors.mutedForeground }}
            />
            <Text
              className="text-xs font-semibold"
              style={{ color: routine.isActive ? Colors.success : Colors.mutedForeground }}
            >
              {routine.isActive ? 'Active' : 'Off'}
            </Text>
          </Pressable>
        </View>

        {/* Progress Ring */}
        <View className="items-center py-4">
          <ProgressRing size={256} strokeWidth={8} progress={progress}>
            <View className="items-center">
              {!isComplete && routine.isActive && (
                <View
                  className="flex-row items-center mb-2 px-3 py-1 rounded-full bg-card border border-border"
                  style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 }}
                >
                  <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                  <Text className="text-muted-foreground font-bold uppercase" style={{ fontSize: 10, letterSpacing: 2 }}>
                    Focus Mode
                  </Text>
                </View>
              )}
              <Text
                className="text-foreground font-black"
                style={{ fontSize: 56, letterSpacing: -2, fontVariant: ['tabular-nums'], lineHeight: 56 }}
              >
                {timeDisplay}
              </Text>
              <Text className="text-sm font-medium text-muted-foreground mt-1">
                {completedCount}/{totalCount} Tasks Complete
              </Text>
            </View>
          </ProgressRing>
        </View>

        {/* Task List */}
        {routine.isActive ? (
          <View className="px-6 pb-4">
            {routine.habits.map((habit, index) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                isCurrent={index === currentTaskIndex}
                onToggle={() => toggleHabit(routineType, habit.id)}
              />
            ))}
          </View>
        ) : (
          <View className="px-6 pb-4 items-center py-8">
            <Ionicons name="moon-outline" size={40} color={Colors.mutedForeground} style={{ opacity: 0.4 }} />
            <Text className="text-muted-foreground mt-3 text-sm">
              Routine is turned off
            </Text>
            <Pressable
              onPress={handleToggleActive}
              className="mt-4 px-5 py-2.5 rounded-full bg-primary"
            >
              <Text className="text-primary-foreground text-sm font-semibold">Turn On</Text>
            </Pressable>
          </View>
        )}

        {/* Blocked Apps Zone */}
        {!isComplete && routine.isActive && (
          <View
            className="mx-6 mb-8 p-5 rounded-3xl"
            style={{
              backgroundColor: Colors.blockedBg,
              borderWidth: 1,
              borderColor: Colors.blockedBorder,
            }}
          >
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="lock-closed" size={14} color={Colors.blockedText} />
              <Text className="text-xs font-bold uppercase" style={{ color: Colors.blockedText, letterSpacing: 2 }}>
                Blocked Until Completion
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row" style={{ gap: 12 }}>
                {BLOCKED_APPS.map((app) => (
                  <BlockedAppIcon key={app.name} icon={app.icon} name={app.name} />
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
