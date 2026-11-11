export interface WordTiming {
  id: string;
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
  highlightColor?: string;
  isHeadline?: boolean;
}

export interface PresetItem {
  id: string;
  title: string;
  kicker: string;
  text: string;
  audioDuration: number;
  timings: WordTiming[];
  backgroundHeadline: string;
  highlightColor: string;
}

/**
 * Finds the index of the word active at the given time.
 * Returns -1 if no word is active.
 */
export function getActiveWordIndex(words: WordTiming[], currentTime: number): number {
  if (!words || words.length === 0) return -1;
  return words.findIndex((w) => currentTime >= w.start && currentTime <= w.end);
}

/**
 * Checks if a word has already been spoken / passed at the given time.
 */
export function isWordCompleted(word: WordTiming, currentTime: number): boolean {
  return currentTime > word.end;
}

/**
 * Calculates the 0.0 -> 1.0 progress of the active word sweep animation.
 */
export function getWordProgress(word: WordTiming, currentTime: number): number {
  if (currentTime < word.start) return 0;
  if (currentTime >= word.end) return 1;
  const duration = word.end - word.start;
  if (duration <= 0) return 1;
  return Math.min(1, Math.max(0, (currentTime - word.start) / duration));
}

/**
 * Formats time in seconds to mm:ss.cc (e.g. 01:23.45)
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) seconds = 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hundredths = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
}

/**
 * Parses time formatted like mm:ss.cc or ss.cc into seconds.
 */
export function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.trim().split(':');
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]) || 0;
    const secs = parseFloat(parts[1]) || 0;
    return mins * 60 + secs;
  }
  return parseFloat(timeStr) || 0;
}

/**
 * Automatically splits a sentence into timed words evenly across a duration.
 */
export function generateDefaultTimings(text: string, totalDuration: number, startTime = 0.3): WordTiming[] {
  const rawWords = text.trim().split(/\s+/).filter(Boolean);
  if (rawWords.length === 0) return [];

  const availableDuration = Math.max(0.5, totalDuration - startTime - 0.2);
  const wordDuration = availableDuration / rawWords.length;
  // leave a tiny gap between words for crisp cadence
  const activeDuration = Math.max(0.15, wordDuration * 0.92);

  return rawWords.map((word, idx) => {
    const start = Number((startTime + idx * wordDuration).toFixed(2));
    const end = Number((start + activeDuration).toFixed(2));
    return {
      id: `w-${idx}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      word,
      start,
      end,
    };
  });
}

/**
 * Generates organic SVG points for a torn/ripped paper clipping edge.
 */
export function generateTornEdgePoints(
  width: number,
  height: number,
  roughness = 4,
  seed = 42
): string {
  // Deterministic pseudo-random based on seed
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const points: [number, number][] = [];
  const step = 12;

  // Top edge (left to right) with subtle paper tears
  for (let x = 0; x <= width; x += step) {
    const offset = (rand() - 0.5) * roughness * 0.8;
    points.push([Math.min(width, x), offset]);
  }

  // Right edge (top to bottom)
  for (let y = 0; y <= height; y += step) {
    const offset = (rand() - 0.5) * roughness;
    points.push([width + offset, Math.min(height, y)]);
  }

  // Bottom edge (right to left) - more jagged tear
  for (let x = width; x >= 0; x -= step) {
    const offset = (rand() - 0.5) * roughness * 1.2;
    points.push([Math.max(0, x), height + offset]);
  }

  // Left edge (bottom to top)
  for (let y = height; y >= 0; y -= step) {
    const offset = (rand() - 0.5) * roughness;
    points.push([offset, Math.max(0, y)]);
  }

  return points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}
