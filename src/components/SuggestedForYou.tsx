/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  Check, 
  RefreshCw, 
  Compass, 
  Flame, 
  ShieldCheck, 
  Calendar,
  Waves,
  Zap,
  CheckCircle2,
  Lock
} from "lucide-react";
import { useFirebase } from "./FirebaseContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Booking, Service } from "../types";
import { SERVICES } from "../data";

interface SuggestedForYouProps {
  onSelectService: (serviceId: string, mode: "spa" | "home") => void;
  onNavigate: (page: string) => void;
}

// Map service id to complementary pairings and custom copy reasons
const RECOMMENDATION_MAP: Record<string, { serviceId: string; reason: string; vibe: string }> = {
  "swedish-massage": {
    serviceId: "four-hands",
    reason: "Since you relaxed under our classic Swedish long-gliding strokes, elevate to the ultimate luxury: a four-hands treatment with two master therapists working in perfect, rhythmic synchronization.",
    vibe: "The Royal Dual-Therapist Sanctuary"
  },
  "deep-tissue": {
    serviceId: "steam-experience",
    reason: "Following intensive deep-tissue trigger point work, we highly recommend our Eucalyptus Steam & Sauna chambers to flush out lactic acid and maintain physical muscle flexibility.",
    vibe: "Thermal Respiratory Clearing"
  },
  "four-hands": {
    serviceId: "relaxation-combo",
    reason: "Having sampled the peak of dual-massage synergy, treat yourself to our comprehensive Relaxation Combo to blend premium skin cleansing with targeted spinal decompression.",
    vibe: "Full Ritual Rejuvenation"
  },
  "aromatherapy": {
    serviceId: "deep-tissue",
    reason: "After neural stress alleviation with organic essential aromatic oils, balance your physical system with a structural Deep Tissue session to resolve chronic knots in your shoulders.",
    vibe: "Muscular Realignment & Fascia Release"
  },
  "balinese-massage": {
    serviceId: "four-hands",
    reason: "If you enjoyed the acupressure and gentle stretching of the Balinese massage, you will be profoundly spellbound by the synchronized flow of our premier Four-Hands masterpiece.",
    vibe: "Masterful Synchronized Flow"
  },
  "sports-massage": {
    serviceId: "foot-reflexology",
    reason: "Since you requested active kinetic recovery for your joints and major muscles, target the core of athletic gravity: your plantar fascia, with a clinical Foot Reflexology sequence.",
    vibe: "Plantar Gravity Release"
  },
  "head-shoulder": {
    serviceId: "foot-reflexology",
    reason: "Now that you have released heavy tension accumulated in your upper collar, finish your postural restoration by grounding your nervous system via full foot reflex zone mapping.",
    vibe: "Full Postural Symmetry"
  },
  "foot-reflexology": {
    serviceId: "head-shoulder",
    reason: "To complement the deep neurological relief stimulated through your soles, extend the recovery upward to target the sub-occipital cervical regions of your head and crown.",
    vibe: "Cervicogenic Tension Release"
  },
  "body-scrub": {
    serviceId: "aromatherapy",
    reason: "With fresh, polished, exfoliated skin pores open, there is no better follow-up than organic botanical essential oils to soothe vascular circulation and lock in skin moisture.",
    vibe: "Somatic Hydration Therapy"
  },
  "steam-experience": {
    serviceId: "deep-tissue",
    reason: "Your joints are pre-warmed, and muscular fibers are highly elasticized from eucalyptus steam. Now is the scientifically optimal state to dismantle deep spinal knots.",
    vibe: "Proactive Fascial Deinitiation"
  },
  "relaxation-combo": {
    serviceId: "four-hands",
    reason: "Your interest in holistic wellness packages suggests you are ready for our supreme flagship: 4 hands gliding in dual master choreography to restore complete inner peace.",
    vibe: "The absolute pinnacle of luxury"
  }
};

export default function SuggestedForYou({ onSelectService, onNavigate }: SuggestedForYouProps) {
  const { user } = useFirebase();
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Intake quiz state
  const [quizStep, setQuizStep] = useState(0); // 0: Not started, 1: Goal, 2: Focus Area, 3: Pressure, 4: Result Revealed
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [preferredPressure, setPreferredPressure] = useState("");
  const [quizRecommendation, setQuizRecommendation] = useState<Service | null>(null);
  const [quizVibe, setQuizVibe] = useState("");
  const [quizReason, setQuizReason] = useState("");

  // Query actual booking history for recommendation engine
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const bookingsCollectionRef = collection(db, "bookings");
    const q = query(bookingsCollectionRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookings: Booking[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Booking;
        bookings.push({ ...data, id: doc.id });
      });

      // Sort with latest booking first
      if (bookings.length > 0) {
        bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLastBooking(bookings[0]);
      } else {
        setLastBooking(null);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Error obtaining user booking history for suggested algorithm:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle recommendation generation based on booking history
  const getDynamicRecommendationObj = () => {
    if (!lastBooking) return null;

    // Convert booking selectedService title back to matching service object
    const bookedNameLower = lastBooking.selectedService.toLowerCase();
    const serviceObj = SERVICES.find(s => 
      s.name.toLowerCase() === bookedNameLower || 
      s.id.toLowerCase() === bookedNameLower ||
      bookedNameLower.includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes(bookedNameLower)
    );

    const activeId = serviceObj?.id || "swedish-massage";
    const recommendationInfo = RECOMMENDATION_MAP[activeId] || {
      serviceId: "deep-tissue",
      reason: "Enhance your self-healing journey by exploring our deeply relaxing deep tissue myofascial structural alignment treatments next.",
      vibe: "Deep Tissue Structural Decompression"
    };

    const targetService = SERVICES.find(s => s.id === recommendationInfo.serviceId) || SERVICES[1];

    return {
      sourceService: serviceObj?.name || lastBooking.selectedService,
      recommendedService: targetService,
      reason: recommendationInfo.reason,
      vibe: recommendationInfo.vibe
    };
  };

  // Evaluate Intake Questionnaire responses
  const evaluateOnboardingQuiz = () => {
    let targetId = "swedish-massage";
    let calculatedVibe = "Neural Stress Decompression";
    let calculatedReason = "Based on your focus to clear heavy daily fatigue and moderate stroke alignment, our classical Swedish therapy will restore perfect somatic flow.";

    if (primaryGoal === "Decompress Stiff Body") {
      if (preferredPressure === "Max Pressure & Deep Release") {
        targetId = "deep-tissue";
        calculatedVibe = "Myofascial Trigger Alignment";
        calculatedReason = "To release persistent stiff knots in your key muscle fibers, our physical deep tissue trigger treatment is the absolute prime fit.";
      } else if (focusArea === "Feet & Quadriceps") {
        targetId = "foot-reflexology";
        calculatedVibe = "Plantar Grounding Restoration";
        calculatedReason = "Excellent for active lifestyles. Ground your gravity points through professional reflexology focused on sole trigger channels.";
      } else {
        targetId = "sports-massage";
        calculatedVibe = "Dynamic Kinetic Recovery";
        calculatedReason = "Engineered to release stubborn localized back stiffness, this targets major joints with custom thermal oils.";
      }
    } else if (primaryGoal === "Boost Athletic Recovery") {
      if (focusArea === "Feet & Quadriceps") {
        targetId = "foot-reflexology";
        calculatedVibe = "Postural Plantar Flushing";
        calculatedReason = "Highly recommended to target soreness from active sports, cycling, or intensive gym workouts.";
      } else {
        targetId = "sports-massage";
        calculatedVibe = "Kinetic Joint Mobilization";
        calculatedReason = "Ideal for rapid repair. Targets hamstring tightness, high deltoid fatigue, and lower lumbar joint restriction.";
      }
    } else {
      // Total Sensory Indulgence / Stress Relief
      if (preferredPressure === "Max Pressure & Deep Release" || focusArea === "Lower Back & Spine") {
        targetId = "four-hands";
        calculatedVibe = "Supreme Flagship Harmony";
        calculatedReason = "For maximum stress dissolution, our signature synchronized four-hands treatment utilizes two therapists to overwhelm your sensory system into peace.";
      } else {
        targetId = "aromatherapy";
        calculatedVibe = "Neural Aromatherapeutic Healing";
        calculatedReason = "Combines mild rhythmic sweep strokes with therapeutic essential lavender oils to deeply calm the brain and mental cortex.";
      }
    }

    const serviceMatch = SERVICES.find(s => s.id === targetId) || SERVICES[0];
    setQuizRecommendation(serviceMatch);
    setQuizVibe(calculatedVibe);
    setQuizReason(calculatedReason);
    setQuizStep(4);
  };

  const recommendation = getDynamicRecommendationObj();

  if (loading) {
    return (
      <div className="p-8 bg-stone-900/15 border border-stone-850 rounded-3xl flex items-center justify-center">
        <RefreshCw className="w-5 h-5 text-amber-500 animate-spin mr-2" />
        <span className="font-mono text-xs text-stone-400 uppercase tracking-widest">Compiling Wellness Suggestions...</span>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/20 border border-stone-850 rounded-3xl p-6 sm:p-8 relative overflow-hidden" id="homepage-suggested-ateliers">
      {/* Visual luxury atmospheric background decor */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial-gradient from-amber-500/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-radial-gradient from-violet-500/[0.015] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex items-start justify-between border-b border-stone-900 pb-5 mb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-[9.5px] font-mono tracking-widest text-amber-500 uppercase font-bold">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>PERSONALIZED FOR YOU</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-light text-slate-100 tracking-wide">
            {lastBooking ? "Based On Your Healing History" : "Aesthetic Wellness Consultant"}
          </h3>
          <p className="text-stone-400 text-xs leading-relaxed max-w-2xl font-sans">
            {lastBooking 
              ? "We analyze your previous therapy bookings to dynamically propose specific complementary treatments that will heighten your mental recovery."
              : "Discover your optimal treatment. Fill out your short clinical somatic objectives to calculate the scientifically recommended massage therapy for your profile."
            }
          </p>
        </div>

        {lastBooking && (
          <div className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold">
            <Check className="w-3.5 h-3.5" />
            <span>Algorithm Synced</span>
          </div>
        )}
      </div>

      {/* RENDER DYNAMIC HISTORIC PAIRING (IF USER HAS AT LEAST ONE BOOKING) */}
      {lastBooking && recommendation ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Recommendation explanation slot */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div className="space-y-3.5 text-left">
              <div className="inline-block py-1 px-2.5 bg-stone-950/90 border border-stone-850 rounded-lg font-mono text-[9px] text-stone-400 uppercase">
                Prior Treatment: <strong className="text-slate-100">{recommendation.sourceService}</strong>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest block font-bold">
                  {recommendation.vibe}
                </span>
                <h4 className="text-2xl font-sans font-bold text-slate-100 tracking-tight">
                  Suggested Therapy: {recommendation.recommendedService.name}
                </h4>
              </div>

              <p className="text-stone-300 text-xs leading-relaxed font-sans pr-2">
                {recommendation.reason}
              </p>

              {/* Treatment details highlights */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-900/60 text-left">
                  <span className="text-[8px] font-mono text-stone-500 uppercase block">In-Spa Standard</span>
                  <span className="text-sm font-bold text-amber-500 font-mono">₹{recommendation.recommendedService.priceSpa}</span>
                </div>
                <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-900/60 text-left">
                  <span className="text-[8px] font-mono text-stone-500 uppercase block">White-Glove Home</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">₹{recommendation.recommendedService.priceHome}</span>
                </div>
              </div>
            </div>

            {/* Micro details assurance footer */}
            <div className="text-[10px] font-mono text-stone-500 flex items-center space-x-1 border-t border-stone-900 pt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Recommended to take inside 14 days of your last session.</span>
            </div>
          </div>

          {/* Interactive recommended service preview & direct booking action */}
          <div className="lg:col-span-5 bg-gradient-to-b from-stone-950 to-stone-900/70 border border-amber-500/15 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/[0.04] transition-all" />

            <div className="space-y-4 text-left">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-0.5 bg-stone-900 border border-stone-850 rounded text-[9px] font-mono text-stone-400">
                  {recommendation.recommendedService.duration}
                </span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase font-black tracking-widest bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20 animate-pulse">
                  Double Points Active
                </span>
              </div>

              <div>
                <h5 className="font-sans font-bold text-slate-100 text-lg leading-snug">
                  {recommendation.recommendedService.name}
                </h5>
                <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">
                  {recommendation.recommendedService.shortDesc}
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[8px] font-mono text-stone-500 uppercase block tracking-wider font-extrabold">Calculated Benefits</span>
                {recommendation.recommendedService.benefits.slice(0, 3).map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-center space-x-1.5 text-[10px] text-stone-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-6">
              <button
                onClick={() => onSelectService(recommendation.recommendedService.id, "spa")}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-98"
              >
                In-Spa Booking (₹{recommendation.recommendedService.priceSpa})
              </button>
              <button
                onClick={() => onSelectService(recommendation.recommendedService.id, "home")}
                className="w-full py-2 bg-stone-950 hover:bg-stone-900 border border-stone-850 hover:border-emerald-500/30 text-stone-300 hover:text-emerald-400 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer active:scale-98"
              >
                Home Delivery Session (₹{recommendation.recommendedService.priceHome})
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* NO BOOKING HISTORY OR LOGGED OUT: DEMO INTUITIVE ONBOARDING PROFILE QUIZ */
        <div>
          <AnimatePresence mode="wait">
            
            {/* Step 0: Welcome consulting screen */}
            {quizStep === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-6 max-w-lg mx-auto space-y-5"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Compass className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-sans font-extrabold text-slate-100">
                    Calculate Your Ideal Sensory Treatment
                  </h4>
                  <p className="text-stone-400 text-xs leading-relaxed font-sans">
                    Answer three rapid questions regarding your current physiological state to calculate the mathematically optimized massage ritual for your body.
                  </p>
                </div>
                <button
                  onClick={() => setQuizStep(1)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer active:scale-98 shadow-md"
                >
                  Start Intake Questionnaire
                </button>
              </motion.div>
            )}

            {/* Step 1: Objective goal query */}
            {quizStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5 text-center max-w-md mx-auto"
              >
                <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block font-black">
                  Step 1 of 3: Primary Wellness Objective
                </span>
                <h4 className="text-base font-sans font-bold text-slate-100">
                  What is your primary wellness objective today?
                </h4>
                <div className="space-y-2 text-left">
                  {[
                    "Decompress Stiff Body", 
                    "Total Sensory Indulgence", 
                    "Boost Athletic Recovery"
                  ].map((goalOption) => (
                    <button
                      key={goalOption}
                      onClick={() => {
                        setPrimaryGoal(goalOption);
                        setQuizStep(2);
                      }}
                      className="w-full p-4 bg-stone-950/80 hover:bg-stone-900 border border-stone-900 hover:border-amber-500/30 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <span>{goalOption}</span>
                      <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-amber-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Focal Area query */}
            {quizStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5 text-center max-w-md mx-auto"
              >
                <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block font-black">
                  Step 2 of 3: Physiological Focus Area
                </span>
                <h4 className="text-base font-sans font-bold text-slate-100">
                  Where is your physical body storing the most physical gravity?
                </h4>
                <div className="space-y-2 text-left">
                  {[
                    "Lower Back & Spine", 
                    "Shoulders & Crown", 
                    "Feet & Quadriceps"
                  ].map((areaOption) => (
                    <button
                      key={areaOption}
                      onClick={() => {
                        setFocusArea(areaOption);
                        setQuizStep(3);
                      }}
                      className="w-full p-4 bg-stone-950/80 hover:bg-stone-900 border border-stone-900 hover:border-amber-500/30 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <span>{areaOption}</span>
                      <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-amber-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Preferred stroke pressure */}
            {quizStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="space-y-5 text-center max-w-md mx-auto"
              >
                <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block font-black">
                  Step 3 of 3: Structural Pressure Preference
                </span>
                <h4 className="text-base font-sans font-bold text-slate-100">
                  Select your desired physical pressure intensity:
                </h4>
                <div className="space-y-2 text-left">
                  {[
                    "Mild & Rhythmic", 
                    "Moderate Stroke Alignment", 
                    "Max Pressure & Deep Release"
                  ].map((pressureOption) => (
                    <button
                      key={pressureOption}
                      onClick={() => {
                        setPreferredPressure(pressureOption);
                        // Deliberately delay evaluation to simulate luxury system compute
                        setTimeout(() => {
                          evaluateOnboardingQuiz();
                        }, 100);
                      }}
                      className="w-full p-4 bg-stone-950/80 hover:bg-stone-900 border border-stone-900 hover:border-amber-500/30 text-slate-200 text-xs font-medium rounded-xl flex items-center justify-between transition-all cursor-pointer group"
                    >
                      <span>{pressureOption}</span>
                      <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-amber-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Display computed recommendation result! */}
            {quizStep === 4 && quizRecommendation && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div className="space-y-3.5 text-left">
                    <div className="flex items-center space-x-1.5">
                      <span className="inline-block py-1 px-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg font-mono text-[9px] text-amber-400 font-bold uppercase tracking-wider">
                        Aesthetic Match Found
                      </span>
                      <span className="text-stone-500 text-[10px] font-mono">&bull; Profiles match perfectly</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest block font-bold">
                        {quizVibe}
                      </span>
                      <h4 className="text-2xl font-sans font-bold text-slate-100 tracking-tight">
                        We Recommend: {quizRecommendation.name}
                      </h4>
                    </div>

                    <p className="text-stone-300 text-xs leading-relaxed font-sans pr-2">
                      {quizReason}
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-900/60 text-left">
                        <span className="text-[8px] font-mono text-stone-500 uppercase block">In-Spa Class</span>
                        <span className="text-sm font-bold text-amber-500 font-mono">₹{quizRecommendation.priceSpa}</span>
                      </div>
                      <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-900/60 text-left">
                        <span className="text-[8px] font-mono text-stone-500 uppercase block">Home Delivery Lux</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">₹{quizRecommendation.priceHome}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-stone-500 border-t border-stone-900 pt-3">
                    <button
                      onClick={() => {
                        setQuizStep(0);
                        setPrimaryGoal("");
                        setFocusArea("");
                        setPreferredPressure("");
                      }}
                      className="text-amber-500 hover:text-amber-400 flex items-center space-x-1 font-bold cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Consultant Test</span>
                    </button>
                    {!user && (
                      <span className="text-stone-600">
                        Log in to automatically compile suggestions from real appointment histories.
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-gradient-to-b from-stone-950 to-stone-900/70 border border-amber-500/15 rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/[0.04] transition-all" />

                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-0.5 bg-stone-900 border border-stone-850 rounded text-[9px] font-mono text-stone-400">
                        {quizRecommendation.duration}
                      </span>
                      <span className="text-[9px] font-mono text-amber-500 uppercase font-black tracking-widest bg-amber-950/20 px-2.5 py-0.5 rounded border border-amber-500/15">
                        High Fit
                      </span>
                    </div>

                    <div>
                      <h5 className="font-sans font-bold text-slate-100 text-lg leading-snug">
                        {quizRecommendation.name}
                      </h5>
                      <p className="text-stone-400 text-xs mt-1.5 leading-relaxed">
                        {quizRecommendation.shortDesc}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[8px] font-mono text-stone-500 uppercase block tracking-wider font-extrabold">Active Targets</span>
                      {quizRecommendation.benefits.map((benefit, bIdx) => (
                        <div key={bIdx} className="flex items-center space-x-1.5 text-[10px] text-stone-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-6">
                    <button
                      onClick={() => onSelectService(quizRecommendation.id, "spa")}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-98"
                    >
                      In-Spa Booking (₹{quizRecommendation.priceSpa})
                    </button>
                    <button
                      onClick={() => onSelectService(quizRecommendation.id, "home")}
                      className="w-full py-2 bg-stone-950 hover:bg-stone-900 border border-stone-850 hover:border-emerald-500/30 text-stone-300 hover:text-emerald-400 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer active:scale-98"
                    >
                      Home Delivery Session (₹{quizRecommendation.priceHome})
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
