import React from 'react';
import { ChevronDown, ChevronUp, Palette, Sliders, Type, Layers, Scissors, Smartphone, Square, Monitor } from 'lucide-react';
import { AspectRatio, HighlightStyle, PaperTheme } from '../types';

interface AdvancedSettingsProps {
  isOpen: boolean;
  onToggle: () => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  theme: PaperTheme;
  onThemeChange: (theme: PaperTheme) => void;
  highlightStyle: HighlightStyle;
  onHighlightStyleChange: (style: HighlightStyle) => void;
  highlightMode: 'active-word' | 'cumulative';
  onHighlightModeChange: (mode: 'active-word' | 'cumulative') => void;
  highlightColor: string;
  onHighlightColorChange: (color: string) => void;
  blurDepth: number;
  onBlurDepthChange: (depth: number) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  showTornEdges: boolean;
  onToggleTornEdges: () => void;
  paperShake: boolean;
  onTogglePaperShake: () => void;
  kicker: string;
  onKickerChange: (kicker: string) => void;
}

const COLOR_PALETTE = [
  { name: 'Fluorescent Yellow', color: '#FFE817' },
  { name: 'Electric Cyan', color: '#00F0FF' },
  { name: 'Acid Green', color: '#76FF03' },
  { name: 'Editorial Red', color: '#FF3B30' },
  { name: 'Signal Orange', color: '#FF9100' },
  { name: 'Vintage White', color: '#FFFFFF' },
];

export const AdvancedSettingsDrawer: React.FC<AdvancedSettingsProps> = ({
  isOpen,
  onToggle,
  aspectRatio,
  onAspectRatioChange,
  theme,
  onThemeChange,
  highlightStyle,
  onHighlightStyleChange,
  highlightMode,
  onHighlightModeChange,
  highlightColor,
  onHighlightColorChange,
  blurDepth,
  onBlurDepthChange,
  fontSize,
  onFontSizeChange,
  showTornEdges,
  onToggleTornEdges,
  paperShake,
  onTogglePaperShake,
  kicker,
  onKickerChange,
}) => {
  return (
    <div className="border-b border-white/10 bg-[#16171b]">
      {/* Toggle Button matching screenshot "ADVANCED SETTINGS ▼" */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-mono font-semibold tracking-wider text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
        aria-expanded={isOpen}
        aria-label="Toggle Advanced Settings"
      >
        <span className="flex items-center gap-2 uppercase">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          ADVANCED SETTINGS
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
      </button>

      {/* Expanded drawer */}
      {isOpen && (
        <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 border-t border-white/5 text-xs bg-black/20">
          {/* Aspect Ratio */}
          <div className="space-y-2">
            <span className="text-white/60 font-medium flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Frame Aspect Ratio
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: '9:16' as AspectRatio, label: '9:16 Reels', icon: Smartphone },
                { id: '1:1' as AspectRatio, label: '1:1 Square', icon: Square },
                { id: '16:9' as AspectRatio, label: '16:9 Wide', icon: Monitor },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onAspectRatioChange(id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
                    aspectRatio === id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                  aria-label={`Aspect ratio ${label}`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Highlight Animation Style */}
          <div className="space-y-2">
            <span className="text-white/60 font-medium flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Scissors className="w-3.5 h-3.5 text-amber-400" />
              Animation & Cutout Style
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'marker' as HighlightStyle, label: 'Marker Pen (Reference)' },
                { id: 'cutout' as HighlightStyle, label: 'Torn Paper Cutout' },
                { id: 'red-pen' as HighlightStyle, label: 'Editorial Red Pen' },
                { id: 'underline' as HighlightStyle, label: 'Kinetic Underline' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => onHighlightStyleChange(id)}
                  className={`p-2 rounded-lg text-left border text-[11px] truncate transition-all cursor-pointer ${
                    highlightStyle === id
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                  aria-label={`Highlight style ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Mode: Focus Single Active Word vs Cumulative */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[10px] text-white/50 uppercase font-mono">Word Behavior:</span>
              <button
                onClick={() => onHighlightModeChange('active-word')}
                className={`px-2 py-1 rounded text-[10px] border transition-colors cursor-pointer ${
                  highlightMode === 'active-word'
                    ? 'bg-amber-400 text-black font-bold border-amber-400'
                    : 'bg-white/5 text-white/70 border-white/10 hover:text-white'
                }`}
                title="Only highlight the current active word (like screenshot Kaizen focus)"
              >
                Active Word Focus
              </button>
              <button
                onClick={() => onHighlightModeChange('cumulative')}
                className={`px-2 py-1 rounded text-[10px] border transition-colors cursor-pointer ${
                  highlightMode === 'cumulative'
                    ? 'bg-amber-400 text-black font-bold border-amber-400'
                    : 'bg-white/5 text-white/70 border-white/10 hover:text-white'
                }`}
                title="Keep words highlighted after they are spoken"
              >
                Cumulative
              </button>
            </div>
          </div>

          {/* Highlight Color Picker */}
          <div className="space-y-2">
            <span className="text-white/60 font-medium flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              Highlighter Color
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_PALETTE.map(({ name, color }) => (
                <button
                  key={color}
                  onClick={() => onHighlightColorChange(color)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                    highlightColor.toLowerCase() === color.toLowerCase()
                      ? 'scale-125 border-white ring-2 ring-amber-400 shadow-md'
                      : 'border-black/40 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  title={name}
                  aria-label={`Select ${name}`}
                />
              ))}
            </div>
          </div>

          {/* Paper Texture Theme */}
          <div className="space-y-2">
            <span className="text-white/60 font-medium uppercase tracking-wider text-[11px]">
              Paper Age & Tone
            </span>
            <select
              value={theme}
              onChange={(e) => onThemeChange(e.target.value as PaperTheme)}
              className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white font-medium hover:border-amber-400 focus:border-amber-400 focus:outline-none cursor-pointer"
              aria-label="Select paper theme"
            >
              <option value="vintage-aged">Vintage Aged Newsprint (1970s)</option>
              <option value="tabloid-cream">Tabloid Cream Broadsheet</option>
              <option value="sepia-archive">Sepia Archives (1930s)</option>
              <option value="darkroom-noir">Darkroom Noir (Black Newsprint)</option>
              <option value="modern-press">Clean Editorial Broadsheet</option>
            </select>
          </div>

          {/* Sliders: Blur depth & Font Size */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] text-white/60 mb-1">
                <span>Background Depth Blur:</span>
                <span className="font-mono text-amber-300">{blurDepth}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="0.5"
                value={blurDepth}
                onChange={(e) => onBlurDepthChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                aria-label="Background blur depth slider"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-white/60 mb-1">
                <span>Headline Font Size:</span>
                <span className="font-mono text-amber-300">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="20"
                max="44"
                step="2"
                value={fontSize}
                onChange={(e) => onFontSizeChange(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
                aria-label="Headline font size slider"
              />
            </div>
          </div>

          {/* Kicker tag & Toggles */}
          <div className="space-y-2.5">
            <div>
              <label htmlFor="kicker-input" className="block text-[11px] text-white/60 mb-1">
                Category Kicker Label:
              </label>
              <input
                id="kicker-input"
                type="text"
                value={kicker}
                onChange={(e) => onKickerChange(e.target.value)}
                placeholder="NATIONAL COMPOSER"
                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-white/80">
                <input
                  type="checkbox"
                  checked={showTornEdges}
                  onChange={onToggleTornEdges}
                  className="rounded accent-amber-400 cursor-pointer"
                />
                <span>Ripped Paper Edges</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-white/80">
                <input
                  type="checkbox"
                  checked={paperShake}
                  onChange={onTogglePaperShake}
                  className="rounded accent-amber-400 cursor-pointer"
                />
                <span>Haptic Word Wobble</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
