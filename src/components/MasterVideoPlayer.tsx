import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Download, CheckCircle, Sparkles, Scissors } from 'lucide-react';
import { NewspaperScene } from '../types';
import { formatTime, getActiveScene, getActiveSceneIndex } from '../utils/montageSync';

interface MasterVideoPlayerProps {
  videoSrc: string;
  scenes: NewspaperScene[];
  duration: number;
  onDownloadExactVideo: () => void;
}

export const MasterVideoPlayer: React.FC<MasterVideoPlayerProps> = ({
  videoSrc,
  scenes,
  duration,
  onDownloadExactVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  const activeScene = getActiveScene(scenes, currentTime);
  const activeSceneIndex = getActiveSceneIndex(scenes, currentTime);

  // Sync state directly from native video playback (Master Clock)
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (vol: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = vol;
    setVolume(vol);
    if (vol > 0 && isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Video Viewport Container with vintage newspaper styling */}
      <div className="relative w-full max-w-[420px] aspect-square bg-[#f4ede1] rounded-sm overflow-hidden shadow-2xl border-4 border-[#2b2723] p-1.5 flex flex-col justify-between">
        {/* Subtle vintage newspaper top folio */}
        <div className="px-2 pt-1 pb-1 flex items-center justify-between text-[9px] font-mono tracking-widest uppercase text-black/70 border-b border-black/20">
          <span>THE DAILY INQUIRER</span>
          <span className="font-bold text-amber-700">EXACT REEL ARCHIVE</span>
          <span>5¢</span>
        </div>

        {/* The Native Hardware-Decoded Exact Video Element */}
        <div className="relative flex-1 w-full overflow-hidden bg-black flex items-center justify-center my-1 rounded-xs">
          <video
            ref={videoRef}
            src={videoSrc}
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => {});
              }
            }}
            onClick={handlePlayPause}
            className="w-full h-full object-contain cursor-pointer"
            aria-label="Newspaper clipping animation video"
          />

          {/* Active scene badge overlay */}
          {activeScene && (
            <div className="absolute top-2 left-2 z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-black/75 border border-white/20 text-[10px] font-mono text-amber-300 backdrop-blur-xs">
                <span>Cut #{activeSceneIndex + 1}:</span>
                <span className="font-bold uppercase tracking-wider">{activeScene.kicker || activeScene.type}</span>
              </span>
            </div>
          )}

          {/* Big play overlay if paused */}
          {!isPlaying && (
            <div
              onClick={handlePlayPause}
              className="absolute inset-0 bg-black/35 flex items-center justify-center cursor-pointer backdrop-blur-[0.5px]"
            >
              <div className="w-14 h-14 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Folio */}
        <div className="px-2 py-1 flex items-center justify-between text-[8px] font-mono text-black/60 border-t border-black/20">
          <span>AUDIO & VISUAL SYNC: 100% HARDWARE LOCKED</span>
          <span>PAGE 01</span>
        </div>
      </div>

      {/* Prominent Download Button beneath video matching reference */}
      <div className="w-full max-w-[420px] mt-3">
        <button
          onClick={onDownloadExactVideo}
          className="w-full py-3 px-4 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 active:scale-[0.99] text-amber-300 font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          aria-label="Download the exact MP4 video"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Download Exact MP4 Video</span>
        </button>
      </div>

      {/* Synchronized Player Bar */}
      <div className="w-full max-w-[420px] mt-4 bg-[#18191d] border border-white/10 rounded-xl p-3.5 space-y-3">
        {/* Playhead Time & Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="w-9 h-9 rounded-lg bg-amber-400 hover:bg-amber-300 text-black flex items-center justify-center font-bold shadow transition-transform cursor-pointer"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => handleSeek(0)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white flex items-center justify-center cursor-pointer"
              title="Rewind to start"
              aria-label="Rewind video"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="px-2.5 py-1 rounded bg-black/40 border border-white/10 font-mono text-xs text-amber-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Volume & Speed */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded bg-white/5 border border-white/10 p-0.5 text-[11px] font-mono">
              {[0.5, 1.0].map((s) => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    playbackSpeed === s ? 'bg-amber-400 text-black font-bold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg cursor-pointer ${isMuted ? 'text-red-400 bg-red-500/10' : 'text-white/70 hover:text-white bg-white/5'}`}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Scrubber with Scene Markers */}
        <div>
          <div className="flex justify-between text-[10px] font-mono text-white/50 mb-1">
            <span>SCENE CUT TIMINGS</span>
            <span className="text-amber-300">5 Cuts Locked to Beats</span>
          </div>
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              handleSeek(pct * duration);
            }}
            className="relative h-8 bg-black/70 rounded-lg border border-white/15 cursor-pointer overflow-hidden p-1 flex items-center"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            aria-label="Video scrubber"
          >
            {scenes.map((scene, idx) => {
              const leftPct = (scene.startTime / duration) * 100;
              const widthPct = Math.max(2, ((scene.endTime - scene.startTime) / duration) * 100);
              const isActive = idx === activeSceneIndex;

              return (
                <div
                  key={scene.id || idx}
                  className={`absolute top-1 bottom-1 rounded border px-1.5 flex items-center text-[9px] font-mono truncate transition-all ${
                    isActive
                      ? 'bg-amber-400/30 border-amber-400 text-white font-bold ring-1 ring-amber-400'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                  style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeek(scene.startTime);
                  }}
                  title={`Jump to Scene ${idx + 1} (${scene.startTime}s)`}
                >
                  <span className="truncate">#{idx + 1} "{scene.highlightWord}"</span>
                </div>
              );
            })}

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-amber-400 shadow-[0_0_8px_#fbbf24] z-20 pointer-events-none"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
