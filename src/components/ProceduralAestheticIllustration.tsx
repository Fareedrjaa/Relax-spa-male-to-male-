/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Sparkles, Calendar, Coffee, Columns, HelpCircle, Layers, Wind } from "lucide-react";

interface IllustrationProps {
  id: string; // "reception", "suite", "steam", "corridor", "sauna", "lounge"
}

export default function ProceduralAestheticIllustration({ id }: IllustrationProps) {
  // Common container with rounded clip and dark obsidian backing
  const containerClass = "relative w-full h-44 bg-neutral-950 rounded-xl overflow-hidden border border-stone-850 flex items-center justify-center select-none";

  switch (id) {
    case "reception":
      return (
        <div className={containerClass}>
          {/* Obsidian Marble backdrop and vector desk */}
          <div className="absolute inset-0 bg-radial-gradient from-amber-950/15 via-black to-black opacity-90" />
          
          <svg className="w-full h-full p-4" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="marbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e1b18" />
                <stop offset="50%" stopColor="#0f0e0d" />
                <stop offset="100%" stopColor="#2e2722" />
              </linearGradient>
              <linearGradient id="luxGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#b5902b" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Glowing gold back LED stripe */}
            <motion.path 
              d="M 10 30 H 190" 
              stroke="url(#luxGold)" 
              strokeWidth="1.5" 
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.75, 0.3] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />

            {/* Structured Reception counter drawing */}
            <rect x="35" y="55" width="130" height="40" rx="3" fill="url(#marbleGrad)" stroke="#d4af37" strokeWidth="0.5" className="opacity-90" />
            <rect x="42" y="62" width="116" height="6" fill="#141414" stroke="#d4af37" strokeWidth="0.25" className="opacity-70" />

            {/* Botanical vase outline */}
            <path d="M 145 35 Q 148 55 145 55 H 141 Q 138 55 141 35 Z" fill="#d4af37" className="opacity-40" />

            {/* Botanical leaves floating */}
            <motion.path 
              d="M 143 35 Q 132 20 126 28 Q 138 34 143 35" 
              fill="none" 
              stroke="#d4af37" 
              strokeWidth="0.5"
              animate={{ rotate: [-2, 3, -2] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              style={{ transformOrigin: "143px 35px" }}
            />
            <motion.path 
              d="M 143 35 Q 155 18 162 25 Q 148 33 143 35" 
              fill="none" 
              stroke="#d4af37" 
              strokeWidth="0.5"
              animate={{ rotate: [2, -3, 2] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              style={{ transformOrigin: "143px 35px" }}
            />

            {/* Floating golden welcome tea steam circles */}
            <g transform="translate(60, 42)">
              <rect x="0" y="8" width="12" height="5" rx="1" fill="#d4af37" className="opacity-45" />
              <motion.circle 
                cx="3" cy="-2" r="1" fill="#d4af37" 
                animate={{ y: [0, -12, 0], opacity: [0, 0.8, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
              />
              <motion.circle 
                cx="8" cy="-5" r="1.2" fill="#d4af37" 
                animate={{ y: [3, -15, 3], opacity: [0, 0.8, 0] }}
                transition={{ repeat: Infinity, duration: 2.7, ease: "easeOut", delay: 0.5 }}
              />
            </g>
          </svg>
          <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#d4af37]/45">VIP ENTRY DECK</span>
        </div>
      );

    case "suite":
      return (
        <div className={containerClass}>
          <div className="absolute inset-0 bg-radial-gradient from-violet-950/15 via-black to-black opacity-90" />
          
          <svg className="w-full h-full p-4" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ambient Starfield panels in the background */}
            <g className="opacity-40">
              <motion.circle cx="30" cy="20" r="0.75" fill="#fcf9f2" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ repeat: Infinity, duration: 3 }} />
              <motion.circle cx="70" cy="15" r="0.5" fill="#fcf9f2" animate={{ opacity: [0.9, 0.1, 0.9] }} transition={{ repeat: Infinity, duration: 2.5 }} />
              <motion.circle cx="120" cy="25" r="0.6" fill="#fcf9f2" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }} />
              <motion.circle cx="160" cy="18" r="0.75" fill="#fcf9f2" animate={{ opacity: [0.1, 0.9, 0.1] }} transition={{ repeat: Infinity, duration: 4 }} />
            </g>

            {/* Cozy therapeutic massage platform timber drawing */}
            <path d="M 40 85 L 160 85 M 40 89 L 160 89 M 50 89 V 105 M 150 89 V 105" stroke="#d4af37" strokeWidth="0.75" className="opacity-80" />
            
            {/* Draped sanitized linen contours */}
            <rect x="52" y="74" width="96" height="11" rx="4" fill="#0c0c0c" stroke="#d4af37" strokeWidth="0.5" className="opacity-90" />
            
            {/* Padded physical head support torus */}
            <circle cx="46" cy="79" r="5" fill="none" stroke="#d4af37" strokeWidth="0.5" className="opacity-60" />

            {/* Glowing aroma candles on side console */}
            <g transform="translate(145, 60)">
              {/* Stand */}
              <line x1="-3" y1="14" x2="13" y2="14" stroke="#d4af37" strokeWidth="0.5" className="opacity-70" />
              {/* Candle 1 */}
              <rect x="0" y="4" width="4" height="10" fill="#000" stroke="#d4af37" strokeWidth="0.25" />
              <motion.path 
                d="M 2 4 Q 0 0 2 -3 Q 4 0 2 4" fill="#d4af37" 
                animate={{ scale: [1, 1.15, 0.9, 1], rotate: [-2, 3, -1, 0] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              />
              {/* Candle 2 */}
              <rect x="6" y="7" width="4" height="7" fill="#000" stroke="#d4af37" strokeWidth="0.25" />
              <motion.path 
                d="M 8 7 Q 6 4 8 1 Q 10 4 8 7" fill="#d4af37" 
                animate={{ scale: [0.95, 1.05, 0.9, 0.95], rotate: [1, -2, 2, 0] }}
                transition={{ repeat: Infinity, duration: 2.1, delay: 0.3 }}
              />
            </g>
          </svg>
          <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#d4af37]/45">SIAM SUITE AMBIENCE</span>
        </div>
      );

    case "steam":
      return (
        <div className={containerClass}>
          <div className="absolute inset-0 bg-radial-gradient from-teal-950/15 via-black to-black opacity-90" />
          
          <svg className="w-full h-full p-4" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Series of vertical pine wood partitions */}
            <line x1="25" y1="10" x2="25" y2="110" stroke="#d4af37" strokeWidth="0.5" className="opacity-20" />
            <line x1="55" y1="10" x2="55" y2="110" stroke="#d4af37" strokeWidth="0.5" className="opacity-20" />
            <line x1="145" y1="10" x2="145" y2="110" stroke="#d4af37" strokeWidth="0.5" className="opacity-20" />
            <line x1="175" y1="10" x2="175" y2="110" stroke="#d4af37" strokeWidth="0.5" className="opacity-20" />

            {/* Seated bench structures */}
            <rect x="70" y="65" width="60" height="15" rx="1" fill="#0c0c0c" stroke="#d4af37" strokeWidth="0.5" />
            <line x1="70" y1="72" x2="130" y2="72" stroke="#d4af37" strokeWidth="0.25" className="opacity-50" />

            {/* Rising Eucalyptus vapor clouds */}
            <motion.path 
              d="M 85 64 Q 75 45 88 30 T 78 15" 
              stroke="#d4af37" 
              strokeWidth="0.75" 
              strokeLinecap="round"
              className="opacity-45"
              animate={{ 
                pathLength: [0.1, 1, 0.1],
                strokeDashoffset: [0, 15, 30] 
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            />
            <motion.path 
              d="M 115 64 Q 125 45 110 32 T 120 15" 
              stroke="#d4af37" 
              strokeWidth="0.75" 
              strokeLinecap="round"
              className="opacity-45"
              animate={{ 
                pathLength: [0.1, 1, 0.1],
                strokeDashoffset: [0, -15, -30] 
              }}
              transition={{ repeat: Infinity, duration: 5, ease: "linear", delay: 1 }}
            />

            {/* Copper water pouring bowl outline */}
            <path d="M 60 92 Q 60 105 76 105 Q 92 105 92 92 Z" fill="#0d0d0d" stroke="#d4af37" strokeWidth="0.5" />
            <path d="M 56 92 H 96" stroke="#d4af37" strokeWidth="0.5" />
          </svg>
          <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#d4af37]/45">PINE STEAM CHAMBER</span>
        </div>
      );

    case "corridor":
      return (
        <div className={containerClass}>
          <div className="absolute inset-0 bg-radial-gradient from-amber-950/20 via-black to-black opacity-90" />
          
          <svg className="w-full h-full p-4" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Multi-point floor perspective lines */}
            <line x1="0" y1="110" x2="90" y2="55" stroke="#d4af37" strokeWidth="0.5" className="opacity-15" />
            <line x1="200" y1="110" x2="110" y2="55" stroke="#d4af37" strokeWidth="0.5" className="opacity-15" />
            <line x1="0" y1="95" x2="90" y2="55" stroke="#d4af37" strokeWidth="0.5" className="opacity-10" />
            <line x1="200" y1="95" x2="110" y2="55" stroke="#d4af37" strokeWidth="0.5" className="opacity-10" />

            {/* Distant vanishing gate arch */}
            <path d="M 90 110 V 55 A 10 10 0 0 1 110 55 V 110" stroke="#d4af37" strokeWidth="0.75" className="opacity-70" />

            {/* Vanishing corridor threshold floor markers */}
            <line x1="88" y1="75" x2="112" y2="75" stroke="#d4af37" strokeWidth="0.5" className="opacity-40" />
            <line x1="75" y1="88" x2="125" y2="88" stroke="#d4af37" strokeWidth="0.5" className="opacity-40" />
            <line x1="55" y1="102" x2="145" y2="102" stroke="#d4af37" strokeWidth="0.5" className="opacity-40" />

            {/* Warm candlelit lantern pedestal standing (foreground Left) */}
            <g transform="translate(30, 75)">
              <rect x="0" y="10" width="8" height="25" fill="#0a0a0a" stroke="#d4af37" strokeWidth="0.5" />
              <circle cx="4" cy="5" r="3" fill="none" stroke="#d4af37" strokeWidth="0.5" />
              {/* Flickering light bulb aura */}
              <motion.circle 
                cx="4" cy="5" r="1.5" fill="#d4af37" 
                animate={{ scale: [1, 1.4, 0.95, 1], opacity: [0.7, 0.95, 0.6, 0.7] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
                className="drop-shadow-[0_0_4px_#d4af37]"
              />
            </g>

            {/* Warm candlelit lantern pedestal standing (foreground Right) */}
            <g transform="translate(162, 75)">
              <rect x="0" y="10" width="8" height="25" fill="#0a0a0a" stroke="#d4af37" strokeWidth="0.5" />
              <circle cx="4" cy="5" r="3" fill="none" stroke="#d4af37" strokeWidth="0.5" />
              {/* Flickering light bulb aura */}
              <motion.circle 
                cx="4" cy="5" r="1.5" fill="#d4af37" 
                animate={{ scale: [0.95, 1.35, 1, 0.95], opacity: [0.65, 0.9, 0.7, 0.65] }}
                transition={{ repeat: Infinity, duration: 1.9, delay: 0.4 }}
                className="drop-shadow-[0_0_4px_#d4af37]"
              />
            </g>
          </svg>
          <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#d4af37]/45">SANCTUARY CORRIDOR</span>
        </div>
      );

    case "sauna":
      return (
        <div className={containerClass}>
          <div className="absolute inset-0 bg-radial-gradient from-red-950/15 via-black to-black opacity-90" />
          
          <svg className="w-full h-full p-4" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Linear Timber wall panels from floor to roof */}
            <line x1="10" y1="10" x2="190" y2="10" stroke="#d4af37" strokeWidth="0.5" className="opacity-20" />
            <line x1="10" y1="20" x2="190" y2="20" stroke="#d4af37" strokeWidth="0.5" className="opacity-20" />
            <line x1="10" y1="31" x2="190" y2="31" stroke="#d4af37" strokeWidth="0.5" className="opacity-20" />

            {/* Hot thermal coal stone bucket representation */}
            <path d="M 65 75 L 70 105 H 130 L 135 75 Z" fill="#0a0a0a" stroke="#d4af37" strokeWidth="0.75" />
            <path d="M 60 75 H 140" stroke="#d4af37" strokeWidth="0.75" />
            <ellipse cx="100" cy="75" rx="36" ry="5" fill="#141414" stroke="#d4af37" strokeWidth="0.5" />

            {/* Round basalt volcanic stone shapes inside container */}
            <circle cx="85" cy="74" r="5" fill="#050505" stroke="#d4af37" strokeWidth="0.25" />
            <circle cx="100" cy="72" r="6" fill="#050505" stroke="#d4af37" strokeWidth="0.25" />
            <circle cx="115" cy="74" r="4.5" fill="#050505" stroke="#d4af37" strokeWidth="0.25" />

            {/* Glowing thermo-coals core infra-red pulse */}
            <motion.ellipse 
              cx="100" cy="74" rx="20" ry="3" 
              fill="#ef4444" 
              className="blur-[3px]"
              animate={{ opacity: [0.15, 0.55, 0.15] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            />

            {/* Thermal convective ripple currents ascending */}
            <motion.path 
              d="M 100 68 Q 96 55 104 42 T 100 25" 
              stroke="#ef4444" 
              strokeWidth="0.5" 
              strokeLinecap="round"
              className="opacity-30"
              animate={{ y: [4, -12, 4], opacity: [0, 0.45, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
            />
          </svg>
          <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-red-500/40">SAUNA WOOD ZONE</span>
        </div>
      );

    case "lounge":
      return (
        <div className={containerClass}>
          <div className="absolute inset-0 bg-radial-gradient from-amber-955/15 via-black to-black opacity-90" />
          
          <svg className="w-full h-full p-4" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="teaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d0d0d" />
                <stop offset="100%" stopColor="#221105" />
              </linearGradient>
            </defs>

            {/* Sleek ergonomic lounge post-massage lounger (Right perspective) */}
            <path d="M 25 95 Q 60 90 85 70 T 135 60 Q 155 60 170 85 L 175 95" fill="none" stroke="#d4af37" strokeWidth="1" className="opacity-85" />
            <path d="M 60 92 V 105 M 145 74 V 105" stroke="#d4af37" strokeWidth="0.75" className="opacity-50" />

            {/* Glass table serving organic tea recipes */}
            <g transform="translate(115, 80)">
              <rect x="-15" y="15" width="30" height="2" fill="#d4af37" className="opacity-45" />
              <line x1="0" y1="17" x2="0" y2="28" stroke="#d4af37" strokeWidth="0.5" className="opacity-40" />
              
              {/* Elegant teapot shape */}
              <rect x="-6" y="5" width="12" height="10" rx="1.5" fill="url(#teaGrad)" stroke="#d4af37" strokeWidth="0.5" />
              <path d="M -6 8 H -10 Q -11 11 -6 11" fill="none" stroke="#d4af37" strokeWidth="0.5" /> {/* Handle */}
              <path d="M 6 12 Q 11 10 9 6" fill="none" stroke="#d4af37" strokeWidth="0.5" /> {/* Spout */}

              {/* Gentle thermal tea vapors rising */}
              <motion.circle 
                cx="1" cy="-2" r="0.75" fill="#d4af37" 
                animate={{ y: [3, -10, 3], opacity: [0, 0.7, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              />
            </g>
          </svg>
          <span className="absolute bottom-3 left-3 text-[8px] font-mono tracking-widest text-[#d4af37]/45">POST-SPA LOUNGE</span>
        </div>
      );

    default:
      return (
        <div className={containerClass}>
          <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
        </div>
      );
  }
}
