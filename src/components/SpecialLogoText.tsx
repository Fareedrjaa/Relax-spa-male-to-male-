/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

interface SpecialLogoTextProps {
  text: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function SpecialLogoText({ text, size = "md", className = "" }: SpecialLogoTextProps) {
  const words = text.split(" ");

  const sizeClasses = {
    sm: "text-lg md:text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-4xl md:text-5xl lg:text-6xl",
    xl: "text-5xl md:text-6xl lg:text-7xl",
  };

  const svgSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  // Renders a next-level luxurious vector letter designed as a custom "half-alphabet, half-wellness-logo"
  const renderSpecialLetter = (char: string, index: number, totalLen: number) => {
    const key = `${char}-${index}`;
    const upperChar = char.toUpperCase();

    // To ensure all branding letters activate their luxurious custom vector-art, we set isSpecial to true
    // (non-mapped letters will gently pass to the default handler which falls back cleanly).
    const isSpecial = true;

    const baseMotionProps = {
      initial: { opacity: 0, y: 10, rotateY: -20 },
      animate: { opacity: 1, y: 0, rotateY: 0 },
      transition: {
        duration: 0.45,
        delay: index * 0.02,
        ease: [0.16, 1, 0.3, 1],
      },
    };

    if (!isSpecial) {
      // Return standard letter but styled with luxury high-contrast gradient
      return (
        <motion.span
          key={key}
          {...baseMotionProps}
          className="bg-gradient-to-b from-stone-100 via-amber-200 to-amber-500 bg-clip-text text-transparent italic font-serif font-light inline-block hover:scale-110 hover:text-amber-300 transition-transform cursor-default"
          style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {char}
        </motion.span>
      );
    }

    // Custom hand-drawn premium vector art for key alphabets blending 3D structure & wellness motifs:
    const activeSvgSize = svgSizes[size] || "w-8 h-8";

    switch (upperChar) {
      case "R":
        return (
          <motion.span key={key} {...baseMotionProps} className="inline-flex items-center justify-center translate-y-[2px]">
            <svg viewBox="0 0 40 40" className={`${activeSvgSize} text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]`}>
              <defs>
                <linearGradient id="gradR" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#8b5cf6" /> {/* Indigo touch */}
                </linearGradient>
              </defs>
              {/* Stem representing healing column */}
              <rect x="8" y="4" width="4.5" height="32" rx="2" fill="url(#gradR)" />
              {/* Petal-like semi-circle loop of R */}
              <path d="M 12 4 C 28 4, 28 20, 12 20" fill="none" stroke="url(#gradR)" strokeWidth="4.5" strokeLinecap="round" />
              {/* Healing leaf stem representing the leg of R */}
              <path d="M 12 20 Q 24 23 30 36" fill="none" stroke="url(#gradR)" strokeWidth="4.5" strokeLinecap="round" />
              {/* Radiant micro star at center loop */}
              <circle cx="12" cy="12" r="2" fill="#ffffff" />
            </svg>
          </motion.span>
        );

      case "E":
        return (
          <motion.span key={key} {...baseMotionProps} className="inline-flex items-center justify-center translate-y-[2px]">
            <svg viewBox="0 0 40 40" className={`${activeSvgSize} text-amber-500`}>
              <defs>
                <linearGradient id="gradE" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#ec4899" /> {/* Magical Rose Touch */}
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              {/* Backbone stem */}
              <line x1="10" y1="6" x2="10" y2="34" stroke="url(#gradE)" strokeWidth="4.5" strokeLinecap="round" />
              {/* Top luxury wing horizontal bar */}
              <path d="M 10 7 L 30 7" stroke="url(#gradE)" strokeWidth="4.5" strokeLinecap="round" />
              {/* Middle shorter lotus node bar */}
              <path d="M 10 20 L 24 20" stroke="url(#gradE)" strokeWidth="3.5" strokeLinecap="round" />
              {/* Bottom solid base */}
              <path d="M 10 33 L 30 33" stroke="url(#gradE)" strokeWidth="4.5" strokeLinecap="round" />
              {/* Sparkle energy ornament */}
              <circle cx="24" cy="20" r="1.5" fill="#ffffff" />
            </svg>
          </motion.span>
        );

      case "L":
        return (
          <motion.span key={key} {...baseMotionProps} className="inline-flex items-center justify-center translate-y-[2px]">
            <svg viewBox="0 0 40 40" className={`${activeSvgSize} text-amber-400`}>
              {/* Standard L turned into a beautiful right-angle scale with wellness drops */}
              <path d="M 10 5 L 10 32 Q 10 35 13 35 L 32 35" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
              {/* Dropping incense seed */}
              <circle cx="10" cy="5" r="2.5" fill="#f59e0b" />
              {/* Small ground wave */}
              <path d="M 24 35 Q 28 32 32 35" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
            </svg>
          </motion.span>
        );

      case "A":
        return (
          <motion.span key={key} {...baseMotionProps} className="inline-flex items-center justify-center translate-y-[2px]">
            <svg viewBox="0 0 40 40" className={`${activeSvgSize} text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)]`}>
              <defs>
                <linearGradient id="gradA" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="40%" stopColor="#10b981" /> {/* Healing emerald heart */}
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              {/* Pure pyramidal A-shape looking like a serene wellness dome */}
              <path d="M 20 4 L 7 35" fill="none" stroke="url(#gradA)" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 20 4 L 33 35" fill="none" stroke="url(#gradA)" strokeWidth="4.5" strokeLinecap="round" />
              {/* Receptivity horizontal energy beam */}
              <path d="M 12 24 L 28 24" fill="none" stroke="url(#gradA)" strokeWidth="3" strokeLinecap="round" />
              {/* Star of hope on structural zenith */}
              <circle cx="20" cy="4" r="3" fill="#ffffff" className="animate-ping" />
              <circle cx="20" cy="4" r="1.5" fill="#fef3c7" />
            </svg>
          </motion.span>
        );

      case "X":
        return (
          <motion.span key={key} {...baseMotionProps} className="inline-flex items-center justify-center translate-y-[2px]">
            <svg viewBox="0 0 40 40" className={`${activeSvgSize} text-violet-400`}>
              {/* Two intersecting wellness bands forming majestic X with core light */}
              <defs>
                <linearGradient id="gradX" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <line x1="7" y1="7" x2="33" y2="33" stroke="url(#gradX)" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="33" y1="7" x2="7" y2="33" stroke="url(#gradX)" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="20" cy="20" r="3" fill="#ffffff" />
            </svg>
          </motion.span>
        );

      case "S":
        return (
          <motion.span key={key} {...baseMotionProps} className="inline-flex items-center justify-center translate-y-[2px]">
            <svg viewBox="0 0 40 40" className={`${activeSvgSize} text-emerald-400`}>
              {/* Celestial healing S curve resembling steam/water kinetics */}
              <path d="M 30 8 C 30 8, 12 2, 12 16 C 12 30, 28 26, 28 32 C 28 38, 14 36, 14 36" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="30" cy="8" r="2" fill="#10b981" />
              <circle cx="14" cy="36" r="2" fill="currentColor" />
            </svg>
          </motion.span>
        );

      case "P":
        return (
          <motion.span key={key} {...baseMotionProps} className="inline-flex items-center justify-center translate-y-[2px]">
            <svg viewBox="0 0 40 40" className={`${activeSvgSize} text-amber-500`}>
              <path d="M 10 4 L 10 36" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 10 4 C 28 4, 28 20, 10 20" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
              {/* Pearl droplet embedded in P's loop representing beauty therapy */}
              <circle cx="20" cy="12" r="2.5" fill="#ffffff" />
            </svg>
          </motion.span>
        );

      default:
        // Fallback for non-mapped letters
        return (
          <motion.span
            key={key}
            {...baseMotionProps}
            className="bg-gradient-to-b from-slate-100 to-amber-500 bg-clip-text text-transparent font-serif font-black inline-block cursor-default"
            style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {char}
          </motion.span>
        );
    }
  };

  return (
    <div className={`flex items-center justify-center flex-wrap gap-x-2 md:gap-x-4 tracking-wider select-none ${sizeClasses[size]} ${className}`}>
      {words.map((word, wordIdx) => (
        <div key={`word-${wordIdx}`} className="flex items-center">
          {word.split("").map((char, charIdx) => renderSpecialLetter(char, charIdx, word.length))}
        </div>
      ))}
    </div>
  );
}
