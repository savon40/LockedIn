import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '@/constants/theme';
import {
  BUNDLED_AUDIO_CLIPS,
  playPreview,
  stopPreview,
  getCurrentlyPlayingId,
} from '@/services/audioService';

interface AudioSelectorProps {
  selectedAudioId?: string;
  onSelect: (audioId: string) => void;
}

export default function AudioSelector({ selectedAudioId, onSelect }: AudioSelectorProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const navigation = useNavigation();

  // Track mounted state
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopPreview();
    };
  }, []);

  // Stop audio on tab blur
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      stopPreview();
      if (mountedRef.current) setPlayingId(null);
    });
    return unsubscribe;
  }, [navigation]);

  // Sync playingId with the audio service
  useEffect(() => {
    const interval = setInterval(() => {
      if (!mountedRef.current) return;
      const current = getCurrentlyPlayingId();
      if (current !== playingId) {
        setPlayingId(current);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [playingId]);

  const handlePlayPause = useCallback(async (clipId: string) => {
    if (playingId === clipId) {
      await stopPreview();
      if (mountedRef.current) setPlayingId(null);
    } else {
      const ok = await playPreview(clipId);
      if (mountedRef.current) setPlayingId(ok ? clipId : null);
    }
  }, [playingId]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ gap: 8 }}>
      {BUNDLED_AUDIO_CLIPS.map((clip) => {
        const isSelected = selectedAudioId === clip.id;
        const isPlaying = playingId === clip.id;

        return (
          <Pressable
            key={clip.id}
            onPress={() => onSelect(clip.id)}
            className="flex-row items-center gap-3 p-3 rounded-2xl border"
            style={{
              borderColor: isSelected ? Colors.primary : Colors.border,
              borderWidth: isSelected ? 2 : 1,
              backgroundColor: isSelected ? 'rgba(255, 102, 0, 0.05)' : Colors.card,
            }}
          >
            {/* Play/Pause */}
            <Pressable
              onPress={() => handlePlayPause(clip.id)}
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{
                backgroundColor: isPlaying ? Colors.primary : Colors.secondary,
              }}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={18}
                color={isPlaying ? '#fff' : Colors.foreground}
              />
            </Pressable>

            {/* Info */}
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">{clip.name}</Text>
              <Text className="text-xs text-muted-foreground">{formatDuration(clip.duration)}</Text>
            </View>

            {/* Icon */}
            <Ionicons name={clip.icon as any} size={18} color={Colors.mutedForeground} />

            {/* Selected check */}
            {isSelected && (
              <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
