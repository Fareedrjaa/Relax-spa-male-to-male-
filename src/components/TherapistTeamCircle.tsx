/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ShieldCheck, Heart, User, Award, CheckCircle, ArrowUpRight } from "lucide-react";

interface Therapist {
  id: string;
  name: string;
  role: string;
  desc: string;
  stars: number;
  specialty: string[];
  avatarColor: string;
  experience: string;
}

const THERAPISTS: Therapist[] = [
  {
    id: "th-1",
    name: "Anuj Sen",
    role: "Senior Ayurvedic Decompression Therapist",
    desc: "14+ years studying ancient Abhyanga hot herbal oil streams and spinal point decompression.",
    stars: 5,
    specialty: ["Ayurveda", "Hot Herbal Oils", "Deep Spinal Relief"],
    avatarColor: "from-amber-400 to-orange-600",
    experience: "14 Years Exp"
  },
  {
    id: "th-2",
    name: "Vikram Reddy",
    role: "Master Swedish & Volcanic Stone Glider",
    desc: "Expert in focal muscle effleurage, sweeping forearm glides, and heated basalt rock alignment.",
    stars: 5,
    specialty: ["Swedish Massage", "Basalt Stone Decompression", "Sports Rehabilitation"],
    avatarColor: "from-violet-500 to-indigo-700",
    experience: "9 Years Exp"
  },
  {
    id: "th-3",
    name: "Aditya Hegde",
    role: "Deep Tissue & Remedial Stretch Expert",
    desc: "Focused on muscle knot releases, passive Thai stretching curves, and trigger-point decompression.",
    stars: 5,
    specialty: ["Deep Tissue", "Trigger Releases", "Thai Stretching"],
    avatarColor: "from-teal-400 to-emerald-600",
    experience: "11 Years Exp"
  },
  {
    id: "th-4",
    name: "Rohan Kaushik",
    role: "Holistic Shiatsu & Head Reflexologist",
    desc: "Specialized in cranial sinus relief, herbal steam inhalation alignments, and herbal head massage.",
    stars: 5,
    specialty: ["Cranial Reflexology", "Shiatsu Accupressure", "Stress Dissolving"],
    avatarColor: "from-amber-300 via-yellow-400 to-rose-500",
    experience: "8 Years Exp"
  }
];

export default function TherapistTeamCircle({ onSelectBooking }: { onSelectBooking?: (serviceName?: string) => void }) {
  const [activeId, setActiveId] = useState(THERAPISTS[0].id);
  const [orbitAngle, setOrbitAngle] = useState(0);

  // Slow continuous orbital rotation if user is just viewing
  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitAngle((prev) => (prev + 0.35) % 360);
    }, 45); // highly smooth continuous orbit
    return () => clearInterval(interval);
  }, []);

  const activeTherapist = THERAPISTS.find((t) => t.id === activeId) || THERAPISTS[0];

  return (
    <div className="space-y-8" id="therapist-circular-team-wrapper">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">COUNCIL OF HEALERS</span>
        <h3 className="text-2xl font-serif font-light text-slate-100 tracking-wide block uppercase">
          Master Therapists Circle
        </h3>
        <p className="text-stone-400 text-xs max-w-xl mx-auto leading-relaxed">
          Hover or click on any circular master avatar below. They revolve dynamically to demonstrate systemic fluidity, holistic wellness care, and technical mastery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-4">
        
        {/* LEFT COMPONENT: THE CYCLIC ORBITING STAGE */}
        <div className="md:col-span-6 flex items-center justify-center relative min-h-[300px]">
          
          {/* Circular Orbit Ring boundaries */}
          <div className="absolute w-56 h-56 rounded-full border border-stone-900 flex items-center justify-center">
            {/* Dashed outer gold line */}
            <div className="absolute inset-[-12px] rounded-full border border-dashed border-amber-500/10 pointer-events-none animate-[spine_30s_linear_infinite]" />
            <div className="absolute inset-[-4px] rounded-full border border-stone-850 pointer-events-none" />
          </div>

          {/* Central Solar Lotus Logo emitting heavy lighting core */}
          <div className="relative w-24 h-24 bg-stone-950/95 border-2 border-amber-500/15 rounded-full z-10 flex items-center justify-center p-3 shadow-[0_0_40px_rgba(245,158,11,0.18)]">
            <div className="absolute inset-1.5 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full animate-ping" />
            <svg viewBox="0 0 40 40" className="w-10 h-10 text-amber-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)] animate-[spin_10s_linear_infinite]">
              <path d="M 20 4 C 15 16, 16 24, 20 36 C 24 24, 25 16, 20 4 Z" fill="currentColor" />
              <path d="M 4 20 C 16 15, 24 16, 36 20 C 24 24, 16 25, 4 20 Z" fill="currentColor" className="opacity-60" />
            </svg>
            <span className="absolute -bottom-1 text-[7px] font-mono font-bold text-amber-400 bg-stone-950 border border-stone-850 px-1 rounded">VIP RING</span>
          </div>

          {/* Revolving items representing therapist nodes */}
          {THERAPISTS.map((th, index) => {
            // Distribute on circle (total 360 degrees divided by length)
            const angleDeg = (index * (360 / THERAPISTS.length) + orbitAngle) % 360;
            const angleRad = (angleDeg * Math.PI) / 180;
            const radius = 100; // orbit radius in pixels

            // Coordinate offsets from center
            const x = Math.cos(angleRad) * radius;
            const y = Math.sin(angleRad) * radius;

            const isCurrent = th.id === activeId;

            return (
              <motion.button
                key={th.id}
                style={{
                  left: `calc(50% + ${x}px - 22px)`,
                  top: `calc(50% + ${y}px - 22px)`
                }}
                onMouseEnter={() => setActiveId(th.id)}
                onClick={() => setActiveId(th.id)}
                className={`absolute w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isCurrent 
                    ? "scale-125 z-20 shadow-[0_0_20px_rgba(245,158,11,0.45)] border-2 border-amber-500" 
                    : "border border-stone-800 hover:border-amber-500/30 scale-100 hover:scale-110 z-10"
                }`}
                id={`therapist-${th.id}`}
              >
                {/* Circular profile layout with custom avatar vector */}
                <div className={`w-full h-full rounded-full bg-gradient-to-tr ${th.avatarColor} p-0.5`}>
                  <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center overflow-hidden">
                    {/* Render first initial letter styled inside circle */}
                    <span className="text-[11px] font-mono font-bold text-slate-100 uppercase tracking-widest">{th.name[0]}</span>
                  </div>
                </div>

                {/* Sparkling mini outer ring indicator for active index */}
                {isCurrent && (
                  <div className="absolute inset-[-4px] border border-dashed border-amber-500/40 rounded-full animate-spin pointer-events-none" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* RIGHT COMPONENT: ACTIVE DETAILED MASTER CARD */}
        <div className="md:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTherapist.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="bg-stone-900/35 border border-stone-850 p-6 rounded-2xl relative overflow-hidden shadow-2xl space-y-4"
            >
              {/* Back ambient lighting block */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-amber-500 font-mono text-[9px] uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{activeTherapist.experience} • Verified Staff</span>
                  </div>
                  <h4 className="text-xl font-sans font-bold text-slate-100">{activeTherapist.name}</h4>
                  <p className="text-stone-500 text-[10px] font-mono leading-none">{activeTherapist.role}</p>
                </div>

                {/* Rating score badge */}
                <div className="flex items-center space-x-0.5 bg-stone-950/80 px-2.5 py-1 border border-stone-850 rounded-xl text-amber-500 text-xs font-mono font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                  <span>5.0</span>
                </div>
              </div>

              <div className="h-px bg-stone-850" />

              <p className="text-stone-400 text-xs leading-relaxed">
                "{activeTherapist.desc}"
              </p>

              {/* Specialization pills list */}
              <div className="space-y-2">
                <span className="text-[8px] font-mono uppercase text-stone-500 block">Qualified Expert Areas:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeTherapist.specialty.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-2 py-0.5 bg-stone-950 border border-stone-850 rounded-lg text-[9px] font-mono text-slate-300 uppercase tracking-widest flex items-center"
                    >
                      <CheckCircle className="w-2.5 h-2.5 text-emerald-500 mr-1 shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book directly action */}
              <div className="pt-2">
                <button
                  onClick={() => onSelectBooking?.(activeTherapist.name)}
                  className="w-full py-2.5 bg-gradient-to-r from-stone-900 to-stone-950 hover:from-amber-500 hover:to-amber-600 border border-stone-850 hover:border-transparent text-slate-300 hover:text-stone-950 text-xs tracking-wider uppercase font-extrabold font-mono rounded-xl transition-all cursor-pointer shadow-md inline-flex items-center justify-center space-x-1"
                >
                  <span>Request {activeTherapist.name.split(" ")[0]} directly</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
