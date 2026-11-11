import React, { useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Clock, Scissors, Layout, Sparkles } from 'lucide-react';
import { NewspaperScene, SceneType } from '../types';
import { formatTime } from '../utils/montageSync';

interface MontageTimelineProps {
  scenes: NewspaperScene[];
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onUpdateScenes: (scenes: NewspaperScene[]) => void;
  activeSceneIndex: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const MontageTimeline: React.FC<MontageTimelineProps> = ({
  scenes,
  duration,
  currentTime,
  isPlaying,
  onPlayPause,
  onSeek,
  onUpdateScenes,
  activeSceneIndex,
  speed,
  onSpeedChange,
}) => {
  const scrubberRef = useRef<HTMLDivElement>(null);

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct * duration);
  };

  const handleNudgeCut = (sceneIdx: number, delta: number) => {
    if (sceneIdx <= 0 || sceneIdx >= scenes.length) return;
    const updated = [...scenes];
    const newCut = Number(Math.max(updated[sceneIdx - 1].startTime + 0.2, Math.min(updated[sceneIdx].endTime - 0.2, updated[sceneIdx].startTime + delta)).toFixed(2));
    updated[sceneIdx - 1] = { ...updated[sceneIdx - 1], endTime: newCut };
    updated[sceneIdx] = { ...updated[sceneIdx], startTime: newCut };
    onUpdateScenes(updated);
  };

  const handleUpdateSceneField = (index: number, field: keyof NewspaperScene, value: unknown) => {
    const updated = [...scenes];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateScenes(updated);
  };

  const handleAddScene = () => {
    const last = scenes[scenes.length - 1];
    const newStart = last ? last.endTime : 0;
    const newEnd = Number((newStart + 1.2).toFixed(2));
    const newScene: NewspaperScene = {
      id: `scene-${Date.now()}`,
      type: 'masthead',
      startTime: newStart,
      endTime: newEnd,
      kicker: 'BREAKING DISPATCH',
      headline: 'Official confirm Heaven. Investigation continues.',
      highlightWord: last ? last.highlightWord : 'Heaven',
      highlightColor: '#FFE817',
    };
    onUpdateScenes([...scenes, newScene]);
  };

  const handleDeleteScene = (index: number) => {
    if (scenes.length <= 1) return;
    const updated = scenes.filter((_, i) => i !== index);
    // Re-stitch boundaries
    for (let i = 1; i < updated.length; i++) {
      updated[i].startTime = updated[i - 1].endTime;
    }
    onUpdateScenes(updated);
  };

  return (
    <div className="bg-[#1a1b1f] border border-white/10 rounded-xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Top Playback & Cut Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={onPlayPause}
            className="w-10 h-10 rounded-lg bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center font-bold shadow-md active:scale-95 transition-all cursor-pointer"
            aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          {/* Rewind */}
          <button
            onClick={() => onSeek(0)}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Rewind to start"
            aria-label="Rewind to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Timecode */}
          <div className="px-3 py-1.5 rounded-md bg-black/50 border border-white/10 font-mono text-xs sm:text-sm text-amber-300">
            <span>{formatTime(currentTime)}</span>
            <span className="text-white/40 mx-1.5">/</span>
            <span className="text-white/60">{formatTime(duration)}</span>
          </div>

          {/* Speed */}
          <div className="flex items-center rounded-md bg-white/5 border border-white/10 p-0.5 text-xs font-mono">
            {[0.5, 0.75, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  speed === s ? 'bg-white/20 text-white font-bold' : 'text-white/60 hover:text-white'
                }`}
                aria-label={`Speed ${s}x`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Add Scene Button */}
        <button
          onClick={handleAddScene}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          aria-label="Add new scene cut"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          <span>Add Scene Cut</span>
        </button>
      </div>

      {/* Multi-Scene Horizontal Timeline Track */}
      <div>
        <div className="flex justify-between items-center text-[11px] font-mono text-white/60 mb-1.5 px-0.5">
          <span className="flex items-center gap-1.5 font-sans font-semibold text-white/80">
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            Newspaper Scene Cuts ({scenes.length} cuts)
          </span>
          <span>Click track to seek</span>
        </div>

        {/* Visual Track */}
        <div
          ref={scrubberRef}
          onClick={handleScrubberClick}
          className="relative h-14 bg-black/70 rounded-lg border border-white/15 cursor-pointer overflow-hidden flex p-1"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          aria-label="Montage timeline track"
          tabIndex={0}
        >
          {scenes.map((scene, idx) => {
            const leftPct = (scene.startTime / duration) * 100;
            const widthPct = Math.max(4, ((scene.endTime - scene.startTime) / duration) * 100);
            const isActive = idx === activeSceneIndex;

            return (
              <div
                key={scene.id || idx}
                className={`absolute top-1.5 bottom-1.5 rounded border px-2 flex flex-col justify-center transition-all ${
                  isActive
                    ? 'bg-amber-400/25 border-amber-400 text-white shadow-md ring-1 ring-amber-400/50 z-10'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
                style={{
                  left: `${leftPct}%`,
                  width: `${widthPct}%`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(scene.startTime);
                }}
                title={`Scene #${idx + 1} (${scene.startTime}s - ${scene.endTime}s): ${scene.headline}`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono leading-tight">
                  <span className="font-bold text-amber-300">#{idx + 1}</span>
                  <span className="uppercase text-[8px] px-1 rounded bg-black/40 text-white/70">{scene.type}</span>
                </div>
                <div className="text-[10px] truncate font-serif font-semibold text-white">
                  "{scene.highlightWord}"
                </div>
              </div>
            );
          })}

          {/* Active playhead line */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-amber-400 shadow-[0_0_10px_#fbbf24] z-20 pointer-events-none transition-all duration-75"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-amber-300 rounded-full shadow" />
          </div>
        </div>
      </div>

      {/* Detailed Scene Cuts List & Customizer */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-white/50 uppercase">
          Scene Cuts & Layout Settings
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {scenes.map((scene, idx) => {
            const isActive = idx === activeSceneIndex;

            return (
              <div
                key={scene.id || idx}
                className={`p-3 rounded-lg border text-xs transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-400/60 text-white'
                    : 'bg-white/[0.03] border-white/5 text-white/80 hover:bg-white/[0.06]'
                }`}
              >
                {/* Scene Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      Scene #{idx + 1}
                    </span>
                    <button
                      onClick={() => onSeek(scene.startTime)}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono text-white/80 cursor-pointer"
                      title="Jump to this scene"
                      aria-label={`Jump to scene ${idx + 1}`}
                    >
                      {scene.startTime.toFixed(2)}s → {scene.endTime.toFixed(2)}s
                    </button>
                    {idx > 0 && (
                      <div className="flex items-center gap-0.5 font-mono text-[10px]">
                        <button
                          onClick={() => handleNudgeCut(idx, -0.05)}
                          className="px-1 hover:text-amber-300 cursor-pointer"
                          title="Nudge cut earlier (-0.05s)"
                          aria-label={`Nudge scene ${idx + 1} cut earlier`}
                        >
                          -
                        </button>
                        <span className="text-white/40">Cut</span>
                        <button
                          onClick={() => handleNudgeCut(idx, 0.05)}
                          className="px-1 hover:text-amber-300 cursor-pointer"
                          title="Nudge cut later (+0.05s)"
                          aria-label={`Nudge scene ${idx + 1} cut later`}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Scene Type Selector */}
                    <select
                      value={scene.type}
                      onChange={(e) => handleUpdateSceneField(idx, 'type', e.target.value as SceneType)}
                      className="bg-black/60 border border-white/20 rounded px-2 py-0.5 text-[11px] text-amber-300 font-mono cursor-pointer focus:outline-none"
                      aria-label={`Scene ${idx + 1} layout type`}
                    >
                      <option value="quote">Quote Box</option>
                      <option value="masthead">Frontpage Masthead</option>
                      <option value="macro-column">Macro Column Zoom</option>
                      <option value="desk-report">Desk Report</option>
                      <option value="archive-memo">Confidential Memo</option>
                    </select>

                    {/* Delete button */}
                    {scenes.length > 1 && (
                      <button
                        onClick={() => handleDeleteScene(idx)}
                        className="p-1 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded transition-colors cursor-pointer"
                        title="Delete scene"
                        aria-label={`Delete scene ${idx + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Text & Keyword inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-8">
                    <label className="block text-[10px] text-white/40 mb-0.5">Headline / Article Text:</label>
                    <input
                      type="text"
                      value={scene.headline}
                      onChange={(e) => handleUpdateSceneField(idx, 'headline', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white font-serif focus:border-amber-400 focus:outline-none"
                      aria-label={`Scene ${idx + 1} headline text`}
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[10px] text-white/40 mb-0.5">Highlight Target Word:</label>
                    <input
                      type="text"
                      value={scene.highlightWord}
                      onChange={(e) => handleUpdateSceneField(idx, 'highlightWord', e.target.value)}
                      className="w-full bg-black/40 border border-amber-400/40 rounded px-2 py-1 text-xs text-amber-300 font-bold focus:border-amber-400 focus:outline-none"
                      placeholder="e.g. Heaven"
                      aria-label={`Scene ${idx + 1} target word`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
