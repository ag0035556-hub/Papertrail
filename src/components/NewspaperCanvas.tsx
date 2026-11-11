import React, { useMemo } from 'react';
import { AspectRatio, HighlightStyle, PaperTheme, WordTiming } from '../types';
import { getActiveWordIndex, isWordCompleted, getWordProgress } from '../utils/newspaperSync';

interface NewspaperCanvasProps {
  aspectRatio: AspectRatio;
  theme: PaperTheme;
  kicker: string;
  headline: string;
  timings: WordTiming[];
  currentTime: number;
  backgroundArticles: string[];
  highlightColor: string;
  highlightStyle: HighlightStyle;
  highlightMode: 'active-word' | 'cumulative';
  blurDepth: number;
  fontSize: number;
  showTornEdges: boolean;
  paperShake: boolean;
}

export const NewspaperCanvas: React.FC<NewspaperCanvasProps> = ({
  aspectRatio,
  theme,
  kicker,
  headline,
  timings,
  currentTime,
  backgroundArticles,
  highlightColor,
  highlightStyle,
  highlightMode,
  blurDepth,
  fontSize,
  showTornEdges,
  paperShake,
}) => {
  const activeWordIdx = useActiveWord(timings, currentTime);

  // Theme color definitions
  const themeColors = useMemo(() => {
    switch (theme) {
      case 'vintage-aged':
        return {
          bg: '#f3ede1',
          bgDark: '#e7decb',
          ink: '#181614',
          fadedInk: '#6e6962',
          border: '#2c2824',
          accent: '#7a2218',
        };
      case 'tabloid-cream':
        return {
          bg: '#fbf9f2',
          bgDark: '#eee9dd',
          ink: '#121110',
          fadedInk: '#5e5a55',
          border: '#1a1918',
          accent: '#b91c1c',
        };
      case 'sepia-archive':
        return {
          bg: '#e8dcbe',
          bgDark: '#d9caa8',
          ink: '#262017',
          fadedInk: '#706450',
          border: '#382f22',
          accent: '#8b3a1a',
        };
      case 'darkroom-noir':
        return {
          bg: '#1c1b1a',
          bgDark: '#141413',
          ink: '#eae7df',
          fadedInk: '#9e998f',
          border: '#3a3835',
          accent: '#f59e0b',
        };
      case 'modern-press':
      default:
        return {
          bg: '#f8f8f6',
          bgDark: '#ecece8',
          ink: '#141414',
          fadedInk: '#5a5a58',
          border: '#1f1f1f',
          accent: '#0284c7',
        };
    }
  }, [theme]);

  // Aspect ratio sizing classes
  const aspectClass = useMemo(() => {
    switch (aspectRatio) {
      case '9:16':
        return 'w-full max-w-[420px] aspect-[9/16]';
      case '1:1':
        return 'w-full max-w-[540px] aspect-square';
      case '16:9':
        return 'w-full max-w-[720px] aspect-[16/9]';
    }
  }, [aspectRatio]);

  // Format words list
  const wordsToRender: WordTiming[] = useMemo(() => {
    if (timings && timings.length > 0) return timings;
    return headline.split(/\s+/).map((word, i) => ({
      id: `fallback-${i}`,
      word,
      start: i * 0.6,
      end: (i + 1) * 0.6,
    }));
  }, [timings, headline]);

  return (
    <div
      className={`relative select-none overflow-hidden mx-auto shadow-2xl transition-all duration-300 rounded-sm flex flex-col justify-between ${aspectClass}`}
      style={{
        backgroundColor: themeColors.bg,
        color: themeColors.ink,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(0, 0, 0, 0.08)',
        transform: paperShake && activeWordIdx >= 0 ? 'translate(0.5px, -0.5px)' : 'none',
      }}
      data-testid="newspaper-canvas"
    >
      {/* Paper texture overlay with SVG noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 60%, rgba(0,0,0,0.18) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle newspaper center fold crease */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[1px] bg-black/10 shadow-[0_0_8px_rgba(0,0,0,0.08)]" />

      {/* Top Folio / Masthead Bar */}
      <div className="relative z-10 px-6 pt-5 pb-2 border-b border-black/20">
        <div className="flex items-center justify-between text-[10px] tracking-wider uppercase font-serif text-black/60 font-semibold mb-1">
          <span>THE DAILY INQUIRER</span>
          <span>EST. 1894 • VOL. CLIV</span>
          <span>PRICE 5¢</span>
        </div>
        <div className="h-[2px] bg-black/80 w-full mb-[2px]" />
        <div className="h-[1px] bg-black/40 w-full" />
      </div>

      {/* Surrounding background articles: TOP BLOCK (blurred for depth of field) */}
      <div
        className="relative z-1 px-6 pt-3 pb-1 overflow-hidden transition-all duration-300"
        style={{
          filter: blurDepth > 0 ? `blur(${blurDepth}px)` : 'none',
          opacity: blurDepth > 0 ? 0.72 : 0.95,
        }}
      >
        <div className="columns-2 gap-4 text-justify font-serif text-[11px] leading-[1.35] text-black/75">
          <p className="mb-2">
            <span className="float-left text-2xl font-bold font-serif leading-none pr-1.5 pt-0.5 text-black">
              S
            </span>
            {backgroundArticles[0] || 'Sources close to the matter described it as a misunderstanding. Sources say it was pending review for months before being brought forward.'}
          </p>
          <p>{backgroundArticles[1] || "City council voted 4-3 to table the inquiry. One member branded the situation 'not ideal' and left. A pigeon was involved in disrupting the final reading."}</p>
        </div>
      </div>

      {/* FOCAL CLIPPING: The Newspaper clipping headline with dynamic word synchronization */}
      <div className="relative z-20 px-4 py-2 my-auto">
        <div
          className={`relative p-5 sm:p-6 transition-all duration-200 ${
            showTornEdges
              ? 'border-y border-dashed border-black/30 shadow-[0_12px_30px_rgba(0,0,0,0.18)]'
              : 'border border-black/20 shadow-lg'
          }`}
          style={{
            backgroundColor: themeColors.bgDark,
            boxShadow: '0 16px 36px -8px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.12)',
            transform: 'rotate(-0.4deg)',
          }}
        >
          {/* Subtle paper tape at top right */}
          <div className="absolute -top-2.5 right-6 w-12 h-5 bg-[#f4e6b5]/75 border border-black/10 rotate-3 shadow-sm pointer-events-none backdrop-blur-[0.5px]" />

          {/* Kicker Tag (e.g. NATIONAL COMPOSER) */}
          {kicker && (
            <div className="text-center mb-3">
              <span
                className="inline-block px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase font-bold text-black/85 border border-black/35 rounded-none"
                style={{ backgroundColor: `${themeColors.bg}dd` }}
              >
                {kicker}
              </span>
            </div>
          )}

          {/* Dynamic Headline with word-by-word newspaper highlight */}
          <div
            className="text-center font-serif leading-[1.3] tracking-tight font-extrabold flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 sm:gap-x-2.5 max-w-[340px] mx-auto"
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: '"Newsreader", "Playfair Display", Georgia, serif',
            }}
          >
            {wordsToRender.map((w, idx) => {
              const isActive = idx === activeWordIdx;
              const isPassed = isWordCompleted(w, currentTime);
              const progress = isActive ? getWordProgress(w, currentTime) : isPassed ? 1 : 0;
              const wordColor = w.highlightColor || highlightColor;

              return (
                <WordRenderer
                  key={w.id || idx}
                  word={w.word}
                  isActive={isActive}
                  isPassed={isPassed}
                  progress={progress}
                  color={wordColor}
                  style={highlightStyle}
                  mode={highlightMode}
                  themeColors={themeColors}
                />
              );
            })}
          </div>

          {/* Small newspaper line rule under clipping headline */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-[1px] bg-black/30 flex-1" />
            <div className="w-1.5 h-1.5 rotate-45 bg-black/40" />
            <div className="h-[1px] bg-black/30 flex-1" />
          </div>
        </div>
      </div>

      {/* Surrounding background articles: BOTTOM BLOCK (blurred for depth of field) */}
      <div
        className="relative z-1 px-6 pt-1 pb-3 overflow-hidden transition-all duration-300"
        style={{
          filter: blurDepth > 0 ? `blur(${blurDepth}px)` : 'none',
          opacity: blurDepth > 0 ? 0.72 : 0.95,
        }}
      >
        <div className="columns-2 gap-4 text-justify font-serif text-[11px] leading-[1.35] text-black/75">
          <p>{backgroundArticles[2] || 'Over four hundred people filed complaints. One received a reply: "We are looking into it." Nobody noticed until now.'}</p>
          <p>{backgroundArticles[3] || 'The leaked ledger confirmed recurring transactions under disguised ledger entries. When questioned yesterday, representatives offered no clarification.'}</p>
        </div>
      </div>

      {/* Bottom newspaper footer / ticker */}
      <div className="relative z-10 px-6 py-3 border-t border-black/20 text-[10px] font-mono flex items-center justify-between text-black/60">
        <span>ARCHIVE REF #9042-K</span>
        <span className="tracking-widest">★ SPECIAL EDITION ★</span>
        <span>PAGE 01</span>
      </div>
    </div>
  );
};

// Sub-component to render individual words with chosen style
interface WordRendererProps {
  word: string;
  isActive: boolean;
  isPassed: boolean;
  progress: number;
  color: string;
  style: HighlightStyle;
  mode: 'active-word' | 'cumulative';
  themeColors: { bg: string; bgDark: string; ink: string; fadedInk: string; border: string; accent: string };
}

const WordRenderer: React.FC<WordRendererProps> = ({
  word,
  isActive,
  isPassed,
  progress,
  color,
  style,
  mode,
  themeColors,
}) => {
  // Determine if this specific word should show the highlight
  const isHighlighted = mode === 'cumulative' ? (isActive || isPassed) : isActive;
  const sweepWidth = mode === 'cumulative' && isPassed ? 100 : isActive ? Math.round(progress * 100) : 0;

  // Fluorescent Marker Highlighter (Matches "Kaizen" in screenshot!)
  if (style === 'marker') {

    return (
      <span className="relative inline-block px-1 py-0.5">
        {/* Animated highlighter stroke behind the text */}
        {isHighlighted && (
          <span
            className="absolute inset-0 -inset-x-1.5 -inset-y-0.5 pointer-events-none rounded-[2px] transition-all duration-75"
            style={{
              backgroundColor: color,
              opacity: 0.88,
              transform: 'rotate(-0.8deg) skewX(-2deg)',
              clipPath: `inset(0 ${100 - sweepWidth}% 0 0)`,
              mixBlendMode: 'multiply',
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          />
        )}
        <span
          className="relative z-10 transition-colors duration-150"
          style={{
            color: isHighlighted ? '#000000' : themeColors.ink,
            fontWeight: isHighlighted ? 900 : 800,
          }}
        >
          {word}
        </span>
      </span>
    );
  }

  // Cutout / Ransom Paper Tile
  if (style === 'cutout') {
    const isTile = isActive || isPassed;
    return (
      <span
        className={`relative inline-block px-2 py-0.5 transition-all duration-150 ${
          isTile
            ? 'bg-white text-black shadow-md border border-black/40 rotate-[-1.5deg] scale-105'
            : 'text-black/80'
        }`}
        style={{
          fontFamily: isTile ? '"Special Elite", monospace' : 'inherit',
          transform: isTile ? 'rotate(-1deg) translateY(-1px)' : 'none',
        }}
      >
        {word}
      </span>
    );
  }

  // Red Editorial Pen Circle & Strike
  if (style === 'red-pen') {
    const isMarked = isActive || isPassed;
    return (
      <span className="relative inline-block px-1">
        <span
          className="relative z-10"
          style={{ color: isMarked ? '#b91c1c' : themeColors.ink }}
        >
          {word}
        </span>
        {isMarked && (
          <svg
            className="absolute -inset-x-2 -bottom-1.5 w-[calc(100%+16px)] h-4 pointer-events-none text-red-600 overflow-visible"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path
              d="M 2,12 Q 50,18 98,11 Q 50,14 5,16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="120"
              strokeDashoffset={isPassed ? 0 : 120 - progress * 120}
              className="transition-all duration-75"
            />
          </svg>
        )}
      </span>
    );
  }

  // Classic Underline
  if (style === 'underline') {
    const isUnderlined = isActive || isPassed;
    return (
      <span className="relative inline-block px-0.5">
        <span style={{ color: themeColors.ink }}>{word}</span>
        {isUnderlined && (
          <span
            className="absolute bottom-0 left-0 h-[2.5px] rounded-full transition-all duration-75"
            style={{
              backgroundColor: color,
              width: isPassed ? '100%' : `${progress * 100}%`,
            }}
          />
        )}
      </span>
    );
  }

  // Inverted Blackbox Highlight
  return (
    <span
      className={`relative inline-block px-1.5 py-0.5 rounded-xs transition-colors duration-150 ${
        isActive || isPassed ? 'bg-black text-white' : 'text-black'
      }`}
    >
      {word}
    </span>
  );
};

// Helper hook
function useActiveWord(timings: WordTiming[], currentTime: number) {
  return useMemo(() => getActiveWordIndex(timings, currentTime), [timings, currentTime]);
}
