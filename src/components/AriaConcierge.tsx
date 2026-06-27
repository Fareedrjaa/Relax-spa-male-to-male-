/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, User, HelpCircle, PhoneCall, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage } from "../types";

export default function AriaConcierge({ onNavigateToPage }: { onNavigateToPage: (page: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "aria",
      text: "Welcome to Relax Spa Bangalore. I'm Aria, your personal wellness concierge. Whether you're planning to visit our spa or book a home wellness session, I'll help you find the perfect experience.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const suggestionChips = [
    { text: "Recommend a massage for desk strain", query: "Can you recommend a therapy for back pain and long hours at my office desk?" },
    { text: "Explain your Home Wellness experience", query: "How does your Home Wellness service work? What do therapists bring?" },
    { text: "What areas in Bangalore do you cover?", query: "What are your Bangalore home service coverage areas and travel times?" },
    { text: "Help me choose a membership plan", query: "Which membership level offers the best value? Gold or Platinum?" },
    { text: "Hours & Location in Vivek Nagar", query: "Where is the spa located, what are the hours, and what do reviewers say?" }
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputMessage;
    if (!rawText.trim()) return;

    if (!textToSend) setInputMessage("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });

      if (!response.ok) {
        throw new Error("Failed to capture response");
      }

      const data = await response.json();
      const ariaMsg: ChatMessage = {
        id: `aria-${Date.now()}`,
        sender: "aria",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingMetadata: data.groundingMetadata
      };

      setMessages((prev) => [...prev, ariaMsg]);
    } catch (error) {
      console.error("Aria communication failed:", error);
      const errorMsg: ChatMessage = {
        id: `aria-err-${Date.now()}`,
        sender: "aria",
        text: "I do apologize, my cellular link to the central server is momentarily updating. Rest assured, our team at Relax Spa is fully active! You can instantly book by choosing 'Booking' on our top panel, or reach us directly on WhatsApp at +91 99808 16728.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="aria-concierge-toggle"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 font-semibold rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer hover:scale-105 hover:rotate-3 transition-transform duration-300 focus:outline-none"
        >
          {/* Breathing glow rings */}
          <span className="absolute inset-0 rounded-full bg-amber-500/30 animate-ping" />
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-extrabold bg-emerald-600 text-white rounded-full leading-none animate-pulse">
            Aria
          </span>

          {/* Magnetic hover tooltip */}
          <div className="absolute right-16 hidden group-hover:flex items-center px-3 py-1 bg-zinc-900 border border-amber-500/20 text-amber-400 text-xs font-medium rounded-lg whitespace-nowrap shadow-xl">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Talk to Aria Concierge
          </div>
        </button>
      </div>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="aria-chat-panel"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-950/95 backdrop-blur-xl border-l border-amber-500/20 z-50 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Header Section */}
            <div className="p-4 border-b border-amber-500/15 bg-gradient-to-r from-stone-900 to-stone-950 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-lg">
                    AR
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-stone-950 rounded-full" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-slate-100 text-sm tracking-wide flex items-center">
                    ARIA
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 ml-1.5 animate-pulse" />
                  </h3>
                  <p className="text-stone-400 text-[11px] font-mono leading-none mt-1">
                    Luxury Wellness Concierge
                  </p>
                </div>
              </div>
              <button
                id="close-aria-chat"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500/20 active:scale-95 transition-all outline-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chats Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex items-start space-x-2.5 ${
                    m.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                  }`}
                >
                  {/* Sender Icon */}
                  <div
                    className={`w-7 aistudio-avatar h-7 rounded-full flex items-center justify-center text-xs shrink-0 select-none ${
                      m.sender === "user"
                        ? "bg-stone-800 text-slate-300"
                        : "bg-amber-500/10 border border-amber-500/25 text-amber-500"
                    }`}
                  >
                    {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : "A"}
                  </div>

                  {/* Message bubble */}
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={`px-3.5 py-2.5 text-xs rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        m.sender === "user"
                          ? "bg-amber-600 text-stone-950 rounded-tr-none font-medium shadow-[0_4px_12px_rgba(217,119,6,0.15)]"
                          : "bg-stone-900/60 border border-amber-500/10 text-slate-200 rounded-tl-none font-sans shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* Google Search Grounding Citations */}
                    {m.groundingMetadata?.groundingChunks && m.groundingMetadata.groundingChunks.length > 0 && (
                      <div className="mt-2 p-2.5 bg-stone-900 border border-amber-500/10 rounded-xl text-[10px] font-mono text-stone-400 space-y-1.5 shadow-inner">
                        <div className="flex items-center text-[9px] text-amber-500/80 font-bold tracking-widest uppercase">
                          <Sparkles className="w-2.5 h-2.5 mr-1" />
                          Google Verified Sources
                        </div>
                        {(() => {
                          // Keep track of unique links to avoid duplicate list clutter
                          const seenUrls = new Set<string>();
                          return m.groundingMetadata.groundingChunks.map((chunk: any, chunkIdx: number) => {
                            const uri = chunk.web?.uri;
                            const title = chunk.web?.title;
                            if (uri && !seenUrls.has(uri)) {
                              seenUrls.add(uri);
                              return (
                                <div key={chunkIdx} className="flex items-start space-x-1">
                                  <span className="text-amber-500/40 shrink-0">[{seenUrls.size}]</span>
                                  <a
                                    href={uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-400 hover:underline hover:text-amber-300 truncate transition-colors"
                                    title={title || uri}
                                  >
                                    {title || uri}
                                  </a>
                                </div>
                              );
                            }
                            return null;
                          });
                        })()}
                      </div>
                    )}

                    <span
                      className={`text-[9px] font-mono text-stone-500 mt-1 ${
                        m.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {/* Bot typing loader indicator */}
              {isLoading && (
                <div className="flex items-start space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 flex items-center justify-center text-xs shrink-0">
                    A
                  </div>
                  <div className="bg-stone-900/60 border border-amber-500/10 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] flex items-center space-x-1 shadow-md">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions Drawer */}
            <div className="px-4 py-2 bg-stone-950 border-t border-amber-500/5">
              <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-1.5 flex items-center">
                <HelpCircle className="w-3 h-3 text-amber-500/50 mr-1" />
                Frequently Requested Tips
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto py-0.5 scrollbar-thin">
                {suggestionChips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleChipClick(chip.query)}
                    className="px-2 py-1 bg-stone-900 hover:bg-amber-500/10 border border-stone-800 hover:border-amber-500/20 text-[10px] text-slate-300 hover:text-amber-400 rounded-md transition-all text-left whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {chip.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form Section */}
            <div className="p-3 bg-stone-900/90 border-t border-amber-500/15">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask Aria about services, booking or rates..."
                  className="flex-1 bg-stone-950 border border-stone-800 hover:border-amber-500/20 focus:border-amber-500/50 text-xs text-slate-100 placeholder-stone-500 px-3 py-2.5 rounded-xl transition-all outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 disabled:from-stone-800 disabled:to-stone-900 text-stone-950 disabled:text-stone-600 rounded-xl shadow-lg flex items-center justify-center transition-all cursor-pointer font-bold shrink-0 hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between mt-2.5 text-[10px] text-stone-500 font-mono">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 text-amber-500/40 mr-1" />
                  Opens 8 AM - 10:30 PM
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToPage("booking");
                  }}
                  className="text-amber-500 hover:underline flex items-center font-semibold cursor-pointer shrink-0"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
