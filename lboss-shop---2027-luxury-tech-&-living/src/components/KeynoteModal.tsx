import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export const KeynoteModal: React.FC = () => {
  const { isKeynoteModalOpen, setIsKeynoteModalOpen, viewProduct, setCurrentScreen } = useShop();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeChapter, setActiveChapter] = useState('01. Damascus Obsidian Metallurgy');

  if (!isKeynoteModalOpen) return null;

  const chapters = [
    { id: 'c1', title: '01. Damascus Obsidian Metallurgy', timestamp: '02:14', product: 'apex-chrono-x1' },
    { id: 'c2', title: '02. N10 Quantum Sub-Conscious Sync', timestamp: '08:45', product: 'apex-chrono-x1' },
    { id: 'c3', title: '03. Retinal Waveguide HUD Display', timestamp: '14:20', product: 'neural-sensory-rig' },
    { id: 'c4', title: '04. Acoustic Resonance In Beryllium', timestamp: '21:05', product: 'obsidian-spatial-pro' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-5xl bg-[#181b24] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#10131b]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f5b700] animate-pulse"></span>
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#ffd88a] font-bold">
              2027 EXECUTIVE KEYNOTE // 4K HDR MASTER BROADCAST
            </span>
          </div>
          <button
            onClick={() => setIsKeynoteModalOpen(false)}
            className="p-1.5 rounded-lg text-[#9c8f78] hover:text-[#e0e2ed] hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close keynote"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Cinematic Simulated Video Player */}
        <div className="relative aspect-video w-full bg-[#0b0e16] flex items-center justify-center overflow-hidden group">
          <img
            alt="Keynote visual stream"
            className="w-full h-full object-cover opacity-85"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8oyg0195KadT23PDjNG34Wp7emHnjg910xGen4g_jGOE1GDubFV7rTYxyZd38uVp7sa8Kk5mYh1tIOvzggvoOFf6JRb5wWB4xZS_lWPSMlA8RSfIejpCZCgBk1GzKVpvgoLX8labNDWdG4mWX97ooG_g04m9E1OdvHjunMnn570dtS8nxDJaKBkMDhS_xbOOkdM1dLthbM-ZHGugHeNtuznwyDNvwv2VgueuiFtAlsv76yfbRokenTw"
          />

          {/* Hologram Telemetry Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none"></div>

          <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 font-['JetBrains_Mono'] text-xs text-[#ffd88a] flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-[#cabeff]">graphic_eq</span>
            <span>AUDIO STREAM: 32-BIT 192KHZ DOLBY ATMOS</span>
          </div>

          <div className="absolute center flex flex-col items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 rounded-full bg-[#f5b700] text-[#402d00] flex items-center justify-center shadow-[0_0_40px_rgba(245,183,0,0.6)] hover:scale-105 transition-transform cursor-pointer"
              aria-label={isPlaying ? 'Pause broadcast' : 'Play broadcast'}
            >
              <span className="material-symbols-outlined text-4xl">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <span className="font-['Sora'] text-lg text-white font-bold tracking-wide drop-shadow-md">
              {activeChapter}
            </span>
          </div>

          {/* Video Scrubber & Controls */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2">
            <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden cursor-pointer">
              <div className="h-full w-2/5 bg-gradient-to-r from-[#f5b700] to-[#cabeff]"></div>
            </div>
            <div className="flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#d4c5ac]">
              <div className="flex items-center gap-3">
                <span className="text-[#ffd88a] font-bold">14:28</span>
                <span>/</span>
                <span>42:15</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] text-white">4K 60FPS</span>
              </div>
              <button
                onClick={() => {
                  setIsKeynoteModalOpen(false);
                  viewProduct('apex-chrono-x1');
                }}
                className="px-3 py-1 rounded-lg bg-[#f5b700] text-[#402d00] font-bold font-['JetBrains_Mono'] hover:bg-[#ffd88a] transition-colors"
              >
                Inspect Featured Hardware
              </button>
            </div>
          </div>
        </div>

        {/* Chapter Bookmarks Rail */}
        <div className="p-4 bg-[#14171f] border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                setActiveChapter(ch.title);
              }}
              className={`p-2.5 rounded-xl text-left transition-all border ${
                activeChapter === ch.title
                  ? 'bg-[#1c1f28] border-[#f5b700] text-[#ffd88a]'
                  : 'bg-[#181b24] border-white/5 text-[#d4c5ac] hover:bg-[#1c1f28]'
              }`}
            >
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#9c8f78] block">
                {ch.timestamp}
              </span>
              <span className="font-['Manrope'] text-xs font-semibold line-clamp-1">
                {ch.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
