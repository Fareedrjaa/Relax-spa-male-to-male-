/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from "react";

interface GoldDustBurstProps {
  active: boolean;
}

export default function GoldDustBurst({ active }: GoldDustBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Color palettes of real premium jewelry golds
    const goldPalettes = [
      "rgba(251, 191, 36, ",  // Warm Gold
      "rgba(245, 158, 11, ",  // Amber Gold
      "rgba(212, 175, 55, ",  // Metallic Pale Gold
      "rgba(255, 253, 240, ", // Radiant White Gold Lux
      "rgba(244, 63, 94, "    // Rose Gold touch
    ];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      decay: number;
      charge: number; // orbital amplitude
      color: string;
      gravity: number;
      friction: number;
      waveSpeed: number;
      wavePhase: number;
    }

    const particles: Particle[] = [];

    // Launcher function to shoot dust from coordinates (x, y)
    const launchBurst = (origineX: number, origineY: number, count = 70) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const initialSpeed = Math.random() * 8.5 + 2.5;
        const color = goldPalettes[Math.floor(Math.random() * goldPalettes.length)];
        const radius = Math.random() * 2.8 + 0.5;
        const decay = Math.random() * 0.007 + 0.005;

        particles.push({
          x: origineX,
          y: origineY,
          vx: Math.cos(angle) * initialSpeed,
          vy: Math.sin(angle) * initialSpeed - 2.0, // slight upward bias
          radius: radius,
          alpha: 1.0,
          decay: decay,
          charge: Math.random() * 25 + 5,
          color: color,
          gravity: Math.random() * 0.03 + 0.012, // light gravitational pull
          friction: Math.random() * 0.02 + 0.94, // air friction
          waveSpeed: Math.random() * 0.08 + 0.02,
          wavePhase: Math.random() * Math.PI * 2
        });
      }
    };

    // Trigger three gorgeous, slightly staggered premium bursts!
    launchBurst(width / 2, height * 0.45, 120); // Central focus burst
    setTimeout(() => {
      launchBurst(width * 0.35, height * 0.5, 60); // Left satellite burst
    }, 250);
    setTimeout(() => {
      launchBurst(width * 0.65, height * 0.5, 60); // Right satellite burst
    }, 450);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw all current active gold dust elements
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physical laws of slow drag motion
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;

        // Dynamic fluid wave oscillations to simulate drifting pollen/gold dust flakes
        p.wavePhase += p.waveSpeed;
        const waveOffset = Math.sin(p.wavePhase) * 0.15;
        p.x += p.vx + waveOffset;
        p.y += p.vy;

        // Particle fade decay
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw glittering specular core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;

        // Glow bloom filter effect
        ctx.shadowBlur = p.radius * 4.5;
        ctx.shadowColor = "#fbbf24";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-40"
      style={{ mixBlendMode: "screen" }}
      id="gold-dust-burst-canvas"
    />
  );
}
