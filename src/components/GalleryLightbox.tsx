/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Star, ShieldCheck, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import ProceduralAestheticIllustration from "./ProceduralAestheticIllustration";

export interface GalleryItem {
  id: string; // matches id used in vector illustration
  title: string;
  tag: string;
  desc: string;
  materials: string[];
  specs: { label: string; value: string }[];
  review: { author: string; text: string; location: string };
}

interface GalleryLightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onBook: () => void;
}

export default function GalleryLightbox({ item, onClose, onBook }: GalleryLightboxProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6" id="gallery-theatrical-lightbox-modal">
        {/* Soft immersive dark backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-stone-950/95 backdrop-blur-md cursor-pointer"
        />

        {/* Cinematic Main Double-Pane container Box */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 180 }}
          className="relative w-full max-w-4xl bg-stone-900 border border-stone-850 rounded-[30px] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto scrollbar-thin z-10 grid grid-cols-1 md:grid-cols-12"
        >
          {/* Close trigger button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-stone-950/80 hover:bg-stone-950 border border-stone-800 hover:border-amber-500/30 text-stone-400 hover:text-amber-400 flex items-center justify-center transition-all cursor-pointer"
            title="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT COLUMN: THE VISUAL VECTOR DISPLAY (Colspan 6) */}
          <div className="md:col-span-6 bg-stone-950 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-850 relative min-h-[320px] md:min-h-auto">
            {/* Ambient gold glow back layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-500/[0.02] to-transparent pointer-events-none" />

            <div className="space-y-1 z-10">
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-amber-500 uppercase tracking-widest font-extrabold mb-1">
                <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                <span>Sanctuary Blueprint</span>
              </div>
              <span className="px-3 py-1 bg-stone-900 border border-stone-850 text-slate-300 font-mono text-[9px] rounded-lg tracking-wider inline-block">
                {item.tag}
              </span>
            </div>

            {/* Scale up vector dynamic illustration rendering */}
            <div className="my-8 flex items-center justify-center relative scale-110">
              <div className="w-full max-w-[280px]">
                <ProceduralAestheticIllustration id={item.id} />
              </div>
            </div>

            <div className="space-y-2 z-10 bg-stone-900/40 p-4 border border-stone-850/50 rounded-2xl">
              <div className="flex items-center text-amber-500 space-x-1">
                <Star className="w-3 h-3 fill-amber-500" />
                <Star className="w-3 h-3 fill-amber-500" />
                <Star className="w-3 h-3 fill-amber-500" />
                <Star className="w-3 h-3 fill-amber-500" />
                <Star className="w-3 h-3 fill-amber-500" />
                <span className="text-[10px] font-mono text-stone-400 ml-1.5 font-bold">5.0 Customer Rating</span>
              </div>
              <p className="text-[11px] font-serif italic text-stone-300 leading-relaxed">
                "{item.review.text}"
              </p>
              <div className="flex justify-between items-center text-[9px] font-mono text-stone-500 pt-1">
                <span>— {item.review.author}</span>
                <span>{item.review.location}</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STRUCTURAL INFORMATION & SCHEDULING DETAILS (Colspan 6) */}
          <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-5">
              {/* Title Header */}
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-stone-500 uppercase tracking-[0.2em] block">CHAMBER ARCHITECTURE</span>
                <h3 className="text-2xl font-serif font-bold text-slate-100 tracking-wide leading-tight">
                  {item.title}
                </h3>
              </div>

              {/* Core Description text */}
              <p className="text-stone-400 text-xs leading-relaxed">
                {item.desc}
              </p>

              <div className="h-px bg-stone-850" />

              {/* Verified technical specs list */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">Spatial Dimensions & Diagnostics</h5>
                <div className="grid grid-cols-2 gap-3.5">
                  {item.specs.map((spec, i) => (
                    <div key={i} className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-850/60">
                      <span className="text-[8px] font-mono text-stone-500 uppercase block">{spec.label}</span>
                      <span className="text-xs text-slate-200 mt-1 font-semibold block">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Natural materials layout */}
              <div className="space-y-2">
                <h5 className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Incorporated Bio-Materials:</h5>
                <div className="flex flex-wrap gap-1.5">
                  {item.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-stone-950/80 border border-stone-850 text-[10px] text-stone-300 font-mono rounded"
                    >
                      • {mat}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Direct Booking action with VIP fast-route highlights */}
            <div className="space-y-4 pt-4 border-t border-stone-800">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Sanitized in-between every single session reservation</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  className="py-3 px-4 bg-stone-950 hover:bg-stone-850 border border-stone-850 text-stone-400 hover:text-slate-200 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-center transition-colors cursor-pointer"
                >
                  Back to Album
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onBook();
                  }}
                  className="py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 rounded-xl text-xs font-sans font-bold uppercase tracking-wider text-center transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Book Visit Now</span>
                  <ArrowRight className="w-3.5 h-3.5 fill-stone-950" />
                </button>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
