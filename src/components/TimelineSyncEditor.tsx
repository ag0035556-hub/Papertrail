import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Plus, Trash2, Clock, ChevronRight } from 'lucide-react';
import { WordTiming } from '../types';
import { formatTime } from '../utils/newspaperSync';

interface TimelineSyncEditorProps {
  timings: WordTiming[];
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onUpdateTimings: (newTimings: WordTiming[]) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  activeWordIndex: number;
}

export const TimelineSyncEditor: React.FC<TimelineSyncEditorProps> = ({
  timings,
  duration,
  currentTime,
  isPlaying,
  onPlayPause,
  onSeek,
  onUpdateTimings,
  speed,
  onSpeedChange,
  activeWordIndex,
}) => {
  const [tapSyncMode, setTapSyncMode] = useState(false);
  const [tapSyncIndex, setTapSyncIndex] = useState(0);
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Handle Spacebar shortcut for Play/Pause and Tap-to-sync
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (tapSyncMode && isPlaying) {
          handleTapNextWord();
        } else {
          onPlayPause();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tapSyncMode, isPlaying, tapSyncIndex, currentTime, timings]);

  // Tap-to-sync: Stamp current time to active word
  const handleTapNextWord = () => {
    if (tapSyncIndex >= timings.length) {
      setTapSyncMode(false);
      return;
    }

    const updated = [...timings];
    const prevIndex = tapSyncIndex - 1;

    // Set end of previous word if still open
    if (prevIndex >= 0 && updated[prevIndex].end <= updated[prevIndex].start) {
      updated[prevIndex] = {
        ...updated[prevIndex],
        end: Number(Math.max(updated[prevIndex].start + 0.15, currentTime).toFixed(2)),
      };
    }

    // Set start of current word
    updated[tapSyncIndex] = {
      ...updated[tapSyncIndex],
      start: Number(currentTime.toFixed(2)),
      end: Number(Math.min(duration, currentTime + 0.5).toFixed(2)),
    };

    onUpdateTimings(updated);
    setTapSyncIndex((prev) => prev + 1);
  };

  const startTapSync = () => {
    setTapSyncIndex(0);
    setTapSyncMode(true);
    onSeek(0);
    if (!isPlaying) onPlayPause();
  };

  const stopTapSync = () => {
    setTapSyncMode(false);
  };

  // Adjust timing manually
  const adjustTime = (index: number, field: 'start' | 'end', delta: number) => {
    const updated = [...timings];
    const currentVal = updated[index][field];
    const newVal = Number(Math.max(0, Math.min(duration, currentVal + delta)).toFixed(2));
    updated[index] = { ...updated[index], [field]: newVal };

    // Ensure start <= end
    if (field === 'start' && newVal > updated[index].end) {
      updated[index].end = Number(Math.min(duration, newVal + 0.2).toFixed(2));
    }
    if (field === 'end' && newVal < updated[index].start) {
      updated[index].start = Number(Math.max(0, newVal - 0.2).toFixed(2));
    }

    onUpdateTimings(updated);
  };

  // Edit word text
  const handleWordTextChange = (index: number, newText: string) => {
    const updated = [...timings];
    updated[index] = { ...updated[index], word: newText };
    onUpdateTimings(updated);
  };

  // Add new word
  const handleAddWord = () => {
    const lastWord = timings[timings.length - 1];
    const newStart = lastWord ? Number(Math.min(duration - 0.3, lastWord.end + 0.1).toFixed(2)) : 0.5;
    const newEnd = Number(Math.min(duration, newStart + 0.4).toFixed(2));

    const newWord: WordTiming = {
      id: `w-${Date.now()}`,
      word: 'NewWord',
      start: newStart,
      end: newEnd,
    };
    onUpdateTimings([...timings, newWord]);
  };

  // Delete word
  const handleDeleteWord = (index: number) => {
    const updated = timings.filter((_, i) => i !== index);
    onUpdateTimings(updated);
  };

  // Timeline scrubber click
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(percentage * duration);
  };

  return (
    <div className="bg-[#1b1c20] border border-white/10 rounded-xl p-4 sm:p-5 shadow-xl">
      {/* Top Header: Controls & Sync Tools */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          {/* Play / Pause button */}
          <button
            onClick={onPlayPause}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            aria-label={isPlaying ? 'Pause audio playback' : 'Play audio playback'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          {/* Rewind */}
          <button
            onClick={() => onSeek(0)}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            title="Rewind to start"
            aria-label="Rewind to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Time Display */}
          <div className="px-3 py-1.5 rounded-md bg-black/40 border border-white/10 font-mono text-xs sm:text-sm text-amber-300">
            <span>{formatTime(currentTime)}</span>
            <span className="text-white/40 mx-1">/</span>
            <span className="text-white/60">{formatTime(duration)}</span>
          </div>

          {/* Speed Toggle */}
          <div className="flex items-center rounded-md bg-white/5 border border-white/10 p-0.5 text-xs font-mono">
            {[0.5, 0.75, 1.0, 1.25].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  speed === s ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
                aria-label={`Playback speed ${s}x`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Tap to Sync Mode Toggle */}
        <div className="flex items-center gap-2">
          {!tapSyncMode ? (
            <button
              onClick={startTapSync}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-medium transition-all cursor-pointer"
              aria-label="Start Tap to Sync mode"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tap to Sync Timings</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleTapNextWord}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold shadow-lg animate-pulse cursor-pointer"
                aria-label="Tap Next Word timestamp"
              >
                <ChevronRight className="w-4 h-4" />
                <span>TAP NEXT: "{timings[tapSyncIndex]?.word || 'Done'}"</span>
              </button>
              <button
                onClick={stopTapSync}
                className="px-2.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs cursor-pointer"
                aria-label="Exit Tap to Sync mode"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Visual Scrubber Track */}
      <div className="mb-4">
        <div
          ref={timelineRef}
          onClick={handleTimelineClick}
          className="relative h-12 bg-black/60 rounded-lg border border-white/10 cursor-pointer overflow-hidden p-1 flex items-center group"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          aria-label="Timeline audio position"
          tabIndex={0}
        >
          {/* Simulated audio waveform background */}
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-25 pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => {
              const h = Math.sin(i * 0.4) * 16 + Math.cos(i * 0.9) * 8 + 14;
              return (
                <div
                  key={i}
                  className="w-[2px] bg-amber-200 rounded-full"
                  style={{ height: `${Math.max(4, h)}px` }}
                />
              );
            })}
          </div>

          {/* Word segments mapped horizontally on timeline */}
          {timings.map((w, idx) => {
            const leftPct = (w.start / duration) * 100;
            const widthPct = Math.max(1.5, ((w.end - w.start) / duration) * 100);
            const isActive = idx === activeWordIndex;

            return (
              <div
                key={w.id || idx}
                className={`absolute top-1.5 bottom-1.5 rounded px-1.5 flex items-center text-[10px] font-mono truncate transition-all ${
                  isActive
                    ? 'bg-amber-400 text-black font-bold z-10 shadow-md ring-2 ring-white/50'
                    : 'bg-white/15 text-white/80 hover:bg-white/25'
                }`}
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                }}
                title={`${w.word} (${w.start.toFixed(2)}s - ${w.end.toFixed(2)}s)`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(w.start);
                }}
              >
                <span className="truncate">{w.word}</span>
              </div>
            );
          })}

          {/* Active scrubber playhead line */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-amber-400 shadow-[0_0_8px_#fbbf24] z-20 pointer-events-none transition-all duration-75"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-amber-300 rounded-full shadow" />
          </div>
        </div>
      </div>

      {/* Word-by-Word Timings List & Fine-tuner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/60 mb-1 px-1">
          <span className="font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Word Timestamps ({timings.length} words)
          </span>
          <button
            onClick={handleAddWord}
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            aria-label="Add new word to timeline"
          >
            <Plus className="w-3 h-3" />
            <span>Add Word</span>
          </button>
        </div>

        <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {timings.map((wordItem, idx) => {
            const isActive = idx === activeWordIndex;
            return (
              <div
                key={wordItem.id || idx}
                className={`flex items-center justify-between gap-2 p-2 rounded-lg text-xs transition-colors border ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/50 text-white'
                    : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/[0.08]'
                }`}
              >
                {/* Word Index and clickable name */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="w-5 text-[10px] font-mono text-white/40 text-right">
                    #{idx + 1}
                  </span>
                  {editingWordId === wordItem.id ? (
                    <input
                      type="text"
                      value={wordItem.word}
                      onChange={(e) => handleWordTextChange(idx, e.target.value)}
                      onBlur={() => setEditingWordId(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingWordId(null)}
                      autoFocus
                      className="bg-black/60 border border-amber-400/60 rounded px-2 py-0.5 text-amber-300 font-bold text-xs outline-none w-32"
                      aria-label={`Edit text for word ${idx + 1}`}
                    />
                  ) : (
                    <button
                      onClick={() => setEditingWordId(wordItem.id)}
                      className="font-serif text-sm font-semibold hover:text-amber-300 transition-colors truncate text-left cursor-pointer"
                      title="Click to edit word text"
                      aria-label={`Edit text "${wordItem.word}"`}
                    >
                      {wordItem.word}
                    </button>
                  )}
                </div>

                {/* Timing controls: Start & End */}
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  {/* Start time */}
                  <div className="flex items-center gap-0.5 bg-black/40 rounded px-1.5 py-0.5 border border-white/10">
                    <span className="text-white/40 mr-1 text-[10px]">IN:</span>
                    <button
                      onClick={() => adjustTime(idx, 'start', -0.05)}
                      className="px-1 hover:text-amber-300 cursor-pointer"
                      title="Nudge start earlier (-0.05s)"
                      aria-label={`Nudge ${wordItem.word} start earlier`}
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-amber-200">{wordItem.start.toFixed(2)}s</span>
                    <button
                      onClick={() => adjustTime(idx, 'start', 0.05)}
                      className="px-1 hover:text-amber-300 cursor-pointer"
                      title="Nudge start later (+0.05s)"
                      aria-label={`Nudge ${wordItem.word} start later`}
                    >
                      +
                    </button>
                  </div>

                  {/* End time */}
                  <div className="flex items-center gap-0.5 bg-black/40 rounded px-1.5 py-0.5 border border-white/10">
                    <span className="text-white/40 mr-1 text-[10px]">OUT:</span>
                    <button
                      onClick={() => adjustTime(idx, 'end', -0.05)}
                      className="px-1 hover:text-amber-300 cursor-pointer"
                      title="Nudge end earlier (-0.05s)"
                      aria-label={`Nudge ${wordItem.word} end earlier`}
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-amber-200">{wordItem.end.toFixed(2)}s</span>
                    <button
                      onClick={() => adjustTime(idx, 'end', 0.05)}
                      className="px-1 hover:text-amber-300 cursor-pointer"
                      title="Nudge end later (+0.05s)"
                      aria-label={`Nudge ${wordItem.word} end later`}
                    >
                      +
                    </button>
                  </div>

                  {/* Jump playhead to word */}
                  <button
                    onClick={() => onSeek(wordItem.start)}
                    className="p-1 rounded bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
                    title="Jump to this word"
                    aria-label={`Jump audio to ${wordItem.word}`}
                  >
                    <Play className="w-3 h-3 ml-0.5" />
                  </button>

                  {/* Delete word */}
                  <button
                    onClick={() => handleDeleteWord(idx)}
                    className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete word"
                    aria-label={`Delete ${wordItem.word}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
