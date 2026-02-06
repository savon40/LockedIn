import { Audio, type AVPlaybackSource } from 'expo-av';

export interface BundledClip {
  id: string;
  name: string;
  duration: number; // seconds
  icon: string;
}

export const BUNDLED_AUDIO_CLIPS: BundledClip[] = [
  { id: 'alarm-chime', name: 'Alarm Chime', duration: 5, icon: 'alarm' },
  { id: 'morning-birds', name: 'Morning Birds', duration: 6, icon: 'sunny' },
  { id: 'ocean-waves', name: 'Ocean Waves', duration: 8, icon: 'water' },
  { id: 'energetic-beat', name: 'Energetic Beat', duration: 4, icon: 'musical-notes' },
  { id: 'calm-piano', name: 'Calm Piano', duration: 6, icon: 'musical-note' },
];

export const AUDIO_REQUIRE_MAP: Record<string, AVPlaybackSource> = {
  'alarm-chime': require('@/assets/audio/alarm-chime.wav'),
  'morning-birds': require('@/assets/audio/morning-birds.wav'),
  'ocean-waves': require('@/assets/audio/ocean-waves.wav'),
  'energetic-beat': require('@/assets/audio/energetic-beat.wav'),
  'calm-piano': require('@/assets/audio/calm-piano.wav'),
};

let currentSound: Audio.Sound | null = null;
let currentClipId: string | null = null;

async function ensureAudioMode() {
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
  });
}

export async function playPreview(clipId: string): Promise<boolean> {
  await stopPreview();

  const source = AUDIO_REQUIRE_MAP[clipId];
  if (!source) return false;

  try {
    await ensureAudioMode();
    const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
    currentSound = sound;
    currentClipId = clipId;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        stopPreview();
      }
    });

    return true;
  } catch {
    currentSound = null;
    currentClipId = null;
    return false;
  }
}

export async function stopPreview(): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.unloadAsync();
    } catch {
      // already unloaded
    }
    currentSound = null;
    currentClipId = null;
  }
}

export function getCurrentlyPlayingId(): string | null {
  return currentClipId;
}
