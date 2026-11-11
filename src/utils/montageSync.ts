import { NewspaperScene } from '../types';

/**
 * Finds the currently active scene at the given playback time.
 * If time is beyond the last scene, returns the last scene; if before, returns the first scene.
 */
export function getActiveScene(scenes: NewspaperScene[], currentTime: number): NewspaperScene | null {
  if (!scenes || scenes.length === 0) return null;
  const match = scenes.find((s) => currentTime >= s.startTime && currentTime < s.endTime);
  if (match) return match;
  if (currentTime >= scenes[scenes.length - 1].endTime) {
    return scenes[scenes.length - 1];
  }
  return scenes[0];
}

/**
 * Returns the index of the active scene.
 */
export function getActiveSceneIndex(scenes: NewspaperScene[], currentTime: number): number {
  if (!scenes || scenes.length === 0) return -1;
  const idx = scenes.findIndex((s) => currentTime >= s.startTime && currentTime < s.endTime);
  if (idx !== -1) return idx;
  if (currentTime >= scenes[scenes.length - 1].endTime) return scenes.length - 1;
  return 0;
}

/**
 * Calculates 0.0 -> 1.0 progress of the current scene.
 */
export function getSceneProgress(scene: NewspaperScene, currentTime: number): number {
  if (currentTime < scene.startTime) return 0;
  if (currentTime >= scene.endTime) return 1;
  const duration = scene.endTime - scene.startTime;
  if (duration <= 0) return 1;
  return Math.min(1, Math.max(0, (currentTime - scene.startTime) / duration));
}

export interface TextChunk {
  text: string;
  isHighlighted: boolean;
}

/**
 * Splits a text into segments, identifying where the target highlight word occurs.
 * Preserves exact casing and surrounding punctuation.
 */
export function splitTextWithHighlight(text: string, highlightWord: string): TextChunk[] {
  if (!text) return [];
  if (!highlightWord || !highlightWord.trim()) {
    return [{ text, isHighlighted: false }];
  }

  const escaped = highlightWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(\\b${escaped}\\b|${escaped})`, 'gi');
  const parts = text.split(regex);

  const chunks: TextChunk[] = [];
  for (const part of parts) {
    if (!part) continue;
    const isMatch = part.toLowerCase() === highlightWord.toLowerCase();
    chunks.push({
      text: part,
      isHighlighted: isMatch,
    });
  }

  return chunks;
}

/**
 * Formats time in seconds to mm:ss.cc
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) seconds = 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hundredths = Math.round((seconds % 1) * 100) % 100;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
}
