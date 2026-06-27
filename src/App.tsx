/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles, Sliders, Menu, X, Play, Pause, Volume2, MapPin, Phone, MessageSquare, ChevronDown, Compass, Calendar, Award, BookOpen, Layers, Clock, HelpCircle, ShieldAlert, User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ParticleBackground from "./components/ParticleBackground";
import AriaConcierge from "./components/AriaConcierge";
import Pages from "./components/Pages";
import AnimatedLogo from "./components/AnimatedLogo";
import SpecialLogoText from "./components/SpecialLogoText";
import FloatingLogoCursor from "./components/FloatingLogoCursor";
import { BRAND_NAME, BUSINESS_NAME, TAGLINE, SECONDARY_TAGLINE, CONTACT_PHONES, ADDRESS, BUSINESS_HOURS } from "./data";
import { useFirebase } from "./components/FirebaseContext";

export default function App() {
  const { user, signIn, logOut } = useFirebase();
  const [showIntro, setShowIntro] = useState(true);
  const [activePage, setActivePage] = useState<string>("home");
  const [bookingServiceId, setBookingServiceId] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isAntigravityActive, setIsAntigravityActive] = useState(false);

  // Synchronize dynamic window variables for canvas repulsion
  useEffect(() => {
    (window as any).antigravityPower = isAntigravityActive;
  }, [isAntigravityActive]);

  // Web Audio Synth state for luxury ambient sound
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Toggle ambient music synthetically using Oscillator Nodes (no asset dependency)
  const toggleAmbientSound = () => {
    if (isPlayingAudio) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 1.5);
      }
      setTimeout(() => {
        try {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
        } catch (e) {}
        setIsPlayingAudio(false);
      }, 1500);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNodeRef.current = gainNode;

        const filterNode = ctx.createBiquadFilter();
        filterNode.type = "lowpass";
        filterNode.frequency.setValueAtTime(280, ctx.currentTime);

        // Slow cinematic healing notes
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 note

        const osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(165, ctx.currentTime); // E3 fifth interval

        osc1.connect(filterNode);
        osc2.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        osc1Ref.current = osc1;
        osc2Ref.current = osc2;

        gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 3);
        setIsPlayingAudio(true);
      } catch (err) {
        console.warn("Web Audio API not supported on this container:", err);
      }
    }
  };

  // Clean ambient audio upon unmount
  useEffect(() => {
    return () => {
      try {
        osc1Ref.current?.stop();
        osc2Ref.current?.stop();
        audioCtxRef.current?.close();
      } catch (e) {}
    };
  }, []);

  const handleSelectIntroMode = (mode: "spa" | "home") => {
    setShowIntro(false);
    setActivePage("home");
    // Start ambient music immediately with consent play if they enter
    toggleAmbientSound();
    if (mode === "home") {
      setActivePage("home-service");
    }
  };

  const navigateToPage = (pageName: string) => {
    setActivePage(pageName);
    setIsMobileMenuOpen(false);
    setIsMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-400 relative overflow-x-hidden">
      {/* Particle stream background layer */}
      <ParticleBackground />

      <AnimatePresence mode="wait">
        {/* CINEMATIC BENGALURU SKYLINE INTRO SCREEN */}
        {showIntro ? (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-stone-950 z-50 flex flex-col justify-between p-6 overflow-hidden md:p-12"
          >
            {/* Ambient gold towers background wireframe */}
            <div className="absolute inset-0 flex items-end justify-center pointer-events-none opacity-20">
              <div className="w-full max-w-5xl h-64 flex justify-between items-end px-6 gap-2">
                <div className="w-12 bg-gradient-to-t from-amber-500/30 to-transparent h-48 rounded-t" />
                <div className="w-16 bg-gradient-to-t from-amber-500/40 to-transparent h-64 rounded-t" />
                <div className="w-20 bg-gradient-to-t from-amber-500/20 to-transparent h-40 rounded-t" />
                <div className="w-14 bg-gradient-to-t from-amber-500/35 to-transparent h-56 rounded-t" />
                <div className="w-24 bg-gradient-to-t from-amber-500/50 to-transparent h-72 rounded-t" />
                <div className="w-16 bg-gradient-to-t from-amber-500/25 to-transparent h-44 rounded-t" />
              </div>
            </div>

            {/* Top info header */}
            <div className="flex justify-between items-center text-[10px] font-mono text-amber-500/70 tracking-widest uppercase">
              <span>Bengaluru Edition</span>
              <span>ESTD. 2026</span>
            </div>

            {/* Central forming Relax Spa logo and choices */}
            <div className="max-w-xl mx-auto text-center space-y-8 relative z-10 my-auto font-sans">
              {/* Custom animated geometric gold logo */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut"
                }}
                className="flex justify-center"
              >
                <AnimatedLogo size="lg" className="shadow-[0_0_60px_rgba(245,158,11,0.2)] rounded-full" />
              </motion.div>

              <div className="space-y-3">
                <div className="pt-2">
                  <SpecialLogoText text="RELAX SPA" size="lg" className="mx-auto select-none" />
                </div>
                <p className="text-[11px] font-mono tracking-[0.25em] text-amber-500 uppercase">
                  {TAGLINE}
                </p>
                <p className="text-stone-400 text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
                  Experiencing premium wellness in Vivek Nagar, or bring the entire luxury temple directly to your home.
                </p>
              </div>

              {/* DUAL CHOOSING PANEL BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-4">
                <button
                  id="intro-choice-spa"
                  onClick={() => handleSelectIntroMode("spa")}
                  className="px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.99] hover:scale-[1.02] transition-all cursor-pointer block"
                >
                  SPA EXPERIENCE
                </button>
                <button
                  id="intro-choice-home"
                  onClick={() => handleSelectIntroMode("home")}
                  className="px-6 py-4 bg-stone-900 hover:bg-stone-850 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 font-sans font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer block"
                >
                  HOME WELLNESS
                </button>
              </div>
            </div>

            {/* Bottom Tagline & Consent Note */}
            <div className="text-center text-stone-500 text-[10px] font-mono leading-none">
              <span>{SECONDARY_TAGLINE} • Soft luxury zen sound will start upon entry</span>
            </div>
          </motion.div>
        ) : (
          /* REGULAR SEAMLESS APPLICATION WORLD */
          <motion.div
            key="app-world"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen"
          >
            {/* Next Gen Moving 3D Logo Everywhere Orbit Segment */}
            <FloatingLogoCursor />
            {/* FIXED STICKY NAVIGATION BAR */}
            <header className="sticky top-0 bg-stone-950/85 backdrop-blur-xl border-b border-amber-500/10 z-40 transition-all">
              <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                
                {/* Brand Logo cluster */}
                <button
                  id="logo-brand-btn"
                  onClick={() => navigateToPage("home")}
                  className="flex items-center space-x-2.5 w-auto border-none bg-transparent hover:opacity-90 transition-opacity outline-none text-left cursor-pointer"
                >
                  <AnimatedLogo size="sm" className="shadow-[0_0_15px_rgba(245,158,11,0.25)] shrink-0" />
                  <div className="leading-none flex flex-col items-start gap-0.5">
                    <SpecialLogoText text={BRAND_NAME} size="sm" className="font-bold uppercase" />
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.2em] block mt-0.5">
                      Men's Wellness
                    </span>
                  </div>
                </button>

                {/* DESKTOP HEADER NAVIGATION */}
                <nav className="hidden lg:flex items-center space-x-1.5 text-xs text-stone-400 font-sans">
                  <button
                    onClick={() => navigateToPage("home")}
                    className={`px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                      activePage === "home" ? "text-amber-400 font-bold bg-stone-900/40" : "hover:text-slate-200"
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => navigateToPage("services")}
                    className={`px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                      activePage === "services" ? "text-amber-400 font-bold bg-stone-900/40" : "hover:text-slate-200"
                    }`}
                  >
                    Services
                  </button>
                  <button
                    onClick={() => navigateToPage("home-service")}
                    className={`px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                      activePage === "home-service" ? "text-amber-400 font-bold bg-stone-900/40" : "hover:text-slate-200"
                    }`}
                  >
                    Home Service
                  </button>
                  <button
                    onClick={() => navigateToPage("facilities")}
                    className={`px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                      activePage === "facilities" ? "text-amber-400 font-bold bg-stone-900/40" : "hover:text-slate-200"
                    }`}
                  >
                    Facilities
                  </button>
                  <button
                    onClick={() => navigateToPage("membership")}
                    className={`px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                      activePage === "membership" ? "text-amber-400 font-bold bg-stone-900/40" : "hover:text-slate-200"
                    }`}
                  >
                    Memberships
                  </button>
                  <button
                    onClick={() => navigateToPage("gallery")}
                    className={`px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                      activePage === "gallery" ? "text-amber-400 font-bold bg-stone-900/40" : "hover:text-slate-200"
                    }`}
                  >
                    Gallery
                  </button>
                  <button
                    onClick={() => navigateToPage("reviews")}
                    className={`px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                      activePage === "reviews" ? "text-amber-400 font-bold bg-stone-900/40" : "hover:text-slate-200"
                    }`}
                  >
                    Reviews
                  </button>

                  {/* DROP DOWN MENU TRIGGER */}
                  <div className="relative">
                    <button
                      id="more-dropdown-trigger"
                      onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                      className="px-3 py-2 rounded-lg hover:text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>More</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    <AnimatePresence>
                      {isMoreMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-10 w-44 bg-zinc-950/95 border border-stone-800 rounded-xl p-1.5 shadow-2xl flex flex-col space-y-0.5"
                        >
                          {[
                            { name: "About Us", target: "about" },
                            { name: "Decompression Blogs", target: "blog" },
                            { name: "FAQs", target: "faq" },
                            { name: "Contacts", target: "contact" },
                            { name: "Privacy Policies", target: "privacy" },
                            { name: "Terms & Conditions", target: "terms" }
                          ].map((item) => (
                            <button
                              key={item.target}
                              onClick={() => navigateToPage(item.target)}
                              className="w-full text-left px-3 py-2 rounded-lg text-xs text-stone-400 hover:text-slate-200 hover:bg-stone-900/60"
                            >
                              {item.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </nav>

                {/* AUDIO CONTROLLER AND BOOKING BUTTON */}
                <div className="flex items-center space-x-3">
                  {/* Antigravity Power Controller Button */}
                  <button
                    id="antigravity-power-toggle"
                    onClick={() => setIsAntigravityActive(!isAntigravityActive)}
                    title="Toggle Antigravity Levitation System"
                    className={`w-9 h-9 border rounded-xl flex items-center justify-center transition-all cursor-pointer relative focus:outline-none ${
                      isAntigravityActive
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                        : "bg-stone-900/60 border-stone-800 text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${isAntigravityActive ? "animate-[spin_4s_linear_infinite] text-amber-400" : "opacity-50"}`} />
                    {isAntigravityActive && (
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full absolute -top-0.5 -right-0.5 animate-ping" />
                    )}
                  </button>

                  {/* Drone Audio Synth Play Button */}
                  <button
                    id="ambient-audio-toggle"
                    onClick={toggleAmbientSound}
                    title="Toggle luxury ambient spa music"
                    className={`w-9 h-9 border rounded-xl flex items-center justify-center transition-all cursor-pointer relative focus:outline-none ${
                      isPlayingAudio
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-500"
                        : "bg-stone-900/60 border-stone-800 text-stone-500 hover:text-stone-300"
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Volume2 className="w-4 h-4 animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full absolute -top-0.5 -right-0.5 animate-ping" />
                      </>
                    ) : (
                      <Volume2 className="w-4 h-4 opacity-50" />
                    )}
                  </button>

                  <button
                    onClick={() => navigateToPage("booking")}
                    className="hidden md:inline-block px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs uppercase tracking-wider font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
                  >
                    Book Now
                  </button>

                  {/* DESKTOP GOOGLE AUTH PORTAL */}
                  {!user ? (
                    <button
                      id="header-sign-in-btn"
                      onClick={() => signIn().catch(() => {})}
                      className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-900 border border-amber-500/20 text-xs font-semibold uppercase tracking-wider text-amber-500 rounded-xl hover:bg-amber-500/10 cursor-pointer animate-fade-in"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                  ) : (
                    <div className="hidden lg:flex items-center space-x-3 bg-stone-900/60 pl-2.5 pr-1.5 py-1.5 border border-stone-800 rounded-xl text-xs animate-fade-in">
                      <div className="flex items-center space-x-1.5">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || "User"}
                            referrerPolicy="no-referrer"
                            className="w-4.5 h-4.5 rounded-full border border-amber-500/30"
                          />
                        ) : (
                          <User className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="text-slate-300 font-mono tracking-tight font-medium max-w-[90px] truncate">
                          {user.displayName?.split(" ")[0]}
                        </span>
                      </div>
                      <button
                        onClick={() => logOut()}
                        className="px-1.5 py-0.5 text-[9px] font-bold text-red-400 bg-red-950/40 hover:bg-red-950/80 rounded-md uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Exit
                      </button>
                    </div>
                  )}

                  {/* MOBILE MENU TOGGLE BUTTON */}
                  <button
                    id="mobile-navigation-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden w-9 h-9 bg-stone-900 border border-stone-850 text-slate-300 rounded-xl flex items-center justify-center hover:text-amber-400 active:scale-95 transition-all cursor-pointer"
                  >
                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* MOBILE FULL-SCREEN NAVIGATION PANEL DROPDOWN */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden absolute top-16 left-0 w-full bg-stone-950/95 backdrop-blur-2xl border-b border-stone-800 p-6 flex flex-col space-y-1.5 max-h-[80vh] overflow-y-auto"
                  >
                    {/* MOBILE USER SIGN IN AND OUT STATUS BAR */}
                    {!user ? (
                      <div className="px-4 py-2 bg-stone-900/40 rounded-xl border border-stone-850 flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-mono text-stone-500">
                          Cloud Session Inactive
                        </span>
                        <button
                          onClick={() => signIn().catch(() => {})}
                          className="px-3 py-1 bg-amber-500 text-stone-950 text-[10px] uppercase tracking-wider font-extrabold rounded-lg hover:scale-102 flex items-center space-x-1 cursor-pointer"
                        >
                          <User className="w-3 h-3" />
                          <span>Sign In</span>
                        </button>
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-stone-900/40 rounded-xl border border-stone-850 flex items-center justify-between mb-2 animate-fade-in">
                        <div className="flex items-center space-x-2">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.displayName || ""}
                              referrerPolicy="no-referrer"
                              className="w-5 h-5 rounded-full border border-amber-500/20"
                            />
                          ) : (
                            <User className="w-4 h-4 text-amber-400" />
                          )}
                          <span className="text-xs text-slate-300 font-mono font-medium max-w-[130px] truncate">
                            {user.displayName}
                          </span>
                        </div>
                        <button
                          onClick={() => logOut()}
                          className="text-red-400 text-[10px] uppercase font-mono hover:underline font-bold"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}

                    <div className="h-px bg-stone-900 my-1" />

                    {[
                      { name: "Home", tab: "home" },
                      { name: "Services", tab: "services" },
                      { name: "Home Services", tab: "home-service" },
                      { name: "Facilities Area", tab: "facilities" },
                      { name: "Memberships Plans", tab: "membership" },
                      { name: "Review Wall", tab: "reviews" },
                      { name: "Gallery Tour", tab: "gallery" },
                      { name: "About Us", tab: "about" },
                      { name: "Decompression Blog", tab: "blog" },
                      { name: "Frequently Asked FAQs", tab: "faq" },
                      { name: "Contact & GPS Directions", tab: "contact" },
                      { name: "Secure Booking System", tab: "booking" },
                      { name: "Privacy Policy", tab: "privacy" },
                      { name: "Terms & Conditions", tab: "terms" }
                    ].map((item) => (
                      <button
                        key={item.tab}
                        onClick={() => navigateToPage(item.tab)}
                        className={`w-full text-left py-2.5 px-4 rounded-xl text-xs font-sans font-medium transition-all ${
                          activePage === item.tab
                            ? "bg-amber-500/10 text-amber-400 font-bold border-l-2 border-amber-500"
                            : "text-stone-400 hover:text-slate-100"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* CORE APP BODY ZONE (CENTRAL AREA) */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                >
                  <Pages
                    activePage={activePage}
                    onNavigate={navigateToPage}
                    bookingServiceId={bookingServiceId}
                    setBookingServiceId={setBookingServiceId}
                  />
                </motion.div>
              </AnimatePresence>
            </main>

            {/* WELLNESS APP FLOATING CONCIERGE (ARIA) */}
            <AriaConcierge onNavigateToPage={navigateToPage} />

            {/* EXECUTIVE PREMIUM FOOTER */}
            <footer className="bg-stone-950 border-t border-stone-900 mt-20 relative z-10 text-xs">
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 text-stone-400">
                {/* Branding footer widget */}
                <div className="md:col-span-4 space-y-4">
                  <div className="flex items-center space-x-2.5">
                    <AnimatedLogo size="sm" className="shadow-[0_0_15px_rgba(245,158,11,0.22)] shrink-0" />
                    <SpecialLogoText text={BRAND_NAME} size="sm" className="font-bold uppercase" />
                  </div>
                  <p className="text-stone-500 leading-relaxed text-[11px]">
                    {BUSINESS_NAME}
                    <br />
                    Bangalore's premium wellness destination supplying male-to-male massage therapies, wood sauna paths, and digitized home dispatcher massage systems. Honest hospitality.
                  </p>
                  <p className="text-stone-500 text-[10px] font-mono whitespace-nowrap">ESTD 2026 • © All Rights Reserved</p>
                </div>

                {/* Quick Menu */}
                <div className="md:col-span-3 space-y-3.5">
                  <h4 className="font-bold text-slate-200 text-xs font-mono uppercase tracking-wider">Quick Catalog</h4>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                    <button onClick={() => navigateToPage("home")} className="text-left hover:text-amber-400 transition-colors">Home</button>
                    <button onClick={() => navigateToPage("services")} className="text-left hover:text-amber-400 transition-colors">Services</button>
                    <button onClick={() => navigateToPage("facilities")} className="text-left hover:text-amber-400 transition-colors">Facilities</button>
                    <button onClick={() => navigateToPage("membership")} className="text-left hover:text-amber-400 transition-colors">Memberships</button>
                    <button onClick={() => navigateToPage("gallery")} className="text-left hover:text-amber-400 transition-colors">Gallery</button>
                    <button onClick={() => navigateToPage("reviews")} className="text-left hover:text-amber-400 transition-colors">Reviews</button>
                  </div>
                </div>

                {/* Physical Area Links */}
                <div className="md:col-span-2 space-y-3.5">
                  <h4 className="font-bold text-slate-200 text-xs font-mono uppercase tracking-wider">Policies</h4>
                  <div className="flex flex-col space-y-2 text-[11px] font-sans">
                    <button onClick={() => navigateToPage("faq")} className="text-left hover:text-amber-400 transition-colors">FAQs</button>
                    <button onClick={() => navigateToPage("privacy")} className="text-left hover:text-amber-400 transition-colors">Privacy Policy</button>
                    <button onClick={() => navigateToPage("terms")} className="text-left hover:text-amber-400 transition-colors">Terms of Service</button>
                    <button onClick={() => navigateToPage("contact")} className="text-left hover:text-amber-400 transition-colors">Contacts</button>
                  </div>
                </div>

                {/* Address summary widget */}
                <div className="md:col-span-3 space-y-3.5">
                  <h4 className="font-bold text-slate-200 text-xs font-mono uppercase tracking-wider">The Vivek Nagar Spa</h4>
                  <p className="text-[11px] text-stone-500 leading-tight block">
                    {ADDRESS}
                  </p>
                  <p className="text-amber-500 font-bold font-mono text-[10px] mt-2 block">
                    Open Daily: {BUSINESS_HOURS}
                  </p>
                  <div className="pt-2 flex flex-col space-y-1">
                    {CONTACT_PHONES.map(p => (
                      <a key={p} href={`tel:${p.replace(/\s+/g,"")}`} className="text-slate-300 font-mono text-[11px] hover:text-amber-400 transition-colors">
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
