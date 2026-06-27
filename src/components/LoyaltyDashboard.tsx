/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Zap, Check, Gift, ArrowRight, ShieldCheck, Sparkles, Copy, Info, CheckCircle, Flame, Server, AwardIcon, Sparkle } from "lucide-react";
import { useFirebase } from "./FirebaseContext";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import GoldDustBurst from "./GoldDustBurst";
import WellnessHoursChart from "./WellnessHoursChart";
import WellnessHabitTracker from "./WellnessHabitTracker";

export default function LoyaltyDashboard() {
  const { user } = useFirebase();
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(150); // Default simulated starting points
  const [isLoading, setIsLoading] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null);
  const [earnFeedback, setEarnFeedback] = useState(false);
  const [showPlatinumLevelUp, setShowPlatinumLevelUp] = useState(false);

  const prevPointsRef = useRef<number | null>(null);

  // High-fidelity synthesized celestial chime representing prime wellness luxury
  const playLuxuryChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      const now = audioCtx.currentTime;

      const playNote = (freq: number, startTime: number, duration: number, volume: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        // Exponential luxury bell release curve
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Premium chime sequence: Eb5 (622.25Hz) -> Ab5 (830.61Hz) -> C6 (1046.50Hz) -> Eb6 (1244.51Hz) -> Ab6 (1661.22Hz)
      // This forms a gorgeous, sparkling Ab Major pentatonic ascension that sounds profoundly pure and upscale.
      playNote(622.25, now, 1.6, 0.08);
      playNote(830.61, now + 0.12, 1.8, 0.09);
      playNote(1046.50, now + 0.24, 2.2, 0.11);
      playNote(1244.51, now + 0.36, 2.5, 0.13);
      playNote(1661.22, now + 0.48, 3.0, 0.07);

    } catch (e) {
      console.warn("Celestial audio chime was muted or context is blocked by user gesture rules.", e);
    }
  };

  // Observe and trigger level-up effects
  useEffect(() => {
    if (prevPointsRef.current !== null) {
      const prev = prevPointsRef.current;
      // Transitions from Gold (300-599 points) to Platinum (>= 600 points)
      if (prev >= 300 && prev < 600 && loyaltyPoints >= 600) {
        playLuxuryChime();
        setShowPlatinumLevelUp(true);
      }
    }
    prevPointsRef.current = loyaltyPoints;
  }, [loyaltyPoints]);

  // Load points from Firestore users collection if user is authenticated
  useEffect(() => {
    if (!user) return;

    const fetchUserPoints = async () => {
      setIsLoading(true);
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (typeof data.loyaltyPoints === "number") {
            setLoyaltyPoints(data.loyaltyPoints);
          } else {
            // First time initializer
            await updateDoc(userDocRef, { loyaltyPoints: 150 });
            setLoyaltyPoints(150);
          }
        } else {
          // Document non-existent yet (race condition where auth state changed before profile save finishes).
          // We solve this by writing a valid complete user data packet with default 150 points.
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || "Bengaluru Gentleman",
            photoURL: user.photoURL || "",
            createdAt: new Date().toISOString(),
            loyaltyPoints: 150
          }, { merge: true });
          setLoyaltyPoints(150);
        }
      } catch (error) {
        console.error("Error reading loyalty points: ", error);
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPoints();
  }, [user]);

  // Handle syncing points back to Firestore to ensure durable cloud persistence
  const syncPointsToCloud = async (newPoints: number) => {
    setLoyaltyPoints(newPoints);
    if (!user) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      // Ensure the synchronized document is schema compliant under all circumstances
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "Bengaluru Gentleman",
        photoURL: user.photoURL || "",
        createdAt: new Date().toISOString(),
        loyaltyPoints: newPoints
      }, { merge: true });
    } catch (error) {
      console.warn("Failed to backup points to cloud:", error);
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleEarnSimulatedPoints = async (amt = 100) => {
    const nextPoints = loyaltyPoints + amt;
    setEarnFeedback(true);
    await syncPointsToCloud(nextPoints);
    setTimeout(() => setEarnFeedback(false), 2000);
  };

  const handleEarnHabitPoints = async (amt: number, activityName: string) => {
    const nextPoints = loyaltyPoints + amt;
    playLuxuryChime();
    await syncPointsToCloud(nextPoints);
  };

  const handleResetPoints = async () => {
    await syncPointsToCloud(50);
  };

  // Tier calculation helpers
  const getTierInfo = (points: number) => {
    if (points >= 600) {
      return {
        tier: "Platinum",
        color: "from-slate-300 via-indigo-200 to-amber-200",
        bgGlow: "rgba(139, 92, 246, 0.25)",
        desc: "Platinum Sovereign Member • Elite Privilege Tier",
        discount: "25% VIP Off",
        nextTier: null,
        nextThreshold: null,
        pct: 100,
        badgeBg: "bg-indigo-500/10 border-indigo-500/35 text-indigo-300"
      };
    } else if (points >= 300) {
      return {
        tier: "Gold",
        color: "from-amber-400 via-amber-300 to-amber-500",
        bgGlow: "rgba(245, 158, 11, 0.22)",
        desc: "Gold Healing Envoy • Premium Privilege Tier",
        discount: "15% Gold Off",
        nextTier: "Platinum",
        nextThreshold: 600,
        pct: Math.min(100, Math.round(((points - 300) / 300) * 100)),
        badgeBg: "bg-amber-500/10 border-amber-500/35 text-amber-400"
      };
    } else {
      return {
        tier: "Silver",
        color: "from-zinc-400 to-stone-300",
        bgGlow: "rgba(120, 113, 108, 0.15)",
        desc: "Silver Novice Explorer • Standard Rewards Tier",
        discount: "5% Silver Off",
        nextTier: "Gold",
        nextThreshold: 300,
        pct: Math.min(100, Math.round((points / 300) * 100)),
        badgeBg: "bg-stone-500/10 border-stone-800 text-stone-400"
      };
    }
  };

  const currentTier = getTierInfo(loyaltyPoints);

  const promoBadges = [
    {
      id: "badge-silver",
      title: "Silver Companion Voucher",
      threshold: 100,
      code: "SILVERMALE5",
      benefits: [
        "5% Instant Off on In-Spa Bookings",
        "Valid for All Signature Massages",
        "No Minimum Spend Limit"
      ],
      glow: "border-stone-800 bg-stone-950/60"
    },
    {
      id: "badge-gold",
      title: "Gold Healing Privilege Token",
      threshold: 300,
      code: "AMBERGOLD15",
      benefits: [
        "15% Instant Off on Facility Treatments",
        "Free Eucalyptus Vapor Inhalation Therapy Upgrade",
        "Access to In-Spa Luxury Shower Amenity Kits"
      ],
      glow: "border-amber-500/30 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] text-amber-400"
    },
    {
      id: "badge-platinum",
      title: "Platinum Sovereign Sovereign Ring",
      threshold: 600,
      code: "PLATINUMVIP25",
      benefits: [
        "25% Off Facility & Home Delivery sessions",
        "Free Hot Deccan Volcanic Stone Treatment Upgrade",
        "Complimentary Private Cedarwood Sauna Access Session (30 min)",
        "Priority Therapist Selection Allocation"
      ],
      glow: "border-violet-500/40 bg-zinc-950 shadow-[0_0_25px_rgba(139,92,246,0.22)] text-violet-400"
    }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBadge(code);
    setTimeout(() => setCopiedBadge(null), 2500);
  };

  return (
    <div className="space-y-8" id="loyalty-full-dashboard-core">
      {/* 1. VISUAL TIERS HERO CARD */}
      <div 
        className="relative rounded-3xl p-6 md:p-8 overflow-hidden border border-stone-850 bg-gradient-to-tr from-stone-950 via-stone-900 to-stone-950 transition-all duration-[800ms]"
        style={{
          boxShadow: `0 25px 60px -15px ${currentTier.bgGlow}`
        }}
      >
        {/* Soft magical glowing lights matching active tier theme */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Circular dial and point display */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Spinning circular background orbit vector */}
              <svg className="absolute inset-0 w-full h-full rotate-[-95deg]" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  stroke="rgba(30, 30, 30, 0.7)" 
                  strokeWidth="4" 
                  fill="none" 
                />
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  stroke="url(#dialGoldGrad)" 
                  strokeWidth="4" 
                  strokeDasharray="283"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: Math.max(0, 283 - (283 * Math.min(600, loyaltyPoints)) / 600) }}
                  fill="none" 
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="dialGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Central text content */}
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-mono text-stone-500 tracking-wider">BALANCE</span>
                <AnimatePresence mode="wait">
                  <motion.h2 
                    key={loyaltyPoints}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-sans font-black text-slate-100 flex items-center justify-center"
                  >
                    {loyaltyPoints}
                  </motion.h2>
                </AnimatePresence>
                <span className="text-[9px] uppercase font-mono text-amber-500 tracking-widest block font-bold">
                  Points
                </span>
              </div>

              {/* Sparkle micro badge */}
              <div className="absolute top-1 right-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full p-1 border border-stone-950">
                <Sparkles className="w-2.5 h-2.5 text-stone-950 animate-spin" />
              </div>
            </div>

            <div className="space-y-1 w-full max-w-[200px]">
              <div className="flex bg-stone-900 border border-stone-850 p-1 rounded-xl items-center justify-center">
                <Award className="w-3.5 h-3.5 text-amber-500 mr-1 shrink-0" />
                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase bg-gradient-to-r ${currentTier.color} bg-clip-text text-transparent`}>
                  {currentTier.tier} CLASS
                </span>
              </div>
              <span className="text-[9px] font-mono text-stone-500 block">
                {user ? `Registered: ${user.email?.slice(0, 16)}...` : "Demo Mode Active"}
              </span>
            </div>
          </div>

          {/* Progress tracking & instructions */}
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">VIP LOYALTY STATUS</span>
              <h3 className="text-2xl font-serif font-light text-slate-100 tracking-wide block">
                Unlock {currentTier.nextTier ? `${currentTier.nextTier} Premium Perks` : "Elite Sovereignties"}
              </h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Earn 100 points for every spa treatment reservation made. Higher point counts automatic upgrade you to prestigious Gold and Platinum tiers, revealing special discount codes right below.
              </p>
            </div>

            {/* Slider/Gauge representation */}
            <div className="space-y-3 bg-stone-950/80 p-5 rounded-2xl border border-stone-850">
              <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                <span>Silver (0 pts)</span>
                <span className="text-amber-500">Gold (300 pts)</span>
                <span className="text-violet-400">Platinum (600 pts)</span>
              </div>

              {/* Visual linear progress bar */}
              <div className="relative h-2 rounded-full bg-stone-900 overflow-hidden border border-stone-800">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(100, (loyaltyPoints / 600) * 100)}%` }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-stone-400 via-amber-500 to-violet-500 rounded-full" 
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono mt-2">
                <span className="text-stone-500 uppercase">
                  ACTIVE PROGRESS: {Math.round(Math.min(100, (loyaltyPoints / 600) * 100))}%
                </span>
                {currentTier.nextThreshold ? (
                  <span className="text-slate-300">
                    Need <strong className="text-amber-500">{currentTier.nextThreshold - loyaltyPoints} pts</strong> for {currentTier.nextTier}
                  </span>
                ) : (
                  <span className="text-indigo-400 font-bold uppercase tracking-wider flex items-center">
                    <Flame className="w-3.5 h-3.5 mr-1 text-orange-500 animate-bounce" /> PINNACLE SOVEREIGN ALLOCATION UNLOCKED
                  </span>
                )}
              </div>
            </div>

            {/* PERSISTENCE ENGINE AND TESTING SIMULATED CONTROL SYSTEM */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="loyalty-earn-points-sim-btn"
                onClick={() => handleEarnSimulatedPoints(100)}
                className="px-4 py-2.5 bg-stone-900 border border-amber-500/25 hover:border-amber-500/50 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative flex items-center space-x-2 shadow-lg"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulate Booking Session (+100 Points)</span>
                {earnFeedback && (
                  <span className="absolute -top-3 -right-2 bg-emerald-600 text-[9px] px-1.5 py-0.5 rounded text-stone-950 font-black animate-bounce font-mono">
                    +100 PTS SYNCED
                  </span>
                )}
              </button>

              <button
                onClick={handleResetPoints}
                className="px-3.5 py-2.5 bg-stone-950 hover:bg-stone-900 border border-stone-850 text-stone-500 hover:text-stone-400 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer"
                title="Reset points value to test the unlocks step by step"
              >
                Reset Progress
              </button>

              {user && (
                <div className="ml-auto flex items-center space-x-1 text-[9px] font-mono text-emerald-500 bg-emerald-950/20 border border-emerald-500/25 px-2.5 py-1 rounded-lg">
                  <Server className="w-3 h-3 animate-pulse" />
                  <span>Real-time Secure Sync Enabled</span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Wellness Hours Analytics Chart Section */}
      <WellnessHoursChart />

      {/* Wellness Habit Tracker Section */}
      <WellnessHabitTracker loyaltyPoints={loyaltyPoints} onEarnPoints={handleEarnHabitPoints} />

      {/* 2. DYNAMIC UNLOCKED BADGES GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">SPECIAL CERTIFICATE STAMPS</span>
            <h4 className="text-xl font-sans font-bold text-slate-100 tracking-tight mt-0.5">Unlocked Perks & Discount Badges</h4>
          </div>
          <p className="text-[10px] font-mono text-stone-500">Unlocks automatically upon reaching milestones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoBadges.map((badge, idx) => {
            const isUnlocked = loyaltyPoints >= badge.threshold;
            const isGoldOrPlatinum = badge.threshold >= 300;

            // Framer Motion pulse values based on tier
            let pulseAnimation = {};
            if (isUnlocked) {
              if (badge.threshold === 300) {
                // Gold tier pulse animation
                pulseAnimation = {
                  borderColor: ["rgba(245, 158, 11, 0.2)", "rgba(245, 158, 11, 0.5)", "rgba(245, 158, 11, 0.2)"],
                  boxShadow: [
                    "0 0 15px rgba(245, 158, 11, 0.1)",
                    "0 0 30px rgba(245, 158, 11, 0.25)",
                    "0 0 15px rgba(245, 158, 11, 0.1)"
                  ],
                  scale: [1, 1.015, 1]
                };
              } else if (badge.threshold === 600) {
                // Platinum tier pulse animation
                pulseAnimation = {
                  borderColor: ["rgba(139, 92, 246, 0.3)", "rgba(139, 92, 246, 0.65)", "rgba(139, 92, 246, 0.3)"],
                  boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0.15)",
                    "0 0 40px rgba(139, 92, 246, 0.35)",
                    "0 0 20px rgba(139, 92, 246, 0.15)"
                  ],
                  scale: [1, 1.02, 1]
                };
              } else {
                // Silver tier simpler pulse
                pulseAnimation = {
                  borderColor: ["rgba(120, 113, 108, 0.2)", "rgba(120, 113, 108, 0.4)", "rgba(120, 113, 108, 0.2)"],
                  scale: [1, 1.008, 1]
                };
              }
            }

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 35, scale: 0.96 }}
                animate={isUnlocked && isGoldOrPlatinum ? pulseAnimation : { opacity: 1, y: 0, scale: isUnlocked ? 1.01 : 1 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: idx * 0.15,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  boxShadow: {
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  },
                  borderColor: {
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  },
                  scale: isUnlocked && isGoldOrPlatinum ? {
                    repeat: Infinity,
                    duration: 4,
                    ease: "easeInOut"
                  } : {}
                }}
                className={`border rounded-2xl p-5 flex flex-col justify-between transition-all relative overflow-hidden ${
                  isUnlocked 
                    ? `${badge.glow} border-stone-800` 
                    : "border-stone-900 bg-stone-950/20 opacity-40 select-none grayscale"
                }`}
                id={`loyalty-badge-${badge.id}`}
              >
                {/* Visual Unlocked Ribbon */}
                {isUnlocked ? (
                  <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 border-l border-b border-emerald-500/20 text-[8px] font-mono px-2 py-0.5 rounded-bl-lg font-bold uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle className="w-2.5 h-2.5" />
                    <span>Active Perks</span>
                  </div>
                ) : (
                  <div className="absolute top-0 right-0 bg-stone-900/60 text-stone-500 border-l border-b border-stone-850 text-[8px] font-mono px-2 py-0.5 rounded-bl-lg uppercase tracking-wider flex items-center space-x-1">
                    <Info className="w-2.5 h-2.5" />
                    <span>Locked at {badge.threshold} pts</span>
                  </div>
                )}

                {/* Animated light beam sweep for unlocked reward cards */}
                {isUnlocked && (
                  <motion.div
                    className="absolute inset-0 w-[30%] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12 pointer-events-none"
                    initial={{ left: "-50%" }}
                    animate={{ left: "150%" }}
                    transition={{
                      repeat: Infinity,
                      repeatDelay: 5 + idx * 2,
                      duration: 1.8,
                      ease: "easeInOut"
                    }}
                  />
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h5 className="font-serif font-light text-slate-200 text-base leading-snug">{badge.title}</h5>
                      {isUnlocked && isGoldOrPlatinum && (
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        </motion.span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 block mt-1">Point Requirement: {badge.threshold} Points</span>
                  </div>

                  <ul className="space-y-2 text-[11px] leading-relaxed text-stone-400">
                    {badge.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Voucher Redemption Container */}
                <div className="mt-6 pt-4 border-t border-stone-900">
                  {isUnlocked ? (
                    <div className="bg-stone-900 border border-stone-800 p-2.5 rounded-xl flex items-center justify-between gap-2">
                       <div className="text-left font-mono">
                        <span className="text-[8px] text-stone-500 block uppercase">Promotional Code</span>
                        <span className="text-xs text-amber-400 font-bold">{badge.code}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(badge.code)}
                        className="px-3 py-1.5 bg-stone-950 hover:bg-stone-900 border border-stone-800 hover:text-amber-400 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold cursor-pointer flex items-center space-x-1"
                      >
                        <Copy className="w-3 h-3 text-stone-400" />
                        <span>{copiedBadge === badge.code ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="py-2.5 px-3 bg-stone-950/40 border border-dashed border-stone-900 rounded-xl text-center text-[10px] font-mono text-stone-500 uppercase">
                      Lock status active • Reach {badge.threshold} pts
                    </div>
                  )}
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cinematic Platinum Ascension Reward Overlay */}
      <AnimatePresence>
        {showPlatinumLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md"
            id="platinum-level-up-overlay-container"
          >
            {/* Ambient Gold Dust Swarm Particle Burst Layer */}
            <GoldDustBurst active={showPlatinumLevelUp} />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative max-w-md w-full bg-gradient-to-b from-stone-900 to-stone-950 border border-violet-500/35 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(139,92,246,0.35)] overflow-hidden"
              id="platinum-level-up-modal"
            >
              <div className="absolute top-0 left-12 w-2 h-2.5 bg-violet-400 rounded-full blur-sm opacity-60 animate-ping" />
              <div className="absolute bottom-16 right-16 w-3 h-3 bg-amber-400 rounded-full blur-sm opacity-50 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-violet-500/5 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-full flex items-center justify-center border border-violet-400/40 shadow-inner">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono tracking-widest text-violet-400 uppercase font-black block">
                    SOVEREIGN ASCENSION DETECTED
                  </span>
                  <h3 className="text-2xl font-serif font-light text-slate-100 leading-tight">
                    Platinum Status Unlocked
                  </h3>
                  <p className="text-stone-400 text-xs px-2 leading-relaxed">
                    Welcome to the absolute pinnacle of male luxury wellness in Bangalore. You have achieved Platinum Class & unlocked our top-tier VIP benefits.
                  </p>
                </div>

                <div className="bg-stone-950/90 p-4 border border-stone-850 rounded-2xl space-y-1.5 font-mono text-left">
                  <span className="text-[8px] text-stone-500 uppercase block">Exclusive Platinum Code</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-violet-400 font-bold tracking-wider">PLATINUMVIP25</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("PLATINUMVIP25");
                        setCopiedBadge("PLATINUMVIP25");
                        setTimeout(() => setCopiedBadge(null), 2500);
                      }}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[9px] text-stone-300 font-sans uppercase rounded-md tracking-wider flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedBadge === "PLATINUMVIP25" ? "Copied" : "Copy Code"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left text-[9px] font-mono text-stone-500">
                  <div className="flex items-center space-x-1">
                    <Check className="w-3 h-3 text-violet-400" />
                    <span>25% Instant Savings</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="w-3 h-3 text-violet-400" />
                    <span>Private Cedarwood Suite</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPlatinumLevelUp(false)}
                  className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-violet-900/30 cursor-pointer"
                >
                  Enter Platinum Lounge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
