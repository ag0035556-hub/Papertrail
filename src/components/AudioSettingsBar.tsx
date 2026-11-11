import React, { useRef } from 'react';
import { Volume2, VolumeX, Mic, Upload, Music, Sparkles } from 'lucide-react';
import { SoundEffectType } from '../types';

interface AudioSettingsBarProps {
  soundEffect: SoundEffectType;
  onSoundEffectChange: (sfx: SoundEffectType) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  onAudioUpload?: (file: File) => void;
  activePresetTitle: string;
  onSelectPreset: (id: string) => void;
  presets: { id: string; title: string }[];
}

export const AudioSettingsBar: React.FC<AudioSettingsBarProps> = ({
  soundEffect,
  onSoundEffectChange,
  isMuted,
  onToggleMute,
  volume,
  onVolumeChange,
  onAudioUpload,
  activePresetTitle,
  onSelectPreset,
  presets,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAudioUpload) {
      onAudioUpload(file);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#17181c] border-b border-white/10 text-xs">
      {/* Sound Effect Selector - Directly mirroring screenshot's "SOUND: Paper shuffle" */}
      <div className="flex items-center gap-2">
        <label htmlFor="sound-select" className="text-white/50 uppercase font-mono tracking-wider text-[11px] font-semibold">
          SOUND
        </label>
        <div className="relative">
          <select
            id="sound-select"
            value={soundEffect}
            onChange={(e) => onSoundEffectChange(e.target.value as SoundEffectType)}
            className="appearance-none bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 pr-8 text-white font-medium hover:border-amber-400/50 focus:border-amber-400 focus:outline-none cursor-pointer transition-colors"
            aria-label="Sound effect preset"
          >
            <option value="paper-shuffle">Paper shuffle</option>
            <option value="marker-squeak">Marker squeak</option>
            <option value="typewriter">Vintage typewriter</option>
            <option value="camera">Camera shutter</option>
            <option value="none">No sound effect</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/50">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {/* Volume & Mute Button */}
        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/10">
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isMuted ? 'text-red-400 bg-red-500/10' : 'text-white/70 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1.5 accent-amber-400 cursor-pointer bg-white/20 rounded-lg appearance-none"
            aria-label="Volume slider"
          />
        </div>
      </div>

      {/* Preset Scenario Selector & Audio Upload */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-white/50 font-mono text-[11px] uppercase">PRESET:</span>
          <select
            value={presets.find((p) => p.title === activePresetTitle)?.id || presets[0].id}
            onChange={(e) => onSelectPreset(e.target.value)}
            className="bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-amber-300 font-serif font-bold text-xs hover:border-amber-400/50 focus:border-amber-400 focus:outline-none cursor-pointer"
            aria-label="Newspaper preset story"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Custom audio upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs transition-colors cursor-pointer"
          title="Upload your own voiceover / narration audio"
          aria-label="Upload custom audio file"
        >
          <Upload className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Upload Audio</span>
        </button>
      </div>
    </div>
  );
};
