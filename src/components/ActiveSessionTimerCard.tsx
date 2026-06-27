/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Clock, Play, Check, AlertCircle, Sparkles, Zap, ToggleLeft, ToggleRight } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { Booking } from "../types";

export default function ActiveSessionTimerCard({ booking }: { booking: Booking; key?: any }) {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(100);
  const [fastMode, setFastMode] = useState<boolean>(true); // Default to fast testing mode for instant confirmation
  const [isActivating, setIsActivating] = useState(false);

  // Tick calculation logic
  useEffect(() => {
    if (booking.status !== "active" || !booking.activatedAt) {
      setTimeLeftSeconds(null);
      return;
    }

    const durationMin = booking.durationMinutes || 60;
    const totalDurationSeconds = durationMin * 60;

    const interval = setInterval(() => {
      const startTime = new Date(booking.activatedAt!).getTime();
      const now = new Date().getTime();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, totalDurationSeconds - elapsedSeconds);

      setTimeLeftSeconds(remaining);

      const computedProgress = (remaining / totalDurationSeconds) * 100;
      setProgressPercent(computedProgress);

      // Auto-complete session if timer runs out in real time
      if (remaining <= 0) {
        clearInterval(interval);
        handleSetCompleted();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking.status, booking.activatedAt, booking.durationMinutes]);

  const handleStartSession = async (chosenDuration: number) => {
    setIsActivating(true);
    try {
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, {
        status: "active",
        activatedAt: new Date().toISOString(),
        durationMinutes: chosenDuration
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `bookings/${booking.id}`);
    } finally {
      setIsActivating(false);
    }
  };

  const handleSetCompleted = async () => {
    try {
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, {
        status: "completed"
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `bookings/${booking.id}`);
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (booking.status === "confirmed") {
    return (
      <div className="p-4 bg-stone-900/40 border border-stone-850 rounded-xl space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-stone-300 font-mono text-[10px] tracking-wider uppercase">
              <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Pending Intake</span>
            </div>
            <p className="font-sans font-bold text-slate-200 text-xs">
              {booking.customerName} &mdash; <span className="text-amber-400">{booking.selectedService}</span>
            </p>
          </div>

          <div className="flex items-center space-x-1.5 bg-stone-950 p-1.5 border border-stone-850 rounded-lg">
            <span className="text-[8px] font-mono text-stone-500 uppercase px-1">Testing Fast Mode</span>
            <button
              onClick={() => setFastMode(!fastMode)}
              className="text-amber-500 hover:text-amber-400 cursor-pointer"
              title="Toggle to 1 Min fast countdown or standard 60 Min countdown"
            >
              {fastMode ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5 text-stone-600" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => handleStartSession(fastMode ? 1 : 60)}
            disabled={isActivating}
            className="col-span-2 py-2 px-3 bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 border border-amber-500/35 text-amber-400 hover:text-amber-300 text-[10px] font-mono uppercase tracking-widest rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.08)] active:scale-98"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isActivating ? "Initializing..." : `Activate Session (${fastMode ? "1m Fast Test" : "60m Real Time"})`}</span>
          </button>
        </div>
      </div>
    );
  }

  // Active status showing live feedback
  if (booking.status === "active") {
    return (
      <div className="p-4 bg-gradient-to-b from-stone-900 to-stone-950 border border-emerald-500/20 rounded-xl space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.05)] relative overflow-hidden">
        {/* Pulsing state aura */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-2xl pointer-events-none animate-pulse" />

        <div className="flex justify-between items-center relative z-10">
          <div className="space-y-0.5">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[8.5px] font-mono uppercase font-semibold tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
              Live Therapy Session
            </span>
            <p className="font-sans font-extrabold text-slate-100 text-xs mt-1">
              Guest: {booking.customerName}
            </p>
            <p className="text-[10px] text-stone-400">
              Therapy: <span className="text-amber-400 font-medium">{booking.selectedService}</span>
            </p>
          </div>

          {/* Sizable Digital Glow Clock */}
          <div className="text-right">
            <span className="text-[8px] font-mono text-stone-500 block uppercase tracking-wide">Time Remaining</span>
            <span className="text-lg font-mono font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)] tracking-wider">
              {timeLeftSeconds !== null ? formatTime(timeLeftSeconds) : "--:--"}
            </span>
          </div>
        </div>

        {/* High-fidelity glowing progress bar */}
        <div className="space-y-1 relative z-10">
          <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden border border-stone-900">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
              style={{ width: `${progressPercent}%` }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-[8px] font-mono text-stone-500">
            <span>STARTING INTAKE</span>
            <span>COMPLETION TIME</span>
          </div>
        </div>

        <button
          onClick={handleSetCompleted}
          className="w-full py-1.5 bg-stone-900 border border-stone-800 hover:border-emerald-500/30 text-stone-300 hover:text-emerald-400 text-[9px] font-mono uppercase tracking-widest rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer active:scale-98"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Stop & Log Completed Session</span>
        </button>
      </div>
    );
  }

  // Session has been completed
  if (booking.status === "completed") {
    return (
      <div className="p-3.5 bg-stone-950/70 border border-stone-900 rounded-xl flex items-center justify-between text-xs transition-all relative">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1 text-stone-500 font-mono text-[8px] uppercase tracking-wide">
            <Check className="w-3 h-3 text-emerald-500" />
            <span>Therapy Logged</span>
          </div>
          <p className="font-bold text-stone-400 line-through">
            {booking.selectedService}
          </p>
          <p className="text-[9px] text-stone-600 font-mono">
            Client: {booking.customerName} &bull; Session completed
          </p>
        </div>
        <div className="px-2.5 py-1 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-[8px] font-mono uppercase rounded font-bold tracking-wider">
          Done
        </div>
      </div>
    );
  }

  return null;
}
