import React, { useMemo } from 'react';
import { AspectRatio, NewspaperScene, PaperTheme } from '../types';
import { getActiveScene, getSceneProgress, splitTextWithHighlight } from '../utils/montageSync';

interface NewspaperMontageCanvasProps {
  scenes: NewspaperScene[];
  currentTime: number;
  aspectRatio: AspectRatio;
  theme: PaperTheme;
  blurDepth: number;
  highlightColor: string;
  cameraShake: boolean;
}

export const NewspaperMontageCanvas: React.FC<NewspaperMontageCanvasProps> = ({
  scenes,
  currentTime,
  aspectRatio,
  theme,
  blurDepth,
  highlightColor,
  cameraShake,
}) => {
  const activeScene = useMemo(() => getActiveScene(scenes, currentTime), [scenes, currentTime]);
  const progress = useMemo(
    () => (activeScene ? getSceneProgress(activeScene, currentTime) : 0),
    [activeScene, currentTime]
  );

  // Theme palettes
  const themeColors = useMemo(() => {
    switch (theme) {
      case 'vintage-aged':
        return {
          bg: '#f4ede1',
          bgDark: '#e7decb',
          ink: '#1c1a17',
          fadedInk: '#6b665f',
          ruleColor: '#302c27',
          deskColor: '#7a2218',
        };
      case 'tabloid-cream':
        return {
          bg: '#faf7ef',
          bgDark: '#eee8d8',
          ink: '#11100f',
          fadedInk: '#5e5a55',
          ruleColor: '#1c1b1a',
          deskColor: '#b91c1c',
        };
      case 'sepia-archive':
        return {
          bg: '#e8dcbe',
          bgDark: '#d9caa8',
          ink: '#262017',
          fadedInk: '#706450',
          ruleColor: '#382f22',
          deskColor: '#8b3a1a',
        };
      case 'darkroom-noir':
        return {
          bg: '#1c1b1a',
          bgDark: '#141413',
          ink: '#eae7df',
          fadedInk: '#9e998f',
          ruleColor: '#454340',
          deskColor: '#f59e0b',
        };
      case 'modern-press':
      default:
        return {
          bg: '#f8f8f6',
          bgDark: '#ecece8',
          ink: '#141414',
          fadedInk: '#5a5a58',
          ruleColor: '#222222',
          deskColor: '#0284c7',
        };
    }
  }, [theme]);

  // Aspect ratio class
  const aspectClass = useMemo(() => {
    switch (aspectRatio) {
      case '1:1':
        return 'w-full max-w-[440px] aspect-square';
      case '9:16':
        return 'w-full max-w-[400px] aspect-[9/16]';
      case '16:9':
        return 'w-full max-w-[680px] aspect-[16/9]';
    }
  }, [aspectRatio]);

  if (!activeScene) {
    return (
      <div className={`mx-auto bg-[#e7decb] flex items-center justify-center ${aspectClass}`}>
        <p className="font-serif text-sm text-black/50">No active newspaper scene</p>
      </div>
    );
  }

  const rotation = activeScene.rotation || 0;
  const zoom = activeScene.zoom || 1.0;
  const activeColor = activeScene.highlightColor || highlightColor;

  return (
    <div
      className={`relative select-none overflow-hidden mx-auto shadow-2xl transition-all duration-150 rounded-sm flex flex-col justify-between ${aspectClass}`}
      style={{
        backgroundColor: themeColors.bg,
        color: themeColors.ink,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1)',
        transform: `rotate(${rotation}deg) scale(${cameraShake && progress < 0.15 ? 1.01 : 1})`,
      }}
      data-testid="newspaper-montage-canvas"
    >
      {/* Paper texture overlay with organic SVG fiber noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.24] mix-blend-multiply z-30"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 65%, rgba(0,0,0,0.16) 100%), url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.45'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle center fold line */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[1px] bg-black/5 z-20" />

      {/* RENDER THE ACTIVE SCENE LAYOUT */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-5 sm:p-6" style={{ transform: `scale(${zoom})` }}>
        {activeScene.type === 'quote' && (
          <QuoteSceneView
            scene={activeScene}
            themeColors={themeColors}
            highlightColor={activeColor}
            blurDepth={blurDepth}
            progress={progress}
          />
        )}

        {activeScene.type === 'masthead' && (
          <MastheadSceneView
            scene={activeScene}
            themeColors={themeColors}
            highlightColor={activeColor}
            blurDepth={blurDepth}
            progress={progress}
          />
        )}

        {activeScene.type === 'macro-column' && (
          <MacroColumnSceneView
            scene={activeScene}
            themeColors={themeColors}
            highlightColor={activeColor}
            progress={progress}
          />
        )}

        {activeScene.type === 'desk-report' && (
          <DeskReportSceneView
            scene={activeScene}
            themeColors={themeColors}
            highlightColor={activeColor}
            blurDepth={blurDepth}
            progress={progress}
          />
        )}

        {activeScene.type === 'archive-memo' && (
          <ArchiveMemoSceneView
            scene={activeScene}
            themeColors={themeColors}
            highlightColor={activeColor}
            progress={progress}
          />
        )}
      </div>
    </div>
  );
};

// 1. QUOTE SCENE (As in Frame 00:00 of reference video: "He described the transaction as routine. It was not Heaven routine")
interface SceneViewProps {
  scene: NewspaperScene;
  themeColors: { bg: string; bgDark: string; ink: string; fadedInk: string; ruleColor: string; deskColor: string };
  highlightColor: string;
  blurDepth?: number;
  progress: number;
}

const QuoteSceneView: React.FC<SceneViewProps> = ({ scene, themeColors, highlightColor, blurDepth = 2, progress }) => {
  const headlineChunks = splitTextWithHighlight(scene.headline, scene.highlightWord);

  return (
    <div className="flex-1 flex flex-col justify-between my-auto">
      {/* Background faded newsprint text at top */}
      <div
        className="text-[10px] sm:text-[11px] font-serif leading-[1.3] text-black/60 transition-all select-none mb-4"
        style={{ filter: `blur(${blurDepth}px)` }}
      >
        <p>{scene.bodyColumns?.[0] || 'The dog was fine. Nobody had asked about the dog. City council voted 4-3 to table the issue.'}</p>
      </div>

      {/* Main Quote Box */}
      <div className="my-auto py-2">
        <div
          className="font-serif font-black tracking-tight text-xl sm:text-2xl leading-[1.35]"
          style={{ fontFamily: '"Newsreader", "Playfair Display", Georgia, serif' }}
        >
          {headlineChunks.map((chunk, i) =>
            chunk.isHighlighted ? (
              <HighlightedWordSpan
                key={i}
                word={chunk.text}
                color={highlightColor}
                progress={progress}
              />
            ) : (
              <span key={i} style={{ color: themeColors.ink }}>
                {chunk.text}
              </span>
            )
          )}
        </div>
      </div>

      {/* Background faded newsprint text at bottom */}
      <div
        className="text-[10px] sm:text-[11px] font-serif leading-[1.3] text-black/60 transition-all select-none mt-4"
        style={{ filter: `blur(${blurDepth}px)` }}
      >
        <p>{scene.bodyColumns?.[1] || 'Sources confirmed the audit was expedited following complaints filed by local residents. Nobody was detained.'}</p>
      </div>
    </div>
  );
};

// 2. MASTHEAD SCENE (As in Frame 00:01: THE UNNECESSARY TIMES - Police confirm Heaven. Decline to elaborate.)
const MastheadSceneView: React.FC<SceneViewProps> = ({ scene, themeColors, highlightColor, blurDepth = 2, progress }) => {
  const headlineChunks = splitTextWithHighlight(scene.headline, scene.highlightWord);

  return (
    <div className="flex-1 flex flex-col justify-between my-auto">
      {/* Faded column snippet above masthead */}
      <div
        className="text-[10px] font-serif leading-[1.3] text-black/55 mb-2 line-clamp-2"
        style={{ filter: `blur(${blurDepth}px)` }}
      >
        <p>{scene.bodyColumns?.[0] || 'A pigeon was briefly detained. Twelve people filed complaints.'}</p>
      </div>

      {/* The Masthead Nameplate Header */}
      <div className="my-2">
        <div className="h-[1px] bg-black/40 w-full mb-1" />
        <div className="text-center font-mono uppercase tracking-[0.25em] text-[10px] sm:text-[11px] font-bold text-black/80 py-0.5">
          {scene.kicker || 'THE UNNECESSARY TIMES'}
        </div>
        <div className="h-[1.5px] bg-black/80 w-full mt-1 mb-3" />

        {/* Big Bold Headline */}
        <h2
          className="font-serif font-black tracking-tight text-xl sm:text-2xl leading-[1.25] text-left"
          style={{ fontFamily: '"Newsreader", "Playfair Display", Georgia, serif' }}
        >
          {headlineChunks.map((chunk, i) =>
            chunk.isHighlighted ? (
              <HighlightedWordSpan
                key={i}
                word={chunk.text}
                color={highlightColor}
                progress={progress}
              />
            ) : (
              <span key={i} style={{ color: themeColors.ink }}>
                {chunk.text}
              </span>
            )
          )}
        </h2>

        {/* Subhead */}
        {scene.subhead && (
          <p className="font-serif italic text-xs text-black/70 mt-2 leading-[1.3]">
            {scene.subhead}
          </p>
        )}
      </div>

      {/* Faded column snippet below */}
      <div
        className="text-[10px] font-serif leading-[1.3] text-black/55 mt-2 line-clamp-2"
        style={{ filter: `blur(${blurDepth}px)` }}
      >
        <p>{scene.bodyColumns?.[1] || 'The statue has been removed to spend more time with investments.'}</p>
      </div>
    </div>
  );
};

// 3. MACRO COLUMN SCENE (As in Frame 00:02 & 00:04: Close-up Macro Newsprint Body Text with embedded highlighted word)
const MacroColumnSceneView: React.FC<SceneViewProps> = ({ scene, themeColors, highlightColor, progress }) => {
  // Combine headline & body into a rich macro column block
  const fullBodyText = `${scene.headline} ${scene.bodyColumns?.[0] || ''} ${scene.bodyColumns?.[1] || ''}`.trim();
  const chunks = splitTextWithHighlight(fullBodyText, scene.highlightWord);

  return (
    <div className="flex-1 flex flex-col justify-center my-auto overflow-hidden">
      {/* Category banner */}
      {scene.kicker && (
        <div className="mb-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-black/60 font-semibold border-b border-black/20 pb-0.5">
            {scene.kicker}
          </span>
        </div>
      )}

      {/* Large Macro Newsprint Body Typography */}
      <div
        className="font-serif text-lg sm:text-xl font-bold leading-[1.4] text-justify tracking-normal"
        style={{ fontFamily: '"Newsreader", Georgia, serif' }}
      >
        {chunks.map((chunk, i) =>
          chunk.isHighlighted ? (
            <HighlightedWordSpan
              key={i}
              word={chunk.text}
              color={highlightColor}
              progress={progress}
            />
          ) : (
            <span key={i} style={{ color: themeColors.ink }}>
              {chunk.text}
            </span>
          )
        )}
      </div>
    </div>
  );
};

// 4. DESK REPORT SCENE (As in Frame 00:03: THE REGIONAL MURMUR - Mayor denies inv... Heaven - Crime & Nonsense Desk)
const DeskReportSceneView: React.FC<SceneViewProps> = ({ scene, themeColors, highlightColor, blurDepth = 2, progress }) => {
  const headlineChunks = splitTextWithHighlight(scene.headline, scene.highlightWord);

  return (
    <div className="flex-1 flex flex-col justify-between my-auto">
      {/* Header Nameplate */}
      <div>
        <div className="text-center font-mono uppercase tracking-[0.22em] text-[10px] font-bold text-black/70 mb-2">
          {scene.kicker || 'THE REGIONAL MURMUR'}
        </div>

        {/* Headline */}
        <h2
          className="font-serif font-black tracking-tight text-xl sm:text-2xl leading-[1.25]"
          style={{ fontFamily: '"Newsreader", "Playfair Display", Georgia, serif' }}
        >
          {headlineChunks.map((chunk, i) =>
            chunk.isHighlighted ? (
              <HighlightedWordSpan
                key={i}
                word={chunk.text}
                color={highlightColor}
                progress={progress}
              />
            ) : (
              <span key={i} style={{ color: themeColors.ink }}>
                {chunk.text}
              </span>
            )
          )}
        </h2>

        {/* Subhead */}
        {scene.subhead && (
          <p className="font-serif text-xs text-black/75 mt-2 leading-[1.35]">
            {scene.subhead}
          </p>
        )}

        {/* Desk Tag (e.g. Crime & Nonsense Desk) */}
        {scene.desk && (
          <div className="mt-2 text-[9px] font-mono italic text-black/60 border-t border-black/15 pt-1">
            {scene.desk}
          </div>
        )}
      </div>

      {/* Surrounding body snippet */}
      <div
        className="text-[10px] font-serif leading-[1.3] text-black/60 mt-3 transition-all"
        style={{ filter: `blur(${blurDepth}px)` }}
      >
        <p>{scene.bodyColumns?.[0] || 'The suspect was later found at a nearby buffet. It solves nothing.'}</p>
      </div>
    </div>
  );
};

// 5. ARCHIVE MEMO SCENE (Typewritten audit excerpt)
const ArchiveMemoSceneView: React.FC<SceneViewProps> = ({ scene, highlightColor, progress }) => {
  const chunks = splitTextWithHighlight(scene.headline, scene.highlightWord);

  return (
    <div className="flex-1 flex flex-col justify-center my-auto p-4 border border-black/20 bg-black/[0.02]">
      <div className="text-[10px] font-mono tracking-widest uppercase text-red-800 font-bold mb-2">
        ★ {scene.kicker || 'CONFIDENTIAL INQUEST'} ★
      </div>
      <div
        className="font-mono text-base sm:text-lg font-bold leading-[1.4] text-black/90"
        style={{ fontFamily: '"Special Elite", "Courier New", monospace' }}
      >
        {chunks.map((chunk, i) =>
          chunk.isHighlighted ? (
            <HighlightedWordSpan
              key={i}
              word={chunk.text}
              color={highlightColor}
              progress={progress}
            />
          ) : (
            <span key={i}>{chunk.text}</span>
          )
        )}
      </div>
      {scene.subhead && (
        <div className="text-[11px] font-mono text-black/60 mt-3 pt-2 border-t border-black/10">
          {scene.subhead}
        </div>
      )}
    </div>
  );
};

// The Authentic Fluorescent Felt-Tip Highlighter Component (Matches "Heaven" in the video frames!)
interface HighlightedWordSpanProps {
  word: string;
  color: string;
  progress: number;
}

const HighlightedWordSpan: React.FC<HighlightedWordSpanProps> = ({ word, color, progress }) => {
  // Always fully highlighted marker stroke like in reference video, with micro pulse on cut
  return (
    <span className="relative inline-block mx-0.5 px-1 py-0.5">
      {/* The organic fluorescent marker stroke */}
      <span
        className="absolute inset-0 -inset-x-1 -inset-y-0.5 pointer-events-none rounded-[1.5px] transition-all duration-75"
        style={{
          backgroundColor: color,
          opacity: 0.92,
          transform: 'rotate(-0.8deg) skewX(-2.5deg)',
          mixBlendMode: 'multiply',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        }}
      />
      <span className="relative z-10 text-black font-black">
        {word}
      </span>
    </span>
  );
};
