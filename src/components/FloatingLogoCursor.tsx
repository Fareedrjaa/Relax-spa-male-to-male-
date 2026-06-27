/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Sparkles, Move } from "lucide-react";
import AnimatedLogo from "./AnimatedLogo";

export default function FloatingLogoCursor() {
  const [isActive, setIsActive] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowingMouse, setIsFollowingMouse] = useState(true);
  const [lastPosition, setLastPosition] = useState({ x: 100, y: 150 });

  // Floating coordinates
  const mouseX = useMotionValue(100);
  const mouseY = useMotionValue(250);

  // Extremely professional elastic spring parameters for smooth cinematic dampening
  const springConfig = { damping: 30, stiffness: 90, mass: 0.8 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!isFollowingMouse) return;

    const handlePointerMove = (e: PointerEvent) => {
      // Offset slightly to float elegant beside the pointer, preventing overlapping with clicks
      mouseX.set(e.clientX + 24);
      mouseY.set(e.clientY + 24);
      setLastPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [isFollowingMouse, mouseX, mouseY]);

  // If pointer is left idle, trigger slow harmonic float pattern so the logo keeps moving
  useEffect(() => {
    let animationId: number;
    let startTime = Date.now();

    const floatAmbiently = () => {
      if (isFollowActive) {
        // Slowly oscillate parent value if not actively moving mouse
        const elapsed = (Date.now() - startTime) / 1000;
        const driftX = Math.sin(elapsed * 0.9) * 20;
        const driftY = Math.cos(elapsed * 0.6) * 20;
        
        // Add relative gentle drift offsets to trail
        trailX.set(mouseX.get() + driftX);
        trailY.set(mouseY.get() + driftY);
      }
      animationId = requestAnimationFrame(floatAmbiently);
    };

    const isFollowActive = isFollowingMouse;
    animationId = requestAnimationFrame(floatAmbiently);
    return () => cancelAnimationFrame(animationId);
  }, [isFollowingMouse, mouseX, mouseY, trailX, trailY]);

  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="fixed bottom-6 left-6 z-50 px-3.5 py-2 bg-stone-900 border border-amber-500/30 text-amber-500 hover:text-amber-400 font-mono text-[10px] rounded-xl flex items-center space-x-1.5 shadow-xl hover:bg-amber-500/10 cursor-pointer"
        id="summon-logo-btn"
      >
        <Sparkles className="w-3 h-3 animate-spin" />
        <span>Summon 3D Astral Logo</span>
      </button>
    );
  }

  return (
    <motion.div
      style={{
        x: trailX,
        y: trailY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="fixed top-0 left-0 pointer-events-auto z-40 hidden md:block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id="3d-floating-logo-cursor-wrapper"
    >
      {/* Container widget */}
      <div className="relative group p-4">
        {/* Soft magical circular backdrop glow with color combination */}
        <div className="absolute inset-2 bg-gradient-to-tr from-violet-500/25 via-amber-500/10 to-emerald-500/20 rounded-full blur-xl animate-pulse -z-10" />

        {/* Action Controls when hovering */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-950/95 border border-stone-800 text-stone-400 rounded-lg px-2 py-1 text-[8px] font-mono flex items-center space-x-2 whitespace-nowrap shadow-2xl pointer-events-auto select-none"
        >
          <button
            onClick={() => setIsFollowingMouse(!isFollowingMouse)}
            className={`hover:text-amber-400 uppercase font-bold transition-colors cursor-pointer ${isFollowingMouse ? "text-amber-400" : ""}`}
          >
            {isFollowingMouse ? "🔒 Park Orbit" : "🔗 Follow Mouse"}
          </button>
          <span className="text-stone-800">|</span>
          <button
            onClick={() => setIsActive(false)}
            className="hover:text-red-400 uppercase font-bold transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </motion.div>

        {/* 3D Moving Logo proper */}
        <div className="relative">
          <AnimatedLogo size="lg" className="shadow-[0_0_40px_rgba(245,158,11,0.22)] rounded-full border border-amber-500/10 hover:border-amber-500/45 transition-colors" />
          
          {/* Subtle directional direction indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-stone-950 border border-stone-800 rounded-full flex items-center justify-center text-amber-500 hover:text-amber-400 cursor-help" title="Draggable Astral Logo">
            <Move className="w-2.5 h-2.5 opacity-80" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
