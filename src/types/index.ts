export type AspectRatio = '1:1' | '9:16' | '16:9';

export type HighlightStyle = 'marker' | 'cutout' | 'red-pen' | 'underline' | 'inverted';

export type SoundEffectType = 'paper-shuffle' | 'marker-squeak' | 'typewriter' | 'camera' | 'none';

export type PaperTheme = 'vintage-aged' | 'tabloid-cream' | 'sepia-archive' | 'darkroom-noir' | 'modern-press';

export type SceneType = 'quote' | 'masthead' | 'macro-column' | 'desk-report' | 'archive-memo';

export interface NewspaperScene {
  id: string;
  type: SceneType;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  headline: string;
  kicker?: string;
  subhead?: string;
  desk?: string;
  bodyColumns?: string[];
  highlightWord: string;
  highlightColor?: string;
  highlightStyle?: HighlightStyle;
  rotation?: number;
  zoom?: number;
}

export interface MontageProject {
  id: string;
  title: string;
  audioSrc: string;
  duration: number;
  aspectRatio: AspectRatio;
  theme: PaperTheme;
  soundEffect: SoundEffectType;
  scenes: NewspaperScene[];
}

export interface WordTiming {
  id: string;
  word: string;
  start: number;
  end: number;
  highlightColor?: string;
}

export interface PresetScenario {
  id: string;
  title: string;
  kicker: string;
  headline: string;
  backgroundArticles: string[];
  duration: number;
  timings: WordTiming[];
  highlightColor: string;
  style: HighlightStyle;
  soundEffect: SoundEffectType;
  paperTheme: PaperTheme;
}
