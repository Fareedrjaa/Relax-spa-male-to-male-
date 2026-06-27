/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    // Track particles for cinematic levitation flow
    const particleCount = 70; // High-end balanced particle count
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      baseSpeedY: number;
      baseSize: number;
    }> = [];

    const colors = [
      "rgba(245, 158, 11, ", // Amber Gold
      "rgba(251, 191, 36, ", // Champagne Gold
      "rgba(217, 119, 6, ",  // Darker Bronze Gold
      "rgba(139, 92, 246, "  // Beautiful Violet Mystique (creates cosmic luxury vibe)
    ];

    // Gold Dust swarm particles that dynamically orbit the cursor with fluid-dynamic physics
    const goldDustCount = 85;
    const goldDust: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      color: string;
      angle: number;
      orbitSpeed: number;
      orbitRadius: number;
      noiseOffset: number;
    }> = [];

    const goldDustColors = [
      "rgba(251, 191, 36, ",  // Champagne Gold
      "rgba(245, 158, 11, ",  // Amber Gold
      "rgba(212, 175, 55, ",  // Metallic Pale Gold (#d4af37)
      "rgba(255, 253, 240, "   // Brilliant Warm Light Gold
    ];

    const createParticle = (initY = false) => {
      const pColor = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 2.8 + 0.6;
      const speedY = -(Math.random() * 0.5 + 0.15); // gentle base rise
      return {
        x: Math.random() * width,
        y: initY ? Math.random() * height : height + 15,
        size: size,
        baseSize: size,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: speedY,
        baseSpeedY: speedY,
        color: pColor,
        alpha: Math.random() * 0.6 + 0.25
      };
    };

    const createGoldDust = (initRandom = true) => {
      const color = goldDustColors[Math.floor(Math.random() * goldDustColors.length)];
      const size = Math.random() * 1.5 + 0.4; // ultra-fine glowing specs
      const baseAlpha = Math.random() * 0.65 + 0.25;
      return {
        x: initRandom ? Math.random() * width : mouse.x + (Math.random() - 0.5) * 50,
        y: initRandom ? Math.random() * height : mouse.y + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: size,
        alpha: baseAlpha,
        baseAlpha: baseAlpha,
        color: color,
        angle: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() * 0.02 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
        orbitRadius: Math.random() * 75 + 15,
        noiseOffset: Math.random() * 2000
      };
    };

    // Pre-populate particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    // Pre-populate gold dust
    for (let i = 0; i < goldDustCount; i++) {
      goldDust.push(createGoldDust(true));
    }

    // Real-time Mouse interactions for Antigravity Deflection & Swipe wake
    const mouse = { x: -2000, y: -2000, radius: 175 };
    const mouseVel = { x: 0, y: 0, prevX: 0, prevY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate cursor vector velocity
      if (mouse.x !== -2000) {
        mouseVel.x = e.clientX - mouseVel.prevX;
        mouseVel.y = e.clientY - mouseVel.prevY;
      }
      mouseVel.prevX = e.clientX;
      mouseVel.prevY = e.clientY;

      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -2000;
      mouse.y = -2000;
      mouseVel.x = 0;
      mouseVel.y = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width || window.innerWidth;
        height = canvas.height = entry.contentRect.height || window.innerHeight;
      }
    });
    
    resizeObserver.observe(document.body);

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Check if global Antigravity Mode is enabled by checking window state dynamically
      const isHighAntigravity = (window as any).antigravityPower === true;

      // Draw global atmospheric floating elements
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply global Antigravity boost
        let currentSpeedY = p.baseSpeedY;
        let currentSize = p.baseSize;
        if (isHighAntigravity) {
          currentSpeedY = p.baseSpeedY * 4.2; // rapid ascension
          currentSize = p.baseSize * 1.5; // glowing expansion
        }

        p.x += p.speedX;
        p.y += currentSpeedY;

        // Apply interactive Antigravity cursor deflection physics
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Subtly repel outwards and launch upwards (gravity inversion)
          p.x += (dx / dist) * force * 4.5;
          p.y -= force * 4.8;
        }

        // Horizontal boundaries wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
        
        // Gradient color shifts if high antigravity is on
        const alphaStr = isHighAntigravity ? `${p.alpha * 1.4}` : `${p.alpha}`;
        ctx.fillStyle = `${p.color}${alphaStr})`;
        
        ctx.shadowBlur = currentSize * (isHighAntigravity ? 7 : 4);
        ctx.shadowColor = p.color === colors[3] ? "#8b5cf6" : "#f59e0b";
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for performance

        // Recycle particles passing top
        if (p.y < -20) {
          particles[i] = createParticle(false);
        }
      }

      // Draw interactive interactive Gold Dust Swarm elements
      const mouseActive = mouse.x !== -2000;

      for (let i = 0; i < goldDust.length; i++) {
        const gd = goldDust[i];

        if (mouseActive) {
          // Progress circular orbit angle
          gd.angle += gd.orbitSpeed;

          // Target is a circular orbit around the cursor with minor organic wave offset
          const wave = Math.sin(gd.angle * 2.5 + gd.noiseOffset) * 15;
          const targetX = mouse.x + Math.cos(gd.angle) * (gd.orbitRadius + wave);
          const targetY = mouse.y + Math.sin(gd.angle) * (gd.orbitRadius + wave);

          // Spring force towards target
          const dx = targetX - gd.x;
          const dy = targetY - gd.y;

          gd.vx += dx * 0.038;
          gd.vy += dy * 0.038;

          // Introduce swipe breeze velocity if particle is close to the cursor path
          const distToCursor = Math.sqrt((gd.x - mouse.x) ** 2 + (gd.y - mouse.y) ** 2);
          if (distToCursor < 110) {
            gd.vx += mouseVel.x * 0.06;
            gd.vy += mouseVel.y * 0.06;
          }

          // Damping to keep elegant, stable trailing flow
          gd.vx *= 0.83;
          gd.vy *= 0.83;

          // Highlight and amplify glow near cursor
          gd.alpha = Math.min(gd.baseAlpha * 1.35, 0.95);
        } else {
          // Drifts ambiently floating upwards when cursor is absent
          gd.vx += Math.sin(gd.angle + gd.noiseOffset) * 0.015;
          gd.vy += (Math.cos(gd.angle + gd.noiseOffset) * 0.015) - 0.012; // gentle upward drift

          gd.vx *= 0.95;
          gd.vy *= 0.95;

          gd.alpha = gd.baseAlpha;
        }

        gd.x += gd.vx;
        gd.y += gd.vy;

        // Canvas limits wrap
        if (gd.x < -15) gd.x = width + 15;
        if (gd.x > width + 15) gd.x = -15;
        if (gd.y < -15) gd.y = height + 15;
        if (gd.y > height + 15) gd.y = -15;

        // Render glowing golden dust
        ctx.beginPath();
        ctx.arc(gd.x, gd.y, gd.size, 0, Math.PI * 2);
        ctx.fillStyle = `${gd.color}${gd.alpha})`;

        ctx.shadowBlur = gd.size * 3.8;
        ctx.shadowColor = "#fbbf24";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Smoothly decay mouse velocities in canvas frame ticks
      mouseVel.x *= 0.88;
      mouseVel.y *= 0.88;

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      id="ambient-particle-canvas"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-radial from-stone-950 via-zinc-950 to-neutral-950"
    />
  );
}
