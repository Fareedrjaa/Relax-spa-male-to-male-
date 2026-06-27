/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  forceStyle?: "A" | "B";
  disableClick?: boolean;
}

export default function AnimatedLogo({
  size = "md",
  className = "",
  forceStyle,
  disableClick = false,
}: AnimatedLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Synchronized global logo style using a custom window event
  const [logoStyle, setLogoStyle] = useState<"A" | "B">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("relax_spa_logo_style") as "A" | "B") || "A";
    }
    return "A";
  });

  // Observe global style changes
  useEffect(() => {
    const handleStyleChange = (e: Event) => {
      const customEvent = e as CustomEvent<"A" | "B">;
      if (customEvent.detail === "A" || customEvent.detail === "B") {
        setLogoStyle(customEvent.detail);
      }
    };
    window.addEventListener("relax_spa_logo_style_changed", handleStyleChange);
    return () => {
      window.removeEventListener("relax_spa_logo_style_changed", handleStyleChange);
    };
  }, []);

  const activeStyle = forceStyle || logoStyle;

  // Motion values for smooth 3D tilt coordinates
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Springs for luxury organic momentum
  const springConfig = { damping: 22, stiffness: 130, mass: 0.9 };
  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), springConfig);

  // Secondary depth-offset springs for parallax effect
  const layerTranslateZ1 = useSpring(useTransform(y, [0, 1], [-6, 6]), springConfig);
  const layerTranslateZ2 = useSpring(useTransform(y, [0, 1], [14, -14]), springConfig);
  const layerTranslateZ3 = useSpring(useTransform(x, [0, 1], [-10, 10]), springConfig);

  // Slow ambient drift when not hovered (living 3D feel)
  useEffect(() => {
    if (isHovered) return;

    let startTime = Date.now();
    let animationFrameId: number;

    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      // Beautiful harmonic slow oscillation
      const targetX = 0.5 + Math.sin(elapsed * 0.7) * 0.3;
      const targetY = 0.5 + Math.cos(elapsed * 0.4) * 0.3;

      x.set(targetX);
      y.set(targetY);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, x, y]);

  // Handle pointer coordinate updates based on center offset
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (disableClick) return;
    e.stopPropagation();
    const nextStyle = activeStyle === "A" ? "B" : "A";
    localStorage.setItem("relax_spa_logo_style", nextStyle);
    setLogoStyle(nextStyle);
    window.dispatchEvent(
      new CustomEvent("relax_spa_logo_style_changed", { detail: nextStyle })
    );

    // Optional subtle haptic feedback vibe or audio click
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch (_) {}
  };

  const dimensions = {
    sm: "w-9 h-9",
    md: "w-14 h-14",
    lg: "w-28 h-28",
    xl: "w-36 h-36",
  };

  const strokeWidth = {
    sm: 0.8,
    md: 1.1,
    lg: 1.4,
    xl: 1.8,
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleLogoClick}
      title={disableClick ? "" : "Click to flip brand visual style (A / B)"}
      className={`relative flex items-center justify-center select-none ${dimensions[size]} ${className} ${
        disableClick ? "" : "cursor-pointer active:scale-95 duration-200"
      }`}
      style={{ perspective: "1000px" }}
      id={`animated-logo-3d-wrapper-${size}-${activeStyle}`}
    >
      {/* 3D Container combining all floating vector layers */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateY: activeStyle === "B" ? [0, 180, 0] : [0, -180, 0] }}
        key={activeStyle}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full relative flex items-center justify-center"
        id={`logo-3d-canvas-stage-${size}`}
      >
        {/* Layer 1: Ambient Backdrop Aura Glow based on style (Warm amber-gold vs Ice indigo-gold) */}
        <motion.div
          style={{
            translateZ: "-35px",
          }}
          className={`absolute inset-[3%] rounded-full opacity-60 blur-xl pointer-events-none bg-gradient-to-tr ${
            activeStyle === "A"
              ? "from-amber-500/25 via-transparent to-amber-600/35"
              : "from-indigo-500/25 via-amber-500/10 to-emerald-500/25"
          }`}
        />

        {/* Layer 2: Concentric Luxury Brass Orbit Lines */}
        <motion.div
          style={{
            translateZ: layerTranslateZ1,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0 w-full h-full"
        >
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: isHovered ? 15 : 50,
              ease: "linear",
            }}
          >
            {/* Fine luxury dotted circle */}
            <circle
              cx="50"
              cy="50"
              r="47"
              fill="none"
              stroke="url(#chromeGoldGrad)"
              strokeWidth={strokeWidth[size]}
              strokeDasharray="4 6"
              className="opacity-70"
            />
            {/* Inner frame bounds */}
            <circle
              cx="50"
              cy="50"
              r="43"
              fill="none"
              stroke="url(#goldGradientBack)"
              strokeWidth="0.5"
              className="opacity-50"
            />
            {/* Orbit Compass points */}
            <line x1="50" y1="3" x2="50" y2="7" stroke="url(#chromeGoldGrad)" strokeWidth="0.8" />
            <line x1="50" y1="93" x2="50" y2="97" stroke="url(#chromeGoldGrad)" strokeWidth="0.8" />
            <line x1="3" y1="50" x2="7" y2="50" stroke="url(#chromeGoldGrad)" strokeWidth="0.8" />
            <line x1="93" y1="50" x2="97" y2="50" stroke="url(#chromeGoldGrad)" strokeWidth="0.8" />
          </motion.svg>
        </motion.div>

        {/* Layer 3: Intersecting Reverse Accents */}
        <motion.div
          style={{
            translateZ: layerTranslateZ3,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-2 w-[84%] h-[84%]"
        >
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full text-amber-500/30"
            animate={{ rotate: -360 }}
            transition={{
              repeat: Infinity,
              duration: isHovered ? 20 : 65,
              ease: "linear",
            }}
          >
            <path
              d="M 50 5 A 45 45 0 0 1 95 50"
              fill="none"
              stroke="url(#chromeGoldGrad)"
              strokeWidth={strokeWidth[size] * 1.1}
              className="opacity-80"
            />
            <path
              d="M 50 95 A 45 45 0 0 1 5 50"
              fill="none"
              stroke="url(#chromeGoldLight)"
              strokeWidth={strokeWidth[size] * 1.1}
              className="opacity-80"
            />
            <circle cx="50" cy="5" r="2.5" fill="url(#chromeGoldGrad)" />
            <circle cx="50" cy="95" r="2.5" fill="url(#chromeGoldGrad)" />
          </motion.svg>
        </motion.div>

        {/* Layer 4: Prime Foreground Vector (Logo A Face Profile vs Logo B Athletic Back) */}
        <motion.div
          style={{
            translateZ: layerTranslateZ2,
            transformStyle: "preserve-3d",
          }}
          className="absolute w-[80%] h-[80%] flex items-center justify-center"
        >
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.65)]"
            animate={{ scale: isHovered ? 1.05 : 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <defs>
              {/* Complex 3-point gold gradient for realistic depth */}
              <linearGradient id="chromeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="35%" stopColor="#d97706" />
                <stop offset="70%" stopColor="#92400e" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              {/* Deep Golden Copper shadow gradient */}
              <linearGradient id="chromeGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="50%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#1c1917" />
              </linearGradient>

              {/* Brilliant Reflection highlight gold */}
              <linearGradient id="chromeGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.3" />
              </linearGradient>

              {/* Obsidian deep background shade */}
              <linearGradient id="goldGradientBack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1c1917" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
              </linearGradient>

              {/* Chrome Silver Gradient for Style B */}
              <linearGradient id="chromeSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#e2e8f0" />
                <stop offset="65%" stopColor="#475569" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </linearGradient>
            </defs>

            {/* LOGO STYLE A: CLASSIC GILDED GRACE (LEFT HEAD PROFILE & CONCENTRIC LEAVES) */}
            {activeStyle === "A" ? (
              <g id="style-a-gilded-grace" className="animate-fade-in">
                {/* Thin inner gold framing */}
                <circle cx="50" cy="50" r="41" fill="none" stroke="url(#chromeGoldLight)" strokeWidth="0.8" opacity="0.8" />

                {/* Subtile background integrated monogram R-S in soft brass outline */}
                <path
                  d="M 45 28 L 58 28 C 63 28, 66 30, 66 34 C 66 38, 62 40, 58 40 L 48 40 L 48 64 L 58 64 M 48 40 L 60 64"
                  fill="none"
                  stroke="url(#chromeGoldGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.25"
                />
                <path
                  d="M 38 61 C 38 65, 48 65, 48 57 C 48 49, 36 49, 36 42 C 36 36, 46 36, 46 40"
                  fill="none"
                  stroke="url(#chromeGoldLight)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.25"
                />

                {/* Left leaves cluster wreath framing the left edge */}
                <g id="leaves-wreath" opacity="0.95">
                  <path d="M 24 64 Q 28 50 40 56 Q 31 68 24 64 Z" fill="url(#chromeGoldGrad)" stroke="url(#chromeGoldLight)" strokeWidth="0.5" />
                  <path d="M 29 74 Q 38 62 47 72 Q 36 82 29 74 Z" fill="url(#chromeGoldGrad)" stroke="url(#chromeGoldLight)" strokeWidth="0.5" />
                  <path d="M 18 52 Q 28 44 28 58 Q 16 58 18 52 Z" fill="url(#chromeGoldGrad)" stroke="url(#chromeGoldLight)" strokeWidth="0.5" />
                  {/* Stem loop */}
                  <path d="M 15 45 C 19 60, 28 75, 50 78" fill="none" stroke="url(#chromeGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                </g>

                {/* Beautifully stylized profile of a handsome gentleman looking left */}
                <path
                  d="M 40 33 
                     C 37 33, 35 34, 33 37 
                     C 30 40, 32 42, 30 43 
                     C 28 44, 25 44, 24 46 
                     C 23 47, 25 48, 24 49 
                     C 23 50.5, 21.5 51, 24 52
                     C 26.5 53, 25 54, 27 55 
                     C 29 56, 27.5 58.5, 32 59.5 
                     C 36 60.5, 38 58.5, 40 55.5"
                  fill="none"
                  stroke="url(#chromeGoldGrad)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_8px_rgba(245,158,11,0.55)]"
                />

                {/* Back hair waves styled backwards */}
                <path d="M 33 37 C 35 30, 42 28, 48 30 C 53 32, 51 40, 46 41" fill="none" stroke="url(#chromeGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 36 34 C 40 26, 47 26, 51 29" fill="none" stroke="url(#chromeGoldLight)" strokeWidth="1" strokeLinecap="round" />
                <path d="M 34 38 C 38 32, 45 33, 48 39" fill="none" stroke="url(#chromeGoldLight)" strokeWidth="0.8" strokeLinecap="round" />

                {/* Ambient soul heart core chakra center */}
                <circle cx="50" cy="54" r="2" fill="#ffffff" className="animate-pulse" style={{ filter: "drop-shadow(0 0 5px #ea580c)" }} />
                {/* Gold star spark indicator */}
                <path d="M 68 20 L 69.5 23.5 L 73 24 L 70.5 26.5 L 71.5 30 L 68 28 L 64.5 30 L 65.5 26.5 L 63 24 L 66.5 23.5 Z" fill="url(#chromeGoldLight)" className="animate-pulse" />
              </g>
            ) : (
              // LOGO STYLE B: MODERN ATHLETIC MAJESTY (RIGHT ATHLETIC TRAPS BACK & SILVER/GOLD RS MONOGRAM)
              <g id="style-b-athletic-majesty" className="animate-fade-in" transform="scale(1, 1)">
                {/* Thick beveled inner brass frame */}
                <circle cx="50" cy="50" r="41" fill="url(#goldGradientBack)" stroke="url(#chromeGoldGrad)" strokeWidth="2.2" className="drop-shadow-[0_3px_5px_rgba(0,0,0,0.55)]" />

                {/* Major High-contrast Serif letter 'R' in high gloss gold */}
                <path
                  d="M 30 26 H 48 M 38 26 V 65 M 38 26 C 47 26, 54 28, 54 36 C 54 44, 46 45, 38 45 H 48 L 58 65"
                  fill="none"
                  stroke="url(#chromeGoldGrad)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Intertwining 'S' in Silver gloss weave */}
                <path
                  d="M 43 45 C 43 56, 70 50, 70 61 Q 70 70, 48 68"
                  fill="none"
                  stroke="url(#chromeSilverGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Thin golden outline highlights on S */}
                <path
                  d="M 43 45 C 43 56, 70 50, 70 61 Q 70 70, 48 68"
                  fill="none"
                  stroke="url(#chromeGoldLight)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Beautiful muscular back posture & model contour facing Right */}
                <path
                  d="M 62 33 
                     C 61 35, 60.5 37, 61.5 38.5 
                     C 62.5 40, 64 40.5, 65.5 41.5 
                     C 68 43, 71 46, 72 49 
                     C 73 52, 71 54, 73.5 58 
                     C 75 61, 78 64, 76 69 
                     C 74 72.5, 71.5 75.5, 73.5 78.5"
                  fill="none"
                  stroke="url(#chromeGoldLight)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                />
                {/* Hair strokes on muscular back model */}
                <path d="M 59 34 C 61.5 31.5, 65 31.5, 67 33" fill="none" stroke="url(#chromeGoldGrad)" strokeWidth="1" strokeLinecap="round" />

                {/* Exquisite 3 golden base leaves */}
                <g id="bottom-leaves" opacity="0.95">
                  <path d="M 28 78 Q 36 68, 46 76 Q 37 86, 28 78 Z" fill="url(#chromeGoldGrad)" stroke="url(#chromeGoldLight)" strokeWidth="0.4" />
                  <path d="M 20 72 Q 28 64, 33 74 Q 25 80, 20 72 Z" fill="url(#chromeGoldGrad)" stroke="url(#chromeGoldLight)" strokeWidth="0.4" />
                  <path d="M 33 80 Q 40 82, 43 89 Q 34 91, 33 80 Z" fill="url(#chromeGoldGrad)" stroke="url(#chromeGoldLight)" strokeWidth="0.4" />
                </g>

                {/* Center energy seed for somatic wellness */}
                <circle cx="50" cy="56" r="1.5" fill="#ffffff" />
                <circle cx="50" cy="56" r="3.5" stroke="url(#chromeGoldGrad)" strokeWidth="0.4" fill="none" className="animate-ping" />
              </g>
            )}
          </motion.svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
