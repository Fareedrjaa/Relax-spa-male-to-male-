/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Volume2, Sparkles, Tv, RotateCcw, Sliders, Film } from "lucide-react";

interface CinematicVideoPlayerProps {
  isSynthPlaying?: boolean;
}

export default function CinematicVideoPlayer({ isSynthPlaying = false }: CinematicVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeScene, setActiveScene] = useState(0);
  const [lightingVibe, setLightingVibe] = useState<"aurum" | "mystique" | "emerald">("aurum");
  const [showDirectorialHUD, setShowDirectorialHUD] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTimeCode, setCurrentTimeCode] = useState("00:00:00:00");

  const scenes = [
    {
      title: "Hot Abhyanga Oil Pouring",
      desc: "Pre-heated pure herbal extracts are slowly dispensed over back pressure points.",
      subtitles: "Sourcing certified Ayurveda oils heated exactly to 39°C... Relieving core lymphatic tension...",
      fallbackGradient: "from-amber-950 via-stone-900 to-amber-950"
    },
    {
      title: "Gliding Deep Tissue Compression",
      desc: "Systematic forearm gliding along the spine to undo stubborn computer stress.",
      subtitles: "Integrating smooth Swedish effleurage strokes... targeting lumbar stiffness with deep breathing...",
      fallbackGradient: "from-stone-950 via-stone-900 to-violet-950"
    },
    {
      title: "Volcanic Hot Stone Placements",
      desc: "Magnetic basalt rocks from central Deccan plateaus placed along body meridians.",
      subtitles: "Balancing heat-retention stones on spinal chakras... emitting steady infra-red waves...",
      fallbackGradient: "from-stone-950 via-stone-900 to-emerald-950"
    }
  ];

  // Rotate scenes back-to-back every 12 seconds to keep the cinematic feel fresh
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % scenes.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [isPlaying, scenes.length]);

  // Update a mock high-fidelity SMPTE timecode (Hours:Minutes:Seconds:Frames)
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      if (!isPlaying) return;
      frame++;
      const hrs = "00";
      const mins = "04";
      const secs = String(Math.floor((frame / 24) % 60)).padStart(2, "0");
      const frms = String(frame % 24).padStart(2, "0");
      setCurrentTimeCode(`${hrs}:${mins}:${secs}:${frms}`);
    }, 1000 / 24); // 24 FPS match

    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const getVibeGradients = () => {
    switch (lightingVibe) {
      case "aurum":
        return {
          leak: "from-amber-500/15 via-orange-500/5 to-transparent",
          glow: "rgba(245, 158, 11, 0.22)",
          ring: "border-amber-400"
        };
      case "mystique":
        return {
          leak: "from-violet-500/20 via-pink-500/5 to-transparent",
          glow: "rgba(139, 92, 246, 0.25)",
          ring: "border-violet-400"
        };
      case "emerald":
        return {
          leak: "from-emerald-500/20 via-teal-500/5 to-transparent",
          glow: "rgba(16, 185, 129, 0.2)",
          ring: "border-emerald-400"
        };
    }
  };

  const currentVibe = getVibeGradients();

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden border border-stone-850 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] aspect-video md:h-[480px] bg-stone-950 select-none"
      id="cinematic-theatre-element"
    >
      {/* 1. ACTUAL CINEMATIC massage STOCK VIDEO LOOP (with fallback visuals) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen scale-[1.01]"
        src="https://assets.mixkit.co/videos/preview/mixkit-pouring-massage-oil-on-mans-back-42171-large.mp4"
        style={{ filter: "contrast(1.1) brightness(0.85) saturate(1.05)" }}
      />

      {/* FALLBACK PROCEDURAL GENERATIVE GRAPHICS - if video fails or acts as back-support visual */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${scenes[activeScene].fallbackGradient} opacity-30 -z-10`} />

      {/* Procedural glowing hot back alignment nodes to represent a massaged body */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="relative w-80 h-40">
          {/* Spine outline representation */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
          
          {/* Aligning hot therapeutic stone spots */}
          <div className="absolute left-[20%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-900 border border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse" />
          <div className="absolute left-[40%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-stone-900 border border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.6)]" style={{ animationDelay: "1s" }} />
          <div className="absolute left-[60%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-stone-950 border border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.73)]" style={{ animationDelay: "2s" }} />
          <div className="absolute left-[80%] top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-stone-900 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.4)]" />

          {/* Gliding therapist hands simulation */}
          {isPlaying && (
            <motion.div
              animate={{ x: [20, 240, 20] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute top-8 left-0"
            >
              <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-amber-500/10 blur-[2px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 2. ATMOSPHERIC LIGHT LEAK (Anamorphic volumetric effect) */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r ${currentVibe.leak} transition-all duration-[1500ms] pointer-events-none mix-blend-color-dodge`} 
        style={{
          boxShadow: isSynthPlaying ? `inset 0 0 80px ${currentVibe.glow}` : "none",
        }}
      />

      {/* Secondary slow-drifting lens flare */}
      {isPlaying && (
        <motion.div
          animate={{
            x: ["-10%", "110%", "-10%"],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut"
          }}
          className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-violet-500/10 to-transparent blur-3xl mix-blend-screen pointer-events-none"
        />
      )}

      {/* 3. CINEMATIC DIRECTORIAL HUD (Widescreen Overlay) */}
      <AnimatePresence>
        {showDirectorialHUD && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-stone-500"
          >
            {/* Top Bar Indicators */}
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3 bg-stone-950/80 px-3 py-1.5 rounded-lg border border-stone-900 pointer-events-auto">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                <span className="text-stone-300 font-extrabold text-[8px]">RECGOLD_2026</span>
              </div>
              <div className="flex items-center space-x-4 bg-stone-950/80 px-3 py-1.5 rounded-lg border border-stone-900 pointer-events-auto text-[8px]">
                <span>CAM 01 • LENS 45mm</span>
                <span className="text-amber-500">24.00 FPS UHD</span>
              </div>
            </div>

            {/* Middle Grid Markers */}
            <div className="w-full flex-1 flex items-center justify-center opacity-15">
              <div className="w-16 h-16 border border-slate-450 border-dashed rounded-full" />
              <div className="absolute top-1/2 left-4 right-4 h-px bg-slate-450 border-dashed border-t" />
              <div className="absolute left-1/2 top-4 bottom-4 w-px bg-slate-450 border-dashed border-l" />
            </div>

            {/* Bottom Bar Indicators */}
            <div className="flex justify-between items-end">
              <div className="space-y-1 text-slate-400 bg-stone-950/80 px-3 py-1.5 rounded-lg border border-stone-900 pointer-events-auto">
                <span className="text-stone-500 text-[8px] block">Current Sequence</span>
                <span className="text-amber-500 font-bold block">{scenes[activeScene].title}</span>
              </div>
              <div className="bg-stone-950/80 px-3 py-1.5 rounded-lg border border-stone-900 pointer-events-auto font-mono text-[10px] text-slate-300 font-bold">
                {currentTimeCode}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. REAL-TIME TRANSLATED SUBTITLES */}
      <div className="absolute bottom-16 left-4 right-4 text-center z-10 pointer-events-none select-none">
        <motion.p 
          key={activeScene}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.9, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-stone-300 text-[11px] md:text-xs font-serif font-light tracking-wide bg-stone-950/85 px-4 py-2 border border-stone-900 rounded-xl inline-block max-w-lg mx-auto shadow-xl"
        >
          {scenes[activeScene].subtitles}
        </motion.p>
      </div>

      {/* 5. BLACK WIDESCREEN CINEMATIC BARS & CONTROL OVERLAYS */}
      <div className="absolute inset-x-0 top-0 h-4 bg-stone-950 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-stone-950 to-stone-950/80 flex items-center justify-between px-6 z-20">
        
        {/* Play/Pause */}
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlayback}
            className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-md"
            title={isPlaying ? "Pause Scene" : "Resume Scene"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-stone-950 ml-0.5" />}
          </button>
          <div className="hidden sm:block text-left">
            <h5 className="text-[10px] text-slate-200 font-semibold leading-none">{scenes[activeScene].title}</h5>
            <p className="text-[8px] text-stone-500 font-mono mt-1 leading-none">Scenic Men's Decompression Stream</p>
          </div>
        </div>

        {/* Scene Dots */}
        <div className="flex space-x-2">
          {scenes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveScene(idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${idx === activeScene ? "bg-amber-500 w-5" : "bg-stone-800 hover:bg-stone-700"}`}
            />
          ))}
        </div>

        {/* Interactive Lighting & HUD controllers */}
        <div className="flex items-center space-x-2">
          {/* Lighting vibe switch */}
          <div className="flex bg-stone-900 border border-stone-800 rounded-xl p-0.5">
            {[
              { id: "aurum", label: "Gold", clr: "text-amber-500" },
              { id: "mystique", label: "Mystiq", clr: "text-violet-400" },
              { id: "emerald", label: "Emrld", clr: "text-emerald-400" }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setLightingVibe(v.id as any)}
                className={`px-2 py-1 text-[8px] font-mono rounded-lg transition-all cursor-pointer ${
                  lightingVibe === v.id ? "bg-stone-950 text-slate-200 shadow font-bold" : "text-stone-500 hover:text-stone-400"
                }`}
              >
                <span className={v.clr}>{v.label}</span>
              </button>
            ))}
          </div>

          {/* Toggle HUD */}
          <button
            onClick={() => setShowDirectorialHUD(!showDirectorialHUD)}
            className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
              showDirectorialHUD ? "bg-stone-900 border-amber-500/20 text-amber-500" : "bg-stone-950 border-stone-850 text-stone-500 hover:text-stone-400"
            }`}
            title="Toggle Directorial HUD Overlays"
          >
            <Film className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
}
