/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface ThreeDCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g., 'rgba(212, 175, 55, 0.2)'
  id?: string;
  onClick?: () => void;
  key?: React.Key;
}

export default function ThreeDCard({
  children,
  className = "",
  glowColor = "rgba(212, 175, 55, 0.25)",
  id,
  onClick,
  ...props
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for smooth 3D rotation springs
  const rotateX = useSpring(0, { stiffness: 120, damping: 15 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 15 });

  // Gloss lighting shine overlays tracking
  const shineX = useSpring(50, { stiffness: 150, damping: 20 });
  const shineY = useSpring(50, { stiffness: 150, damping: 20 });

  // Floating shadow translation tracking
  const shadowX = useSpring(0, { stiffness: 125, damping: 18 });
  const shadowY = useSpring(25, { stiffness: 125, damping: 18 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const el = cardRef.current;
    const rect = el.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    // Mouse coordinate offsets from card center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Calculate maximum degrees of rotation (up to 12 degrees tilt)
    const degX = -(mouseY / (height / 2)) * 12;
    const degY = (mouseX / (width / 2)) * 12;

    rotateX.set(degX);
    rotateY.set(degY);

    // Calculate percentage coordinates for shine glare effect (0% to 100%)
    const pctX = ((e.clientX - rect.left) / width) * 100;
    const pctY = ((e.clientY - rect.top) / height) * 100;

    shineX.set(pctX);
    shineY.set(pctY);

    // Dynamic shadow offsets (shifting shadow in opposite direction of mouse tilt)
    const shOffsetX = -(mouseX / (width / 2)) * 30;
    const shOffsetY = 25 - (mouseY / (height / 2)) * 15;
    shadowX.set(shOffsetX);
    shadowY.set(shOffsetY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    shineX.set(50);
    shineY.set(50);
    shadowX.set(0);
    shadowY.set(25);
  };

  const currentShadow = useTransform(
    [shadowX, shadowY],
    ([x, y]) => `rgba(0, 0, 0, 0.75) ${x}px ${y}px 40px -15px, ${glowColor} 0px 0px 30px -10px`
  );

  return (
    <motion.div
      ref={cardRef}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        rotateX: rotateX as any,
        rotateY: rotateY as any,
        boxShadow: currentShadow,
      }}
      className={`relative select-none rounded-[22px] transition-all duration-100 ease-out cursor-pointer ${className}`}
    >
      {/* Dynamic volumetric sheen glare reflection */}
      <motion.div
        className="absolute inset-0 rounded-[22px] pointer-events-none mix-blend-color-dodge z-30 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.45 : 0,
          background: useTransform(
            [shineX, shineY],
            ([x, y]) =>
              `radial-gradient(circle 220px at ${x}% ${y}%, rgba(251, 249, 240, 0.35) 0%, rgba(212, 175, 55, 0.05) 50%, transparent 100%)`
          )
        }}
      />

      {/* Floating 3D structure layer */}
      <div 
        className="w-full h-full relative z-10"
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </motion.div>
  );
}
