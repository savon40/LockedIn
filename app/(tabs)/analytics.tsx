import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoutineStore } from '@/stores/useRoutineStore';
import { Colors } from '@/constants/theme';

// Deterministic heatmap data (12 weeks x 7 days)
const HEATMAP_DATA: number[][] = [
  [0, 0, 1, 3, 3, 0, 3],
  [3, 3, 3, 0, 3, 3, 3],
  [0, 0, 0, 3, 3, 3, 3],
  [3, 3, 3, 0, 3, 3, 3],
  [3, 3, 0, 0, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [0, 3, 3, 3, 3, 0, 0],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 0, 3, 3, 0, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 0, 0, 3],
  [4, 4, 4, 4, 4, 0, 0], // Current week (glowing)
];

const HEATMAP_COLORS: Record<number, string> = {
  0: '#F5F5F5',
  1: 'rgba(52, 211, 153, 0.4)',
  2: '#6DE08A',
  3: '#10B981',
  4: '#34D399', // Current week glow
};

function ConsistencyHeatmap() {
  return (
    <View
      className="bg-card rounded-3xl p-5 border border-border overflow-hidden"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xl font-bold text-foreground">Consistency</Text>
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255, 102, 0, 0.1)', borderWidth: 1, borderColor: 'rgba(255, 102, 0, 0.2)' }}>
          <Text className="text-xs font-medium" style={{ color: Colors.primary }}>Top 5%</Text>
        </View>
      </View>

      {/* Percentage overlay */}
      <View className="absolute top-5 right-5 z-10 items-end">
        <Text className="text-3xl font-bold text-foreground">87%</Text>
        <Text className="text-xs font-medium text-muted-foreground uppercase" style={{ letterSpacing: 1.5 }}>Consistency</Text>
      </View>

      {/* Grid */}
      <View className="flex-row gap-1.5 mt-8">
        {/* Day labels */}
        <View className="justify-between py-1" style={{ height: 140, width: 16 }}>
          <Text className="text-muted-foreground font-medium" style={{ fontSize: 10 }}>M</Text>
          <Text className="text-muted-foreground font-medium" style={{ fontSize: 10 }}>W</Text>
          <Text className="text-muted-foreground font-medium" style={{ fontSize: 10 }}>F</Text>
        </View>

        {/* Heatmap columns */}
        <View className="flex-1 flex-row gap-1.5">
          {HEATMAP_DATA.map((week, weekIdx) => (
            <View key={weekIdx} className="flex-1 gap-1.5">
              {week.map((val, dayIdx) => (
                <View
                  key={dayIdx}
                  className="flex-1 rounded-sm"
                  style={{
                    backgroundColor: HEATMAP_COLORS[val] ?? '#F5F5F5',
                    minHeight: 14,
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View className="flex-row items-center justify-end gap-1.5 mt-4">
        <Text className="text-muted-foreground mr-1" style={{ fontSize: 10 }}>Less</Text>
        {['#F5F5F5', 'rgba(52, 211, 153, 0.4)', '#10B981', '#34D399'].map((color, i) => (
          <View key={i} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
        ))}
        <Text className="text-muted-foreground ml-1" style={{ fontSize: 10 }}>More</Text>
      </View>
    </View>
  );
}

function StatCard({
  icon,
  iconColor,
  iconBg,
  value,
  unit,
  label,
  ghostIcon,
}: {
  icon: string;
  iconColor: string;
  iconBg: string;
  value: string;
  unit?: string;
  label: string;
  ghostIcon: string;
}) {
  return (
    <View
      className="flex-1 bg-card rounded-3xl p-5 border border-border overflow-hidden"
      style={{ minHeight: 130 }}
    >
      {/* Ghost icon */}
      <View className="absolute top-0 right-0 p-3" style={{ opacity: 0.08 }}>
        <Ionicons name={ghostIcon as any} size={56} color={Colors.primary} />
      </View>

      <View className="w-10 h-10 rounded-xl items-center justify-center mb-4" style={{ backgroundColor: iconBg }}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <View className="flex-row items-baseline">
        <Text className="text-2xl font-bold text-foreground" style={{ letterSpacing: -0.5 }}>
          {value}
        </Text>
        {unit && (
          <Text className="text-sm font-normal text-muted-foreground ml-0.5">{unit}</Text>
        )}
      </View>
      <Text className="text-xs font-medium text-muted-foreground mt-1">{label}</Text>
    </View>
  );
}

function AchievementBadge({
  name,
  level,
  icon,
  color,
  locked,
}: {
  name: string;
  level: string;
  icon: string;
  color: string;
  locked?: boolean;
}) {
  return (
    <View
      className="w-40 h-48 bg-card rounded-3xl p-4 border border-border items-center justify-center overflow-hidden"
      style={locked ? { opacity: 0.5 } : undefined}
    >
      {/* Badge icon area */}
      <View
        className="w-20 h-20 rounded-2xl items-center justify-center mb-3"
        style={{
          backgroundColor: locked ? Colors.secondary : `${color}15`,
          shadowColor: locked ? 'transparent' : color,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        }}
      >
        {locked ? (
          <Ionicons name="lock-closed" size={28} color={Colors.mutedForeground} />
        ) : (
          <Ionicons name={icon as any} size={32} color={color} />
        )}
        {!locked && (
          <View
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-card items-center justify-center"
            style={{ backgroundColor: color }}
          >
            <Ionicons name="checkmark" size={12} color="white" />
          </View>
        )}
      </View>
      <Text className={`text-sm font-bold ${locked ? 'text-muted-foreground' : 'text-foreground'}`}>
        {name}
      </Text>
      <Text className="text-xs mt-1 font-medium" style={{ color: locked ? Colors.mutedForeground : color }}>
        {level}
      </Text>
    </View>
  );
}

export default function AnalyticsScreen() {
  const { streakData } = useRoutineStore();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-center px-6 py-4 border-b border-border relative">
          <Text className="text-lg font-bold text-foreground" style={{ letterSpacing: -0.5 }}>Performance</Text>
          <Pressable className="absolute right-6 p-2">
            <Ionicons name="share-outline" size={20} color={Colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Consistency Heatmap */}
        <View className="px-6 mt-4 mb-4">
          <ConsistencyHeatmap />
        </View>

        {/* Stats Grid */}
        <View className="px-6 mb-4 flex-row gap-4">
          <StatCard
            icon="hourglass"
            iconColor="#F97316"
            iconBg="rgba(249, 115, 22, 0.1)"
            value="42h 10m"
            label="Time Reclaimed"
            ghostIcon="hourglass"
          />
          <StatCard
            icon="trophy"
            iconColor="#EAB308"
            iconBg="rgba(234, 179, 8, 0.1)"
            value="14"
            label="Perfect Days"
            ghostIcon="trophy"
          />
        </View>

        <View className="px-6 mb-4 flex-row gap-4">
          <StatCard
            icon="flash"
            iconColor="#3B82F6"
            iconBg="rgba(59, 130, 246, 0.1)"
            value={String(streakData.currentStreak)}
            unit=" Days"
            label="Current Streak"
            ghostIcon="flash"
          />
          <StatCard
            icon="sunny"
            iconColor="#8B5CF6"
            iconBg="rgba(139, 92, 246, 0.1)"
            value="06:15"
            unit=" AM"
            label="Avg Start Time"
            ghostIcon="sunny"
          />
        </View>

        {/* Achievements */}
        <View className="mt-4 mb-8">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-xl font-bold text-foreground">Achievements</Text>
            <Pressable>
              <Text className="text-xs font-semibold" style={{ color: Colors.primary }}>View All</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
          >
            <AchievementBadge
              name="Early Bird"
              level="Level 5 Unlocked"
              icon="sunny"
              color="#EAB308"
            />
            <AchievementBadge
              name="Detox Master"
              level="Level 2 Unlocked"
              icon="shield-checkmark"
              color="#9CA3AF"
            />
            <AchievementBadge
              name="Monk Mode"
              level="Locked"
              icon="lock-closed"
              color="#6B7280"
              locked
            />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
