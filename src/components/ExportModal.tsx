import React, { useState } from 'react';
import { Download, Film, Image as ImageIcon, CheckCircle, Loader2, X } from 'lucide-react';
import { downloadFile } from '../utils/videoExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportVideo: () => Promise<void>;
  onExportPng: () => void;
  isExporting: boolean;
  exportProgress: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExportVideo,
  onExportPng,
  isExporting,
  exportProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1c1d22] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={isExporting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 cursor-pointer"
          aria-label="Close export modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-3">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Export Newspaper Reel</h3>
          <p className="text-xs text-white/60">
            Generate high-resolution video ready for Instagram Reels, TikTok, or Shorts.
          </p>
        </div>

        {isExporting ? (
          <div className="space-y-4 my-6">
            <div className="flex items-center justify-between text-xs text-white/80">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                Rendering frames & syncing audio...
              </span>
              <span className="font-mono font-bold text-amber-300">{Math.round(exportProgress * 100)}%</span>
            </div>
            <div className="w-full bg-black/60 rounded-full h-2.5 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full transition-all duration-150"
                style={{ width: `${Math.round(exportProgress * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-white/40 text-center">
              Please wait while high-definition video frames are rendered...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Primary Action: Video */}
            <button
              onClick={onExportVideo}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm shadow-lg active:scale-[0.99] transition-all cursor-pointer"
              aria-label="Export and download animated video"
            >
              <Download className="w-4 h-4" />
              <span>Download MP4 / WebM Video</span>
            </button>

            {/* Secondary: High-Res Still Poster */}
            <button
              onClick={onExportPng}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              aria-label="Download cover image"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Download Thumbnail Poster (PNG)</span>
            </button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-white/40">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Synced with authentic paper texture & marker audio</span>
        </div>
      </div>
    </div>
  );
};
