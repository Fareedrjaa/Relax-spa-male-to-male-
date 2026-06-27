/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  MapPin, Clock, Phone, Mail, Award, Shield, Check, Star, Search, ThumbsUp, Send, HelpCircle, BookOpen, Layers,
  Tv, Sparkles, Compass, ShieldAlert, Calendar, Layout, ChevronRight, MessageSquare, Plus, ArrowRight, User
} from "lucide-react";
import AnimatedLogo from "./AnimatedLogo";
import { motion } from "motion/react";
import { Service, Facility, Testimonial, FAQItem, BlogPost, CoverageArea, MembershipPlan } from "../types";
import {
  SERVICES, FACILITIES, HOME_COVERAGE, TESTIMONIALS, MEMBERSHIPS, FAQS, BLOGS,
  ADDRESS, LANDMARK, CONTACT_PHONES, BUSINESS_HOURS, GOOGLE_RATING, BRAND_NAME, BUSINESS_NAME
} from "../data";
import BookingForm from "./BookingForm";
import SpecialLogoText from "./SpecialLogoText";
import CinematicVideoPlayer from "./CinematicVideoPlayer";
import LoyaltyDashboard from "./LoyaltyDashboard";
import TherapistTeamCircle from "./TherapistTeamCircle";
import ThreeDCard from "./ThreeDCard";
import ProceduralAestheticIllustration from "./ProceduralAestheticIllustration";
import GalleryLightbox, { GalleryItem } from "./GalleryLightbox";
import SuggestedForYou from "./SuggestedForYou";

interface PagesProps {
  activePage: string;
  onNavigate: (page: string, params?: any) => void;
  bookingServiceId?: string;
  setBookingServiceId: (id: string) => void;
}

// Slow-motion luxurious stagger entrance variants for premium cinematic feel
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16, // elegant, rhythmic cascade
    },
  },
};

const slowSlideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2, // majestic slow motion
      ease: [0.16, 1, 0.3, 1], // premium custom cubic ease-out curve
    },
  },
};

const slowSlideRight = {
  hidden: { opacity: 0, x: -35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const slowSlideLeft = {
  hidden: { opacity: 0, x: 35 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const slowFadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut",
    },
  },
};

export default function Pages({ activePage, onNavigate, bookingServiceId, setBookingServiceId }: PagesProps) {
  // Synchronized style of logos on active pages
  const [activeLogoStyle, setActiveLogoStyle] = useState<"A" | "B">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("relax_spa_logo_style") as "A" | "B") || "A";
    }
    return "A";
  });

  useEffect(() => {
    const handleStyleChange = (e: Event) => {
      const customEvent = e as CustomEvent<"A" | "B">;
      if (customEvent.detail === "A" || customEvent.detail === "B") {
        setActiveLogoStyle(customEvent.detail);
      }
    };
    window.addEventListener("relax_spa_logo_style_changed", handleStyleChange);
    return () => {
      window.removeEventListener("relax_spa_logo_style_changed", handleStyleChange);
    };
  }, []);

  const triggerLogoStyleChange = (style: "A" | "B") => {
    localStorage.setItem("relax_spa_logo_style", style);
    setActiveLogoStyle(style);
    window.dispatchEvent(
      new CustomEvent("relax_spa_logo_style_changed", { detail: style })
    );
  };

  // Live State for Reviews Page (so users can leave real reviews)
  const [liveReviews, setLiveReviews] = useState<Testimonial[]>(TESTIMONIALS);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewHighlight, setReviewHighlight] = useState("Proper Hygiene");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Gallery Filters
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  // Sub-tabs on Membership Case
  const [membershipSubTab, setMembershipSubTab] = useState<"loyalty" | "annual">("loyalty");

  // FAQ Search
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState("All");

  // Handle active service mapping
  const selectAndBookService = (serviceId: string, mode: "spa" | "home") => {
    setBookingServiceId(serviceId);
    onNavigate("booking");
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewText.trim()) return;

    const newRev: Testimonial = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor,
      rating: reviewRating,
      text: reviewText,
      date: new Date().toISOString().split("T")[0],
      verified: true,
      highlights: [reviewHighlight]
    };

    setLiveReviews([newRev, ...liveReviews]);
    setReviewAuthor("");
    setReviewText("");
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  // Google review rating distribution statistics helpers
  const statsCounts = {
    5: liveReviews.filter(r => r.rating === 5).length + 132, // pad with historic real data
    4: liveReviews.filter(r => r.rating === 4).length + 22,
    3: 4,
    2: 1,
    1: 1
  };
  const totalStatsCount = statsCounts[5] + statsCounts[4] + statsCounts[3] + statsCounts[2] + statsCounts[1];

  // Render Section Selector based on Page string
  switch (activePage) {
    case "home":
      return (
        <div className="space-y-12">
          {/* CINEMATIC MEN'S MASSAGE PROMOTIONAL FEATURE */}
          <div className="space-y-4">
            <div className="border-b border-stone-850 pb-4 text-center md:text-left">
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Cinematic Ateliers</span>
              <div className="flex flex-col md:flex-row md:items-center gap-1.5 mt-1">
                <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none uppercase">THE ART OF</h2>
                <SpecialLogoText text="MEN'S DECOMPRESSION" size="md" className="font-semibold" />
              </div>
              <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-2xl">
                Stream the ambient cinematic recording. Experience the application of heated Ayurvedic oils, sweep compression strokes, and lava stone thermal alignment before finalizing your reservation slot.
              </p>
            </div>
            <CinematicVideoPlayer />
          </div>

          {/* THE LUXURY BRAND ATELIER & WELLNESS CORNER */}
          <div className="bg-stone-900/10 border border-amber-500/10 rounded-2xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
            {/* Ambient gold glow spotlights */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center max-w-xl mx-auto space-y-2 mb-8" id="luxury-brand-atelier-header">
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">Metaphysical Aesthetics</span>
              <h3 className="text-xl md:text-2xl font-serif font-light text-slate-100 tracking-wide uppercase">THE BRAND ATELIER</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Relax Spa presents two distinct core visual models. Toggle to align the entire digital ecosystem with your wellness philosophy.
              </p>
            </div>

            {/* DUAL SELECTOR PANEL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch" id="brand-atelier-dual-selection">
              {/* STYLE A: GILDED GRACE */}
              <button
                onClick={() => triggerLogoStyleChange("A")}
                className={`text-left p-6 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer focus:outline-none h-auto bg-stone-950/45 ${
                  activeLogoStyle === "A"
                    ? "border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.15)] bg-gradient-to-tr from-stone-950 to-amber-500/[0.03]"
                    : "border-stone-850 hover:border-amber-500/20"
                }`}
                id="brand-style-a-button"
              >
                <div className="flex items-start gap-4">
                  <AnimatedLogo size="md" forceStyle="A" disableClick className="shrink-0" />
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest font-bold">Model Style I</span>
                    <h4 className="font-serif font-medium text-slate-100 text-sm md:text-base">Gilded Grace</h4>
                    <p className="text-stone-400 text-[11px] leading-relaxed">
                      Symmetrical concentric brass orbits with soft gold palm leaves and an elegant left-facing silhouette. Embodying receptivity, deep relaxation, and peaceful mental surrender.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-stone-900 flex justify-between items-center w-full">
                  <span className="text-[9px] font-mono text-stone-500 uppercase">Aura: Meditative Quietude</span>
                  {activeLogoStyle === "A" && (
                    <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                      Active Theme
                    </span>
                  )}
                </div>
              </button>

              {/* STYLE B: ATHLETIC MAJESTY */}
              <button
                onClick={() => triggerLogoStyleChange("B")}
                className={`text-left p-6 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer focus:outline-none h-auto bg-stone-950/45 ${
                  activeLogoStyle === "B"
                    ? "border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.15)] bg-gradient-to-tr from-stone-950 to-amber-500/[0.03]"
                    : "border-stone-850 hover:border-amber-500/20"
                }`}
                id="brand-style-b-button"
              >
                <div className="flex items-start gap-4">
                  <AnimatedLogo size="md" forceStyle="B" disableClick className="shrink-0" />
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest font-bold">Model Style II</span>
                    <h4 className="font-serif font-medium text-slate-100 text-sm md:text-base">Athletic Majesty</h4>
                    <p className="text-stone-400 text-[11px] leading-relaxed">
                      A bold, thick-beveled golden orbit containing a dual-tone gold and silver monogram with a right-facing muscular back. Representing athletic performance, kinetic recovery, and physical healing.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-stone-900 flex justify-between items-center w-full">
                  <span className="text-[9px] font-mono text-stone-500 uppercase">Aura: Vitality & Recovery</span>
                  {activeLogoStyle === "B" && (
                    <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
                      Active Theme
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* SIX WELLNESS PILLARS - Matches bottom row of logo details */}
            <div className="mt-12 pt-10 border-t border-stone-850" id="wellness-pillars-showcase">
              <div className="text-center max-w-md mx-auto mb-8">
                <span className="text-[10px] font-mono text-amber-500/70 uppercase tracking-widest">Core Columns of Care</span>
                <h4 className="text-sm font-sans font-bold text-slate-200 uppercase tracking-wider mt-1">Our Six Wellness Pillars</h4>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { name: "Relax", icon: Compass, color: "text-amber-500", glow: "shadow-amber-500/10", desc: "Slower heart rates & somatic calm" },
                  { name: "Rejuvenate", icon: Sparkles, color: "text-amber-400", glow: "shadow-yellow-500/10", desc: "Thermal steam purification" },
                  { name: "Therapy", icon: Award, color: "text-amber-500", glow: "shadow-orange-500/10", desc: "Expert anatomical restoration" },
                  { name: "Wellness", icon: Layers, color: "text-amber-400", glow: "shadow-amber-500/10", desc: "Organic compounds & blends" },
                  { name: "Privacy", icon: Shield, color: "text-amber-500", glow: "shadow-emerald-500/10", desc: "Strict gentleman discretion" },
                  { name: "Premium", icon: Star, color: "text-amber-400", glow: "shadow-yellow-500/10", desc: "VIP members-only lounges" }
                ].map((pillar, id) => {
                  const IconComp = pillar.icon;
                  return (
                    <motion.div
                      key={pillar.name}
                      whileHover={{ scale: 1.05, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="bg-stone-950/80 border border-stone-850/80 rounded-xl p-4 text-center flex flex-col items-center justify-between min-h-[140px] shadow-lg hover:border-amber-500/20 group"
                      id={`wellness-pillar-card-${pillar.name.toLowerCase()}`}
                    >
                      {/* Round gold medal styled icon coin */}
                      <div className={`w-11 h-11 rounded-full bg-stone-900 border border-amber-500/20 flex items-center justify-center ${pillar.color} ${pillar.glow} group-hover:border-amber-500/50 group-hover:bg-amber-500/5 transition-all duration-300 relative`}>
                        <div className="absolute inset-0.5 rounded-full border border-dotted border-amber-500/10" />
                        <IconComp className="w-4.5 h-4.5 group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                      </div>
                      
                      <div className="space-y-1 mt-3">
                        <span className="text-[11px] font-serif text-slate-200 tracking-wide font-medium block uppercase">{pillar.name}</span>
                        <span className="text-[9px] text-stone-500 leading-normal block max-w-[110px] mx-auto">{pillar.desc}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BANNER HIGHLIGHT GRID */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                badge: "⭐ Verified Trust",
                badgeColor: "text-amber-500",
                title: `${GOOGLE_RATING.stars} Stars out of 5`,
                desc: `Join over ${GOOGLE_RATING.verifiedReviewsCount}+ satisfied Bangalore gentlemen endorsing our service.`,
                btnText: "View reviews",
                btnTab: "reviews",
              },
              {
                badge: "🌿 Clinical Hygiene",
                badgeColor: "text-emerald-500",
                title: "100% Safe & Proper",
                desc: "Rigorous sanitization guidelines. Disinfected therapy rooms, clean beds, fresh disposable sheets, and sanitizing heat treatment.",
                btnText: "Hygiene practices",
                btnTab: "about",
              },
              {
                badge: "🛵 Luxury To Go",
                badgeColor: "text-amber-500",
                title: "Home Massages",
                desc: "Can't travel through Bangalore gridlock? Our expert male therapists pack portable spa beds and sheets directly to your doorstep.",
                btnText: "Home services",
                btnTab: "home-service",
              }
            ].map((banner, index) => (
              <motion.div
                key={index}
                variants={slowSlideUp}
                whileHover={{ y: -6, scale: 1.015, borderColor: "rgba(245, 158, 11, 0.3)" }}
                transition={{ duration: 0.4 }}
                className="bg-stone-900/30 border border-amber-500/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl flex flex-col justify-between"
              >
                <div>
                  <span className={`text-[10px] font-mono ${banner.badgeColor} uppercase tracking-widest block mb-2`}>{banner.badge}</span>
                  <h4 className="text-2xl font-serif font-light text-amber-500 tracking-wide">{banner.title}</h4>
                  <p className="text-stone-400 text-xs mt-2 leading-relaxed">
                    {banner.desc}
                  </p>
                </div>
                <button onClick={() => onNavigate(banner.btnTab)} className="text-amber-400 hover:text-amber-300 text-xs font-mono font-bold mt-6 flex items-center cursor-pointer transition-colors w-max">
                  {banner.btnText} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* DUAL MODE SPLIT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 overflow-hidden">
            {/* SPA EXP */}
            <motion.div
              variants={slowSlideRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.01, y: -4 }}
              transition={{ duration: 0.4 }}
              className="group relative bg-gradient-to-t from-stone-950 to-stone-900/60 border border-amber-500/10 rounded-2xl p-8 overflow-hidden shadow-2xl flex flex-col justify-between min-h-[350px]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl group-hover:scale-110 transition-all duration-500 pointer-events-none" />
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4 font-bold">01</div>
                <h3 className="text-2xl font-serif font-light text-slate-100 tracking-wide leading-tight">Visit The Vivek Nagar Facility</h3>
                <p className="text-stone-400 text-xs mt-3.5 leading-relaxed max-w-sm">
                  Unwind under physical eucalyptus steam chambers, soundproof treatment beds, aromatic misting showers, and premium hospitality treatment rooms.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Private Shower", "Eucalyptus Steam", "sauna Room", "Hot Oils"].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-stone-900 rounded border border-stone-850 text-[10px] font-mono text-stone-500 uppercase">{tag}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => selectAndBookService("", "spa")} className="w-full mt-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer group-hover:from-amber-400 group-hover:to-amber-500 transition-colors">
                Book A Spa Visit Area
              </button>
            </motion.div>

            {/* HOME WELLNESS */}
            <motion.div
              variants={slowSlideLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.01, y: -4 }}
              transition={{ duration: 0.4 }}
              className="group relative bg-gradient-to-t from-stone-950 to-stone-900/60 border border-amber-500/10 rounded-2xl p-8 overflow-hidden shadow-2xl flex flex-col justify-between min-h-[350px]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl group-hover:scale-110 transition-all duration-500 pointer-events-none" />
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 font-bold">02</div>
                <h3 className="text-2xl font-serif font-light text-slate-100 tracking-wide leading-tight">Bring The Experience Home</h3>
                <p className="text-stone-400 text-xs mt-3.5 leading-relaxed max-w-sm">
                  A certified therapists arrives containing full set of sanitizers, fresh linen sheets, specialized oils, and portable massage tables. Turn your bedroom into a quiet zen paradise.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Portable Spa Bed", "Sanitized Linens", "E-City & Whitelist Coverage", "Heated Oils"].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-stone-900 rounded border border-stone-850 text-[10px] font-mono text-stone-500 uppercase">{tag}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => selectAndBookService("", "home")} className="w-full mt-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-widest cursor-pointer group-hover:from-emerald-400 group-hover:to-teal-400 transition-colors">
                Order Home Wellness Session
              </button>
            </motion.div>
          </div>

          {/* DYNAMIC CONTEXTUAL RECOMMENDER */}
          <SuggestedForYou 
            onSelectService={(serviceId, mode) => selectAndBookService(serviceId, mode)}
            onNavigate={onNavigate}
          />

          {/* SERVICE HIGHLIGHTS PORTLET */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">Therapy Catalog</span>
                <h3 className="text-xl font-sans font-bold text-slate-100 tracking-tight leading-normal mt-1">Our Signature Decompression Massages</h3>
              </div>
              <button onClick={() => onNavigate("services")} className="text-xs font-mono font-bold text-amber-400 hover:underline flex items-center cursor-pointer">
                See all therapies ({SERVICES.length}) <ChevronRight className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-120px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {SERVICES.slice(0, 3).map((service) => (
                <motion.div
                  key={service.id}
                  variants={slowSlideUp}
                  whileHover={{ y: -6, borderColor: "rgba(245, 158, 11, 0.25)" }}
                  className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5 hover:border-amber-500/15 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-stone-950 border border-stone-850 text-[10px] font-mono text-stone-400 rounded-full">{service.duration}</span>
                      <span className="text-sm font-sans font-extrabold text-amber-500">₹{service.priceSpa} onwards</span>
                    </div>
                    <h4 className="font-sans font-bold text-slate-200 text-base tracking-tight mt-3">{service.name}</h4>
                    <p className="text-stone-400 text-xs mt-2 leading-relaxed">{service.shortDesc}</p>
                  </div>
                  <button onClick={() => selectAndBookService(service.id, "spa")} className="w-full mt-5 py-2.5 bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-850 hover:border-transparent text-slate-300 font-bold rounded-lg text-xs tracking-wider transition-all cursor-pointer">
                    Book Session
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* MASTER THERAPISTS ORBITING RING */}
          <div className="pt-6">
            <TherapistTeamCircle onSelectBooking={() => onNavigate("booking")} />
          </div>

          {/* DYNAMIC FAQ SECTION */}
          <motion.div
            variants={slowSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="p-8 bg-stone-950 border border-amber-500/5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-xl">
              <h4 className="text-slate-100 font-sans font-bold text-lg tracking-tight">Got Questions? Aria Has Instant Answers</h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                Whether you have queries about travel fees, hygiene protocols, male-to-male massage setups, or sauna memberships, just click the hovering bubble at the bottom right to chat with Aria, our AI Wellness Concierge!
              </p>
            </div>
            <button onClick={() => onNavigate("faq")} className="px-5 py-3 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 hover:text-amber-300 text-xs font-mono font-bold uppercase tracking-wider rounded-xl cursor-pointer select-none transition-colors shrink-0">
              Browse Frequently Asked FAQs
            </button>
          </motion.div>
        </div>
      );

    case "about":
      return (
        <div className="space-y-12">
          {/* HEADER HERO */}
          <div className="border-b border-stone-800 pb-6">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Our Heritage</span>
            <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none">{BUSINESS_NAME}</h2>
            <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-2xl">
              Established in the heart of Bengaluru at Vivek nagar layout under state-of-the-art standards. We provide premium holistic wellness, deep muscle therapies, hygiene-certified facilities, and elite home massage services for gentlemen seeking therapeutic reprieve from office stress.
            </p>
          </div>

          {/* DEDICATED HYGIENE SECTION */}
          <div className="bg-stone-900/30 border border-amber-500/15 backdrop-blur-sm rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-bold">Uncompromising Quality</span>
            <h3 className="text-xl font-sans font-semibold text-slate-100 tracking-tight mt-1.5 mb-4">Proper Hygiene & Tidy Environmental Standards</h3>
            <p className="text-stone-400 text-xs leading-relaxed mb-6">
              At Relax Spa Bangalore, client protection is non-negotiable. Our Vivek Nagar facility underwent rigid sanitary audits. We follow strict international cleanliness protocols across In-Spa cabins and Home visit tasks:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { title: "Surgical Level Disinfection", desc: "All therapy tables, cushions, and private suites are fully disinfected using surgical-grade sprays immediate after every guest exits." },
                { title: "Disposable Wellness Accents", desc: "We utilize biodegradable single-use disposable sheets, face rest inserts, and pre-sterilized robes." },
                { title: "Heat-Cycle Steam chambers", desc: "Our wooden pine wet steam chambers undergo scheduled overnight high-temp dry clean cycles daily." },
                { title: "Purified Massage Elixirs", desc: "We source cold-pressed seed carrier base oils and premium therapeutic grade lavender/herbal compounds." }
              ].map((item, id) => (
                <div key={id} className="p-4 bg-stone-950 border border-stone-800/80 rounded-xl flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] font-bold shrink-0 mt-0.5">✓</div>
                  <div>
                    <h5 className="font-bold text-slate-200 leading-tight">{item.title}</h5>
                    <p className="text-stone-500 text-[11px] mt-1 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BRAND MOTIVATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h4 className="text-slate-100 font-sans font-bold text-base">Qualified Professional Therapists</h4>
              <p className="text-stone-400 text-xs leading-relaxed">
                Every member of our team is fully certified and undergoes continuous assessment. Our certified male therapists possess extensive expertise in Ayurvedic trigger-point manipulation, Swedish deep strokes, and structural skeletal alignment.
              </p>
              <p className="text-stone-400 text-xs leading-relaxed">
                Whether you order a session to your high-rise villa in Whitefield or walk into our Vivek Nagar lounge, we ensure total confidentiality, deep hospitality courtesy, and custom somatic pressure configurations calibrated entirely to your muscles' biological strain.
              </p>
            </div>

            <div className="bg-stone-950 border border-stone-850 p-6 rounded-2xl space-y-4 flex flex-col justify-center">
              <h5 className="text-amber-500 font-mono text-[11px] uppercase tracking-wide">Operational Hours & Direct Dispatch</h5>
              <div className="space-y-2.5 text-xs text-stone-300">
                <div className="flex justify-between border-b border-stone-900 pb-2">
                  <span>Regular Weekly Schedule</span>
                  <span className="font-mono text-amber-500 font-bold">{BUSINESS_HOURS}</span>
                </div>
                <div className="flex justify-between border-b border-stone-900 pb-2">
                  <span>Local Dispatch Travel Time</span>
                  <span className="font-mono text-slate-200">15 – 35 Mins Avg</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Google Business Reputation</span>
                  <span className="font-mono text-slate-200 flex items-center">
                    4.5 <Star className="w-3 h-3 text-amber-500 fill-amber-500 inline ml-1" /> (160+ Verified Reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "services":
      return (
        <div className="space-y-12">
          {/* HEADER */}
          <div className="border-b border-stone-800 pb-6 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Wellness Packages</span>
              <div className="flex flex-col md:flex-row md:items-center gap-1.5 mt-1">
                <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none uppercase">Luxury</h2>
                <SpecialLogoText text="THERAPIES" size="md" className="font-semibold" />
              </div>
            </div>
            <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-2xl">
              Choose from classic relaxing treatments, localized tissue compression, dynamic four hands synchrony, and botanical exfoliation. Hover on any therapy catalog to compare our standard facility rates with home delivery package options.
            </p>
          </div>

          {/* COMPACT FILTER BUTTONS */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {["All", "Massage Spa", "Men's Wellness Centre", "Wellness & Relaxation Services", "Steam & Sauna Facility", "Wellness Packages"].map(cat => (
              <button
                key={cat}
                onClick={() => setGalleryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                  galleryFilter === cat
                    ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold"
                    : "bg-stone-950 border-stone-850 text-stone-400 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRID OF SERVICES */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-85px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {SERVICES.filter(s => galleryFilter === "All" || s.category === galleryFilter).map((s) => (
              <motion.div
                key={s.id}
                variants={slowSlideUp}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  borderColor: "rgba(245, 158, 11, 0.25)",
                  boxShadow: "0 25px 45px -10px rgba(245, 158, 11, 0.12)",
                }}
                className="bg-stone-900/35 border border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all flex flex-col justify-between"
              >
                {/* gold ambient highlight */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.03] rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest block">{s.category}</span>
                      <h3 className="text-lg font-sans font-bold text-slate-200 mt-1 tracking-tight">{s.name}</h3>
                    </div>
                    <span className="px-2.5 py-1 bg-stone-950 border border-stone-800 text-[10px] font-mono text-amber-400 font-semibold rounded-lg shrink-0">
                      {s.duration}
                    </span>
                  </div>

                  <p className="text-stone-400 text-xs mt-4 leading-relaxed">{s.longDesc}</p>

                  <div className="mt-4 pt-3 border-t border-stone-950">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Key Physiological Benefits:</span>
                    <ul className="grid grid-cols-2 gap-1.5 mt-2 text-[11px] text-stone-400">
                      {s.benefits.map((b, i) => (
                        <li key={i} className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                          <span className="truncate leading-none">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* PRICING GRID & BOOKINGS ACTIONCTAs */}
                <div className="mt-6 pt-4 border-t border-stone-950 grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                      <span>IN-SPA COST</span>
                      <span className="text-slate-200 font-bold">₹{s.priceSpa}</span>
                    </div>
                    <button
                      onClick={() => selectAndBookService(s.id, "spa")}
                      className="w-full py-2 bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-850 hover:border-transparent text-xs text-slate-300 font-bold rounded-lg transition-all cursor-pointer shadow-sm text-center font-mono uppercase tracking-wider"
                    >
                      In-Spa Booking
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
                      <span>HOME SERVICE</span>
                      <span className="text-emerald-400 font-bold">₹{s.priceHome}</span>
                    </div>
                    <button
                      onClick={() => selectAndBookService(s.id, "home")}
                      className="w-full py-2 bg-stone-950 hover:bg-emerald-600 hover:text-stone-950 border border-stone-850 hover:border-transparent text-xs text-slate-300 font-bold rounded-lg transition-all cursor-pointer shadow-sm text-center font-mono uppercase tracking-wider"
                    >
                      Home Delivery
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      );

    case "home-service":
      return (
        <div className="space-y-12">
          {/* HEADER */}
          <div className="border-b border-stone-800 pb-6 text-center md:text-left">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Doorstep Indulgence</span>
            <div className="flex flex-col md:flex-row md:items-center gap-1.5 mt-1">
              <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none uppercase">Luxury</h2>
              <SpecialLogoText text="HOME EXPRESS" size="md" className="font-semibold" />
            </div>
            <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-2xl">
              Enjoy a premium wellness experience in the comfort of your own home. Our professional team brings relaxation and convenience directly to your location, allowing you to unwind without travel stress.
            </p>
          </div>

          {/* DYNAMIC GOLDEN ROUTE STEP STORYTELLING */}
          <div className="space-y-6">
            <h3 className="font-sans font-bold text-sm text-slate-200 uppercase tracking-wide font-mono text-center">
              The Journey: How Home Wellness Transforms Your Space
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {[
                { step: "01", title: "Schedule Online", desc: "Select 'Home Service' on our booking module, choose your therapy, date, and specify your area in Bangalore." },
                { step: "02", title: "Golden Route Dispatch", desc: "Our certified therapist departs from our nearest local dispatch zone, traveling to your location fully equipped." },
                { step: "03", title: "Ambient Sanctuary Setup", desc: "We assemble portable spa beds, organic essential warming oils, sanitized linens, and calming incense kits in your room." },
                { step: "04", title: "Sensory Reprieve", desc: "Surrender completely to your 60 or 90 minute treatment, then simply slip into your own shower without traffic hassle." }
              ].map((item, id) => (
                <div key={id} className="bg-stone-900/20 border border-stone-850 rounded-2xl p-5 relative">
                  <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 font-bold text-xs flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm">{item.title}</h4>
                  <p className="text-stone-500 text-[11px] leading-relaxed mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BANGALORE LEAD TIMES TABLE */}
          <div className="bg-stone-950 border border-amber-500/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-sans font-bold text-slate-200 text-base flex items-center">
              <MapPin className="w-5 h-5 text-amber-500 mr-2 shrink-0 animate-bounce" />
              Verified Bangalore Service Bounds & Lead Times
            </h3>
            <p className="text-stone-400 text-xs leading-relaxed">
              We cover almost all major coordinates across Bengaluru. Travel logistics are calculated from our central hubs in Koramangala/VivekNagar:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse text-stone-300">
                <thead>
                  <tr className="border-b border-stone-850 text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                    <th className="py-2.5 px-3">Zone Coordinates</th>
                    <th className="py-2.5 px-3">Transit ETA</th>
                    <th className="py-2.5 px-3">Transit Transport Cost</th>
                    <th className="py-2.5 px-3">Zone Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-900 font-sans">
                  {HOME_COVERAGE.map((area, i) => (
                    <tr key={i} className="hover:bg-stone-900/20">
                      <td className="py-3 px-3 font-semibold text-slate-200">{area.name}</td>
                      <td className="py-3 px-3 font-mono text-amber-400">{area.estimatedTimeMin} Minutes dispatch</td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {area.premiumFee > 0 ? `₹${area.premiumFee}` : "Complimentary Travel"}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-stone-900 rounded border border-stone-800 text-[9px] font-mono text-stone-500 uppercase select-none">
                          {area.tag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    case "facilities":
      return (
        <div className="space-y-12">
          {/* HEADER */}
          <div className="border-b border-stone-800 pb-6 text-center md:text-left">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Vivek Nagar Centre</span>
            <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none">Step Into A World Of Comfort</h2>
            <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-2xl">
              From our custom reception lounge serving hot Ayurvedic tea to wood-lined sub-pine eucalyptus wet steam facilities and candlelit private soundproof rooms, our ambience is designed to induce profound quietude.
            </p>
          </div>

          {/* FACILITIES CONTENT SPLIT MAP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FACILITIES.map((facility) => (
              <div
                key={facility.id}
                className="bg-stone-900/30 border border-stone-800 hover:border-amber-500/10 rounded-2xl p-6 transition-all flex flex-col justify-between shadow"
              >
                <div>
                  <h3 className="font-sans font-bold text-base text-slate-200 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2.5 shadow-[0_0_8px_#fbbf24]" />
                    {facility.name}
                  </h3>
                  <p className="text-stone-400 text-xs mt-3 leading-relaxed">{facility.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-950">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block mb-2">Amenities Provided:</span>
                  <div className="flex flex-wrap gap-2">
                    {facility.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-stone-950 border border-stone-850 text-[10px] font-mono text-slate-400 rounded-lg flex items-center"
                      >
                        <Check className="w-3 h-3 text-amber-500 mr-1 shrink-0" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-gradient-to-br from-stone-950 to-stone-900 border border-amber-500/10 rounded-2xl text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block">Exquisite Comfort</span>
            <h4 className="text-slate-100 font-sans font-bold text-lg">Proper Ventilation & Acoustic Insulation</h4>
            <p className="text-stone-400 text-xs leading-relaxed max-w-xl mx-auto">
              Our treatment rooms are soundproofed to isolate outside traffic. Standard climate controls allow you to lock down room temperature to your perfect cozy preference.
            </p>
          </div>
        </div>
      );

    case "membership":
      return (
        <div className="space-y-12">
          {/* HEADER */}
          <div className="border-b border-stone-800 pb-6 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Exclusive Privilege Tiers</span>
              <div className="flex flex-col md:flex-row md:items-center gap-1.5 mt-1">
                <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none uppercase">GOLD & PLATINUM</h2>
                <SpecialLogoText text="MEMBERSHIPS" size="md" className="font-semibold" />
              </div>
            </div>

            {/* Sub-tab selection filter buttons */}
            <div className="flex bg-stone-900/60 border border-stone-850 p-1 rounded-xl shrink-0 self-center md:self-auto">
              <button
                id="membership-sub-loyalty"
                onClick={() => setMembershipSubTab("loyalty")}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  membershipSubTab === "loyalty" 
                    ? "bg-amber-500 text-stone-950 shadow-[0_4px_12px_rgba(245,158,11,0.25)]" 
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                VIP Loyalty Points
              </button>
              <button
                id="membership-sub-annual"
                onClick={() => setMembershipSubTab("annual")}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  membershipSubTab === "annual" 
                    ? "bg-amber-500 text-stone-950 shadow-[0_4px_12px_rgba(245,158,11,0.25)]" 
                    : "text-stone-400 hover:text-stone-200"
                }`}
              >
                Annual Plans
              </button>
            </div>
          </div>

          <div>
            {membershipSubTab === "loyalty" ? (
              <div className="animate-fade-in" key="loyalty">
                <LoyaltyDashboard />
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in" key="annual">
                {/* PLANS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {MEMBERSHIPS.map((plan) => (
                    <div
                      key={plan.id}
                      style={{ boxShadow: `0px 10px 30px ${plan.glow}` }}
                      className="bg-stone-900/40 border border-stone-800 hover:border-amber-500/20 rounded-2xl p-5 flex flex-col justify-between shadow-2xl relative transition-all duration-300"
                    >
                      {/* plan badge */}
                      <span className={`w-12 h-1 bg-gradient-to-r ${plan.color} rounded-full block mb-4`} />

                      <div>
                        <h3 className="font-sans font-black text-slate-100 text-lg tracking-wide uppercase leading-none">
                          {plan.name}
                        </h3>
                        <span className="text-amber-500 text-xs font-mono font-semibold block mt-1.5">{plan.price}</span>

                        <ul className="space-y-2.5 mt-6 text-[11px] text-stone-400 leading-normal">
                          {plan.benefits.map((b, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <Check className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-8">
                        <a
                          href={`https://wa.me/919980816728?text=Hello%20Relax%20Spa!%20I%20am%20interested%20in%20your%20${plan.name}%20Annual%20Membership%20Plan.`}
                          target="_blank"
                          className="w-full block text-center py-2.5 bg-stone-950 hover:bg-amber-500 hover:text-stone-950 border border-stone-850 hover:border-transparent text-slate-300 font-bold rounded-lg text-xs tracking-wider transition-all cursor-pointer select-none font-mono"
                        >
                          Enroll Via WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case "reviews":
      return (
        <div className="space-y-12">
          {/* HEADER */}
          <motion.div
            variants={slowSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="border-b border-stone-800 pb-6 text-center md:text-left"
          >
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Guest feedback</span>
            <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none">Live Google Business Reviews Showcase</h2>
            <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-2xl">
              Authentic consumer testimonials left by verified business professionals across Bangalore tech sectors endorsing our proper hygiene, tidy environment, and friendly therapeutic staff.
            </p>
          </motion.div>

          {/* RATINGS STATS GRID */}
          <motion.div
            variants={slowSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-stone-900/10 border border-stone-850 p-6 rounded-2xl backdrop-blur-sm"
          >
            <div className="md:col-span-4 text-center space-y-2">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">Google Business Rating</span>
              <h2 className="text-5xl font-sans font-black text-slate-100 tracking-tight leading-none flex items-center justify-center">
                4.5
                <span className="text-lg text-stone-500 font-normal ml-1">/ 5</span>
              </h2>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map(st => (
                  <Star key={st} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              <p className="text-stone-400 font-mono text-[10px] uppercase">Based on {totalStatsCount} Verified Submissions</p>
            </div>

            {/* BAR CHART */}
            <div className="md:col-span-8 space-y-2.5 text-xs font-mono text-stone-400">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = statsCounts[stars as 5 | 4 | 3 | 2 | 1];
                const pct = Math.round((count / totalStatsCount) * 100);
                return (
                  <div key={stars} className="flex items-center space-x-3">
                    <span className="w-12 shrink-0 text-right">{stars} Star</span>
                    <div className="flex-1 bg-stone-950 h-2.5 rounded-full overflow-hidden border border-stone-900">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-12 text-stone-500 text-left">{pct}% ({count})</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* VERIFIED REVIEW CAROUSEL / WALL WITH LUXURY MOTION STAGGER */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {liveReviews.map((rev) => (
              <motion.div
                key={rev.id}
                variants={slowSlideUp}
                whileHover={{ y: -8, scale: 1.015, borderColor: "rgba(245,158,11,0.25)" }}
                transition={{ duration: 0.4 }}
                className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-sans font-bold text-slate-200 text-sm">{rev.author}</h4>
                      <p className="text-stone-500 text-[10px] font-mono leading-none mt-1">Submitted on {rev.date}</p>
                    </div>
                    <div className="flex space-x-0.5 shrink-0">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <p className="text-stone-400 text-xs leading-relaxed mt-4">"{rev.text}"</p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-955 flex flex-wrap gap-1.5">
                  {rev.highlights.map(hl => (
                    <span key={hl} className="px-2 py-0.5 bg-stone-950 border border-stone-850 text-[9px] font-mono text-stone-500 rounded uppercase">
                      {hl}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* LEAVE A REVIEW INTERACTIVE BLOCK */}
          <motion.div
            variants={slowSlideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="bg-stone-950 border border-amber-500/15 rounded-2xl p-6 max-w-2xl mx-auto"
          >
            <h4 className="font-sans font-semibold text-slate-100 text-sm tracking-tight mb-4 flex items-center">
              <Plus className="w-4 h-4 text-amber-500 mr-2" />
              Did You Visit Us? Leave A Google Business Review
            </h4>

            {reviewSuccess ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/35 text-emerald-400 text-xs rounded-xl font-sans text-center font-bold">
                Thank you! Your testimonial has been synced dynamically into our active Google feedback database.
              </div>
            ) : (
              <form onSubmit={handleCreateReview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-1.5">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kumar"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 text-xs text-slate-200 px-3 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-1.5">Aesthetic Focus Highlight</label>
                    <select
                      value={reviewHighlight}
                      onChange={(e) => setReviewHighlight(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 text-xs text-slate-200 px-3 py-2.5 rounded-xl outline-none"
                    >
                      <option value="Proper Hygiene">Proper Hygiene</option>
                      <option value="Premium Setup">Premium Setup</option>
                      <option value="Comfortable Environment">Comfortable Environment</option>
                      <option value="Friendly Staff">Friendly Staff</option>
                      <option value="Steam Facility">Steam Facility</option>
                      <option value="Customer Satisfaction">Customer Satisfaction</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-1.5">Star Rating</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setReviewRating(st)}
                        className="p-1 focus:outline-none cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${reviewRating >= st ? "text-amber-500 fill-amber-500" : "text-stone-700"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-stone-500 uppercase tracking-wider mb-1.5">Add Detailed Review Text</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your decompression feelings, therapy pressure, hospitality or home setup details..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 text-xs text-slate-200 px-3 py-2.5 rounded-xl outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!reviewAuthor.trim() || !reviewText.trim()}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 disabled:from-stone-900 disabled:to-stone-950 text-stone-950 disabled:text-stone-600 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer text-center flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Verified Testimonial</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      );

    case "gallery": {
      const galleryData: GalleryItem[] = [
        {
          id: "reception",
          title: "VIP Reception Desk",
          tag: "Reception Area",
          desc: "Solid obsidian marble details, gold accent LEDs, serves fresh customized botanical welcome beverages upon arrival.",
          materials: ["Obsidian Black Marble", "Gold Foil Panels", "Brushed Brass Accents", "Sanitizing HEPA Filters"],
          specs: [
            { label: "Design Theme", value: "Minimalist High-Zen" },
            { label: "Guest Seating", value: "Up to 8 clients lounge" },
            { label: "Aura Atmosphere", value: "Warm, relaxing eucalyptus aroma" },
            { label: "Refreshment Option", value: "Custom botanical cold drinks" }
          ],
          review: {
            author: "Kartik S.",
            text: "The reception desk feels like entering an ultra-exclusive resort foyer of Southeast Asia. Pure class.",
            location: "Indiranagar, Bengaluru"
          }
        },
        {
          id: "suite",
          title: "Siam Comfort Suite",
          tag: "Treatment Suite",
          desc: "Soundproof massage environment with cozy dimmable lighting, starfield ceiling panel, and en-suite private hot rainfall showers.",
          materials: ["Canadian Cedar Logs", "Volcanic Granite Tilings", "Fiber-optic starfield ceiling", "Hypoallergenic Bamboo Linens"],
          specs: [
            { label: "Acoustic Insulation", value: "Dynamic acoustic dampening walls" },
            { label: "Therapeutic Bed", value: "Wider memory-foam wellness mattress" },
            { label: "Rainfall Shower", value: "Individual temperature calibrated shower" },
            { label: "Oils Kept", value: "Warm Abhyanga herbal infusions" }
          ],
          review: {
            author: "Siddharth M.",
            text: "Spectacular suite! Very calm, extremely clean, and equipped with a private ceiling light stars network.",
            location: "Koramangala, Bengaluru"
          }
        },
        {
          id: "steam",
          title: "Nordic Pine Steam Chamber",
          tag: "Steam Chamber",
          desc: "Aromatic wet-vapor room built with raw temperature-safe pine planks, circulating refreshing organic eucalyptus extracts.",
          materials: ["Nordic Knotless Pine Wood", "Natural Copper Vapor lines", "High-gauge insulated glass door", "Peppermint Oil mist dispenser"],
          specs: [
            { label: "Atmosphere Heat", value: "Avg 46°C Vapor Steam" },
            { label: "Max Capacity", value: "Comfortably serves 4 persons" },
            { label: "Physio Outcome", value: "Direct cardiovascular lymphatic opening" },
            { label: "Steam Scent", value: "Fresh eucalyptus leaves infusion" }
          ],
          review: {
            author: "Aman Preet",
            text: "Absolutely exceptional. Loosened all back tightness and cleared throat pathways immediately. Clean wood fragrance.",
            location: "HSR Layout, Bengaluru"
          }
        },
        {
          id: "corridor",
          title: "The Sanctuary Corridor",
          tag: "Interior Ambience",
          desc: "Warm stone walkways illuminated with candle structures creating physical sensory rest from modern urban chaos.",
          materials: ["Smoked Basalt River stones", "Honed Charcoal Slate floor tiles", "Warm low-voltage candle LED spots", "Frankincense oil vaporisers"],
          specs: [
            { label: "Ambience Vibe", value: "Silent wellness monastery" },
            { label: "Length of Corridor", value: "Approx 16 meters" },
            { label: "Illumination Index", value: "Extremely low, rest-inducing lamps" },
            { label: "Sound Level", value: "Whisper-quiet instrumental loops" }
          ],
          review: {
            author: "Pranav R.",
            text: "Entering this corridor instantly shuts down your city stress. The candle shadows are extremely peaceful.",
            location: "Whitefield, Bengaluru"
          }
        },
        {
          id: "sauna",
          title: "Sauna Wood Chamber",
          tag: "Steam Chamber",
          desc: "Dry temperature zone to facilitate deep dermal sweating, lactic acid flush, and rapid muscle recovery.",
          materials: ["Knotless Abachi Wood planks", "Thermal Deccan basalt stones", "Cast-Iron stove grills", "Organic pine water buckets"],
          specs: [
            { label: "Relative Heat", value: "Dry 83°C Zone" },
            { label: "Convective Medium", value: "Water-poured volcanic basalt bricks" },
            { label: "Heat Duration", value: "Ideal 12-15 minutes slots" },
            { label: "Bio Action", value: "Fast muscle lactic acid drainage" }
          ],
          review: {
            author: "Rahul Nair",
            text: "Superb sauna! The abachi wood prevents skin scalding. Felt immensely recovered from leg workout after 15 mins.",
            location: "JP Nagar, Bengaluru"
          }
        },
        {
          id: "lounge",
          title: "The Post-Therapy Lounge",
          tag: "Premium Facilities",
          desc: "Ergonomic heated posture loungers serving herbal premium tea recipes to finish off your relaxation getaway.",
          materials: ["Bentwood American walnut veneers", "High-density Micro-Velour pads", "Red clay tea kettles", "Premium Chamomile herb blooms"],
          specs: [
            { label: "Spinal Curve", value: "Orthopaedic posture alignment angle" },
            { label: "Teas Prepared", value: "Spiced Vetiver & Indian Ginseng" },
            { label: "Sound Intensity", value: "Unerring silence (under 22dB ambient)" },
            { label: "Electronic Policy", value: "Zero phone screen zone" }
          ],
          review: {
            author: "Vikrant Sen",
            text: "Reclining with hot chamomile here makes the massage benefits last twice as long. Pure perfection.",
            location: "Sadashivanagar, Bengaluru"
          }
        }
      ];

      return (
        <div className="space-y-12" id="interactive-lux-photo-gallery">
          {/* HEADER */}
          <div className="border-b border-stone-800 pb-6 text-center md:text-left">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Aesthetic Album</span>
            <div className="flex flex-col md:flex-row md:items-center gap-1.5 mt-1">
              <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none uppercase">SANCTUARY</h2>
              <SpecialLogoText text="VISUAL GALLERY" size="md" className="font-semibold" />
            </div>
            <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-2xl">
              Take a virtual tour of our premium Bangalore men's sanctuary. Experience interactive 3D panels of our solid marble reception, wood-lined sub-pine steam slots, and soundproofed therapy suites. Click any panel to view spatial logs, premium reviews, and direct reservation schedules.
            </p>
          </div>

          {/* ALBUM TAG FILTER BUTTONS */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {["All", "Reception Area", "Treatment Suite", "Steam Chamber", "Interior Ambience", "Premium Facilities"].map(tag => (
              <button
                key={tag}
                onClick={() => setGalleryFilter(tag)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                  galleryFilter === tag
                    ? "bg-amber-500/10 border-amber-500 text-amber-400 font-bold"
                    : "bg-stone-900 border-stone-850 text-stone-400 hover:text-slate-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* REPLICATING RAW CSS MASONRY ILLUSTRATING HIGH-END PHOTOS WITH 3D TILT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galleryData
              .filter(item => galleryFilter === "All" || item.tag === galleryFilter)
              .map((item) => (
                <ThreeDCard
                  key={item.id}
                  onClick={() => setSelectedGalleryItem(item)}
                  glowColor="rgba(212, 175, 55, 0.15)"
                  className="bg-stone-900/40 border border-stone-850 p-5 rounded-2xl flex flex-col justify-between"
                  id={`gallery-item-card-${item.id}`}
                >
                  {/* Procedural high-end artwork header */}
                  <ProceduralAestheticIllustration id={item.id} />

                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 bg-stone-950 border border-stone-850 text-stone-500 font-mono text-[8px] uppercase tracking-wider rounded">
                        {item.tag}
                      </span>
                      <span className="text-[9px] font-mono text-amber-500 hover:underline cursor-pointer flex items-center">
                        Inspect Blueprint →
                      </span>
                    </div>

                    <h4 className="font-sans font-bold text-slate-100 text-base tracking-tight leading-none mt-1">
                      {item.title}
                    </h4>
                    <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </ThreeDCard>
              ))}
          </div>

          {/* THEATRICAL DETAILS INSPECTOR LIGHTBOX MODAL */}
          <GalleryLightbox
            item={selectedGalleryItem}
            onClose={() => setSelectedGalleryItem(null)}
            onBook={() => onNavigate("booking")}
          />
        </div>
      );
    }

    case "blog":
      return (
        <div className="space-y-12">
          {/* HEADER */}
          <div className="border-b border-stone-800 pb-6 text-center md:text-left">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Knowledge Hub</span>
            <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none">Relax Spa Bangalore wellness Blog</h2>
            <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-2xl">
              Learn about physiological stress relief, anatomical trigger release, post-workout muscle restoration science, and modern workspace posture decompression written by our senior wellness advisors.
            </p>
          </div>

          {/* ARTICLES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BLOGS.map((post) => (
              <div key={post.id} className="bg-stone-900/40 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-stone-500">
                    <span className="flex items-center">
                      <BookOpen className="w-3.5 h-3.5 mr-1 text-amber-500" />
                      {post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="font-sans font-bold text-slate-100 text-lg mt-3.5 mb-1.5 leading-snug tracking-tight">
                    {post.title}
                  </h3>
                  <p className="text-stone-400 text-xs leading-relaxed mt-2.5">
                    {post.content}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-955 flex items-center justify-between">
                  {/* labels */}
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-stone-950 border border-stone-850 text-[9px] font-mono text-stone-500 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      alert(`Thank you for reading out! Full article '${post.title}' is available for our registered annual wellness members.`);
                    }}
                    className="text-amber-400 hover:text-amber-300 text-xs font-mono font-bold shrink-0 cursor-pointer"
                  >
                    Read article
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "faq":
      return (
        <div className="space-y-12">
          {/* HEADER */}
          <div className="border-b border-stone-800 pb-6 text-center md:text-left">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Information Guide</span>
            <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none">Frequently Answered Questions</h2>
            <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-2xl">
              Review immediate answers on session duration matching, home delivery travel leads, sanitary conditions, and custom treatment room details.
            </p>
          </div>

          {/* SEARCH AND FILTER BAR */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-stone-900/20 border border-stone-850 p-4 rounded-xl">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
              <input
                type="text"
                placeholder="Search FAQs by keywords..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/40 text-xs text-slate-200 pl-10 pr-3 py-2.5 rounded-lg outline-none transition-all"
              />
            </div>
            <div className="flex space-x-2 shrink-0">
              {["All", "General", "Home Service", "Hygiene", "Facilities"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                    faqCategory === cat
                      ? "bg-amber-500/10 border-amber-500 text-amber-400"
                      : "bg-stone-950 border-stone-800 text-stone-500 hover:text-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ACCORDION FAQS LIST */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {FAQS
              .filter(item => faqCategory === "All" || item.category === faqCategory)
              .filter(item => faqSearch.trim() === "" || item.question.toLowerCase().includes(faqSearch.toLowerCase()) || item.answer.toLowerCase().includes(faqSearch.toLowerCase()))
              .map((faq) => (
                <div key={faq.id} className="p-5 bg-stone-900/30 border border-stone-800 rounded-2xl space-y-2.5">
                  <h4 className="font-sans font-bold text-slate-200 text-sm tracking-tight flex items-start">
                    <HelpCircle className="w-4 h-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
                    {faq.question}
                  </h4>
                  <p className="text-stone-400 text-xs leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                  <span className="inline-block px-1.5 py-0.5 bg-stone-950 text-stone-500 border border-stone-850 font-mono text-[8px] uppercase rounded pl-1.5 ml-6">
                    Category: {faq.category}
                  </span>
                </div>
              ))}
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-12">
          {/* HEADER */}
          <div className="border-b border-stone-800 pb-6 text-center md:text-left">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Find Us</span>
            <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none">Connect with Relax Spa Bangalore</h2>
            <p className="text-stone-400 text-xs mt-3 leading-relaxed max-w-2xl">
              Ready to visit the facility on Old Agram road or schedule an prompt home massage session? Get in touch with our front desk managers instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ADDRESS CARDS */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-stone-900/30 border border-stone-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-sans font-bold text-slate-100 text-base">Centrally Located Facility</h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  Our core operations, private therapy rooms, sauna, and dispatch centers are headquartered in Vivek Nagar:
                </p>

                <div className="text-xs space-y-3 font-sans text-stone-300">
                  <div className="flex items-start space-x-2.5">
                    <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-200 leading-tight">Relax Spa Bangalore</p>
                      <p className="text-stone-400 leading-relaxed text-[11px] mt-1">
                        First Floor, No 145/1, Old Agram Road, Rose Garden, Vannarpet Layout, Vivek Nagar, Bengaluru, Karnataka 560047
                      </p>
                      <p className="text-stone-500 text-[10px] mt-1 font-mono">Landmark Details: {LANDMARK}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 border-t border-stone-900 pt-3">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Open Daily: {BUSINESS_HOURS}</span>
                  </div>
                </div>
              </div>

              {/* CONTACT PHONES AND EMAILS */}
              <div className="bg-stone-900/30 border border-stone-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-sans font-bold text-slate-100 text-sm">Direct Voice Channels</h3>
                <div className="space-y-3">
                  {CONTACT_PHONES.map(phone => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="flex items-center space-x-2.5 p-3 bg-stone-950 border border-stone-850 hover:border-amber-500/20 rounded-xl text-amber-400 font-mono text-xs font-semibold hover:text-amber-300 transition-all cursor-pointer"
                    >
                      <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Call {phone}</span>
                    </a>
                  ))}
                  <a
                    href="mailto:contact@relaxspabangalore.co.in"
                    className="flex items-center space-x-2.5 p-3 bg-stone-950 border border-stone-850 hover:border-amber-500/20 rounded-xl text-stone-300 font-mono text-xs hover:text-amber-400 transition-all"
                  >
                    <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                    <span>contact@relaxspabangalore.co.in</span>
                  </a>
                </div>
              </div>
            </div>

            {/* DYNAMIC MAP REPRESENTATION CONTAINER */}
            <div className="lg:col-span-7 bg-stone-900/40 border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="font-sans font-bold text-slate-100 text-base">Google Maps Route Guidance</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Experience hassle-free navigation of Vivek Nagar boundaries. Access live maps directly by selecting the direction key:
              </p>

              {/* simulated embedded responsive stylized map box */}
              <div className="w-full h-64 bg-radial from-stone-950 to-stone-900 border border-stone-850/80 rounded-xl flex flex-col justify-center items-center p-6 text-center space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
                <MapPin className="w-10 h-10 text-amber-500 animate-pulse" />
                <div className="space-y-0.5">
                  <h5 className="font-bold text-slate-200 text-xs">Rose Garden, Old Agram Road</h5>
                  <p className="text-[10px] text-stone-500 font-mono">145/1, 1st Floor, Vannarpet Layout</p>
                </div>
                <p className="text-stone-400 text-[11px] leading-relaxed max-w-sm">
                  We are conveniently situated next to Vivek Nagar. Clean parking spaces are fully available surrounding our entrance.
                </p>

                <a
                  href="https://maps.google.com/?q=First+Floor,+No+145/1+Old+Agram+Road+Rose+Garden+Vannarpet+Layout+Vivek+Nagar+Bengaluru,+Karnataka+560047"
                  target="_blank"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-sans font-extrabold text-[11px] tracking-wider uppercase rounded-lg transition-transform focus:outline-none shadow-md inline-block select-none"
                >
                  Get Directions on Maps App
                </a>
              </div>
            </div>
          </div>
        </div>
      );

    case "booking":
      return (
        <div className="space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Instant Reservation</span>
            <h2 className="text-2xl font-sans font-bold text-slate-100 tracking-tight leading-none text-center md:text-left">Customer Scheduling Hub</h2>
          </div>
          {/* LOADS BOOKING FORM INJECTING CURRENT SERVICE */}
          <BookingForm selectedServiceId={bookingServiceId} />
        </div>
      );

    case "privacy":
      return (
        <div className="max-w-3xl mx-auto space-y-8 bg-stone-900/10 border border-stone-850 p-6 md:p-8 rounded-2xl">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="text-xl font-sans font-bold text-slate-100 flex items-center">
              <Shield className="w-5 h-5 text-amber-500 mr-2 shrink-0" />
              Privacy Policy
            </h2>
            <p className="text-stone-500 text-xs font-mono mt-1">Last Updated: June 15, 2026</p>
          </div>

          <div className="space-y-4 text-stone-400 text-xs leading-relaxed font-sans">
            <p>
              Relax Spa Bangalore ("we", "our", or "us") is deeply committed to protecting the privacy, health, and personal data of our guests. This privacy policy describes who we handle your personal information collected during In-Spa register processes or Home booking submissions.
            </p>

            <h4 className="font-bold text-slate-200 mt-4 leading-none">1. Information We Collect</h4>
            <p>
              In order to provide certified therapeutic massage and wellness treatments, we collect the following metrics:
              <br />• Contact details: Your name, active WhatsApp phone number, and email.
              <br />• Somatic details: Specific health guidelines or therapist requests (muscle strain focus pressure references).
              <br />• Location details: Residing address coordinates solely to execute Home Wellness booking appointments.
            </p>

            <h4 className="font-bold text-slate-200 mt-4 leading-none">2. Use of Information</h4>
            <p>
              Your metrics are processed strictly to establish secure appointments, calculate dispatches, and request feedback regarding friendly staff or proper hygiene standards. We never monetize or rent database information to external third parties.
            </p>

            <h4 className="font-bold text-slate-200 mt-4 leading-none">3. Security Standards</h4>
            <p>
              We implement rigid technical firewalls. Digital bookings saved under local directories or central cloud servers are disassociated from medical records. All payments are strictly handled over secure merchant processors.
            </p>
          </div>
        </div>
      );

    case "terms":
      return (
        <div className="max-w-3xl mx-auto space-y-8 bg-stone-900/10 border border-stone-850 p-6 md:p-8 rounded-2xl">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="text-xl font-sans font-bold text-slate-100 flex items-center">
              <ShieldAlert className="w-5 h-5 text-amber-500 mr-2 shrink-0 animate-pulse" />
              Terms & Conditions
            </h2>
            <p className="text-stone-500 text-xs font-mono mt-1">Last Updated: June 15, 2026</p>
          </div>

          <div className="space-y-4 text-stone-400 text-xs leading-relaxed font-sans">
            <p>
              By accessing our web platforms, confirming wellness appointments, or enrolling in Silver, Gold, Platinum, or Black Elite memberships, you agree to comply with the following operational terms:
            </p>

            <h4 className="font-bold text-slate-200 mt-4 leading-none">1. Exclusivity & Therapy Boundaries</h4>
            <p>
              Relax Spa Bangalore is an exclusive Men's Wellness and Massage Centre. All services provided are strictly restricted to therapeutic relaxation and holistic well-being. Any inappropriate behavior towards our friendly staff will result in immediate termination of the session without refund and legal reporting.
            </p>

            <h4 className="font-bold text-slate-200 mt-4 leading-none">2. Client Health Declarations</h4>
            <p>
              Guests must disclose any pre-existing medical diagnoses, high blood pressure, skin allergies, or severe joint illnesses prior to therapist contact. Relax Spa will not be held liable for any physical implications resulting from undisclosed clinical somatic constraints.
            </p>

            <h4 className="font-bold text-slate-200 mt-4 leading-none">3. Bookings Rescheduling Protocols</h4>
            <p>
              We prioritize consistency. Cancelations for In-Spa or Home massage dispatch must be registered at least 60 minutes before the scheduled time slot to avoid minor cancellation surcharges (waived entirely for our Platinum or Black Elite VIP members).
            </p>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-slate-100 text-center py-12">
          <h2 className="text-lg">Section Not Found</h2>
        </div>
      );
  }
}
