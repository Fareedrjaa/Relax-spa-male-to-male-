/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Check, 
  Sparkles, 
  Droplet, 
  Compass, 
  BookOpen, 
  TrendingUp, 
  Plus, 
  Flame, 
  Zap, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle,
  Heart
} from "lucide-react";
import { useFirebase } from "./FirebaseContext";
import { collection, doc, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";

interface Habit {
  id: string;
  name: string;
  points: number;
  icon: any;
  colorClass: string;
  iconColor: string;
  description: string;
  quantumText: string;
}

interface HabitLog {
  id?: string;
  userId: string;
  activity: string;
  date: string;
  rewardPoints: number;
  createdAt: string;
}

interface WellnessHabitTrackerProps {
  loyaltyPoints: number;
  onEarnPoints: (points: number, activityName: string) => Promise<void>;
}

export default function WellnessHabitTracker({ loyaltyPoints, onEarnPoints }: WellnessHabitTrackerProps) {
  const { user } = useFirebase();
  const [completedToday, setCompletedToday] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [congratulatoryMessage, setCongratulatoryMessage] = useState<string | null>(null);

  // Dynamic Bangalore regional premium wellness habits
  const HABITS: Habit[] = [
    {
      id: "meditation",
      name: "Zen Meditation",
      points: 15,
      icon: Compass,
      colorClass: "from-amber-500/10 to-amber-600/5 hover:border-amber-500/35 border-stone-900",
      iconColor: "text-amber-500",
      description: "10 minutes of deep neural decompression and conscious box-breathing choreography.",
      quantumText: "+15 Points"
    },
    {
      id: "hydration",
      name: "Cellular Hydration",
      points: 10,
      icon: Droplet,
      colorClass: "from-blue-500/10 to-blue-600/5 hover:border-blue-500/35 border-stone-900",
      iconColor: "text-blue-400",
      description: "Consumed 8 glasses of pure mineral water to purify tissue toxins and optimize circulation.",
      quantumText: "+10 Points"
    },
    {
      id: "stretching",
      name: "Prakriti Spinal Stretch",
      points: 10,
      icon: Heart,
      colorClass: "from-emerald-500/10 to-emerald-600/5 hover:border-emerald-500/35 border-stone-900",
      iconColor: "text-emerald-400",
      description: "6 minutes of physical decontraction stretching targeting tight lumbar and subscapular regions.",
      quantumText: "+10 Points"
    },
    {
      id: "journaling",
      name: "Somatic Reflection",
      points: 15,
      icon: BookOpen,
      colorClass: "from-purple-500/10 to-purple-600/5 hover:border-purple-500/35 border-stone-900",
      iconColor: "text-purple-400",
      description: "Wrote down mental inventory and emotional insights to reset negative cognitive loops.",
      quantumText: "+15 Points"
    }
  ];

  // Securely get local date representation matching the user's timezone grid
  const getLocalDateString = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split("T")[0];
  };

  const todayStr = getLocalDateString();

  // Load user's habit completions for today from Firestore users/{userId}/habitLogs
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const subCollRef = collection(db, "users", user.uid, "habitLogs");
    const q = query(subCollRef, where("date", "==", todayStr));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const completed: Record<string, boolean> = {};
      snapshot.forEach((doc) => {
        const log = doc.data() as HabitLog;
        completed[log.activity] = true;
      });
      setCompletedToday(completed);
      setLoading(false);
    }, (error) => {
      console.warn("Failed to listen to habit logs in cloud:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, todayStr]);

  // Execute habit entry and fire points trigger
  const handleLogHabit = async (habit: Habit) => {
    if (completedToday[habit.id]) return;

    // Trigger parent points callback immediately for active interface feedback
    setCompletedToday(prev => ({ ...prev, [habit.id]: true }));
    setCongratulatoryMessage(`Elite lifestyle unlocked! You earned +${habit.points} Points for logging ${habit.name}.`);
    
    // Play celebratory sound, and add stats via callback
    await onEarnPoints(habit.points, habit.name);

    // Save to Firestore if authenticated
    if (user) {
      const logPath = `users/${user.uid}/habitLogs`;
      try {
        const subCollRef = collection(db, "users", user.uid, "habitLogs");
        const logPayload: HabitLog = {
          userId: user.uid,
          activity: habit.id,
          date: todayStr,
          rewardPoints: habit.points,
          createdAt: new Date().toISOString()
        };
        await addDoc(subCollRef, logPayload);
      } catch (err) {
        console.warn("Could not write daily habit log entry to firestore:", err);
      }
    }

    // Auto clear congratulatory popup in 4 seconds
    setTimeout(() => {
      setCongratulatoryMessage(null);
    }, 4500);
  };

  const completedCount = Object.values(completedToday).filter(Boolean).length;
  const currentStreak = completedCount > 0 ? 1 : 0; // Simulated active visual value

  return (
    <div className="bg-stone-900/20 border border-stone-850 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden" id="daily-wellness-habit-tracker-portlet">
      {/* Decorative gradient radial background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-emerald-500/[0.02]/[0.025] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-tr from-cyan-500/[0.015] to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Title Segment */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5 text-left">
          <div className="flex items-center space-x-1.5 text-[9.5px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>DAILY ENGAGEMENT LEDGER</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif font-light text-slate-100 tracking-wide">
            Daily Wellness Habit Tracker
          </h4>
          <p className="text-stone-400 text-xs max-w-xl leading-relaxed">
            Nurture your mental and physical longevity. Complete self-healing micro-activities below daily to collect instant, incremental loyalty points toward higher tier discounts.
          </p>
        </div>

        {/* Real-time habits status panel */}
        <div className="flex items-center space-x-4 bg-stone-950/80 p-3.5 border border-stone-900 rounded-2xl shrink-0 font-mono">
          <div className="text-left">
            <span className="text-[8px] text-stone-500 uppercase block tracking-wide">Today's Progress</span>
            <span className="text-sm font-extrabold text-slate-100 tracking-tight">{completedCount}/4 Completed</span>
          </div>
          <div className="w-px h-8 bg-stone-900" />
          <div className="text-left text-xs">
            <span className="text-[8px] text-stone-500 uppercase block tracking-wide">ACTIVE STREAK</span>
            <span className="text-xs text-emerald-400 font-bold block flex items-center">
              <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0 mr-1" />
              {completedCount === 4 ? "1 Day (Max Master)" : completedCount > 0 ? "1 Day Active" : "Log to start"}
            </span>
          </div>
        </div>
      </div>

      {/* Floating feedback popup */}
      <AnimatePresence>
        {congratulatoryMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl flex items-center space-x-3 text-xs text-emerald-400 font-sans font-medium text-left"
          >
            <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="flex-1">{congratulatoryMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Micro Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HABITS.map((habit) => {
          const isDone = completedToday[habit.id] || false;
          const HabitIcon = habit.icon;

          return (
            <div
              key={habit.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 text-left relative overflow-hidden bg-gradient-to-b ${
                isDone 
                  ? "bg-stone-950/40 border-stone-900 opacity-65" 
                  : `bg-stone-950/80 ${habit.colorClass}`
              }`}
            >
              {/* Completed visual badge overlay */}
              {isDone && (
                <div className="absolute top-0 right-0 bg-emerald-500/10 border-l border-b border-emerald-500/20 text-[8px] font-mono text-emerald-400 px-2 py-1 font-bold rounded-bl-xl uppercase tracking-wider flex items-center space-x-1 shadow-md">
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Done</span>
                </div>
              )}

              <div className="space-y-2.5">
                {/* Icon row */}
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 bg-stone-900/90 rounded-xl border border-stone-850 ${habit.iconColor}`}>
                    <HabitIcon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${isDone ? "text-stone-500" : habit.iconColor}`}>
                    {habit.quantumText}
                  </span >
                </div>

                <div className="space-y-1">
                  <h5 className="font-sans font-bold text-slate-100 text-sm leading-tight">
                    {habit.name}
                  </h5>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    {habit.description}
                  </p>
                </div>
              </div>

              {/* Log Button */}
              <div>
                {isDone ? (
                  <div className="w-full py-2 bg-stone-900 border border-stone-850 rounded-xl font-mono text-[9px] uppercase text-stone-500 text-center tracking-widest flex items-center justify-center space-x-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Logged in Wellness Ledger</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleLogHabit(habit)}
                    className="w-full py-2.5 bg-stone-900 border border-stone-800 hover:border-slate-700/60 text-slate-350 hover:text-slate-105 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1 hover:bg-stone-850 active:scale-98"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Daily Completion</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!user && (
        <div className="flex items-center space-x-2 text-[10px] font-mono text-stone-500 pt-3 border-t border-stone-900/60 justify-center">
          <ShieldCheck className="w-4 h-4 text-stone-600" />
          <span>Demo state actively tracking. Log in with Google to back up daily self-healing habits.</span>
        </div>
      )}
    </div>
  );
}
