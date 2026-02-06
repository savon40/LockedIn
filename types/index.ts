export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  duration?: number; // estimated minutes
  completed: boolean;
}

export interface Routine {
  habits: Habit[];
  targetTime: string; // e.g. "6:00 AM"
  blockedApps: string[];
  isActive: boolean;
  selectedAudioId?: string;
}

export interface DayCompletion {
  morning: boolean;
  night: boolean;
  violations: number;
  morningStartTime?: string;
  nightStartTime?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  completionHistory: Record<string, DayCompletion>;
}

export interface AudioClip {
  id: string;
  name: string;
  artist?: string;
  localPath?: string;
  remoteUrl?: string;
  duration: number; // seconds
  isPremium: boolean;
}

export interface Settings {
  alarmVolume: number;
  notificationAggressiveness: 'low' | 'medium' | 'high';
  selectedMorningAudio: string | null;
  selectedNightAudio: string | null;
  hasCompletedOnboarding: boolean;
}

export type RoutineType = 'morning' | 'night';

export type TabName = 'index' | 'routines' | 'analytics' | 'settings';
