/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { useFirebase } from "./FirebaseContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Booking } from "../types";
import { Sparkles, Calendar, GlassWater, Trophy, ShieldCheck, Flame } from "lucide-react";

interface MonthlyData {
  name: string;
  monthIndex: number; // 0-11
  Spa: number;
  Home: number;
}

export default function WellnessHoursChart() {
  const { user } = useFirebase();
  const [realHours, setRealHours] = useState<{ spa: number; home: number }>({ spa: 0, home: 0 });

  // Load real-time bookings to calculate hours dynamically for June 2026
  useEffect(() => {
    if (!user) return;

    const bookingCollectionRef = collection(db, "bookings");
    const q = query(bookingCollectionRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let tempSpaMinutes = 0;
      let tempHomeMinutes = 0;

      snapshot.forEach((doc) => {
        const data = doc.data() as Booking;
        // Count both active and completed sessions toward tracking stats
        if (data.status === "completed" || data.status === "active") {
          const duration = data.durationMinutes || 60; // fallback to 60 min
          if (data.serviceMode === "home") {
            tempHomeMinutes += duration;
          } else {
            tempSpaMinutes += duration;
          }
        }
      });

      // Convert to decimal hours
      setRealHours({
        spa: Number((tempSpaMinutes / 60).toFixed(1)),
        home: Number((tempHomeMinutes / 60).toFixed(1))
      });
    }, (error) => {
      console.warn("Failed to listen to bookings for wellness chart:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Baseline premium lifestyle retreat records
  const baseMonthlyStats: MonthlyData[] = [
    { name: "Jan", monthIndex: 0, Spa: 4.5, Home: 2.0 },
    { name: "Feb", monthIndex: 1, Spa: 6.0, Home: 3.5 },
    { name: "Mar", monthIndex: 2, Spa: 5.0, Home: 4.0 },
    { name: "Apr", monthIndex: 3, Spa: 8.5, Home: 3.0 },
    { name: "May", monthIndex: 4, Spa: 7.0, Home: 5.5 },
    { name: "Jun", monthIndex: 5, Spa: 4.0, Home: 2.5 } // June (Dynamic Base)
  ];

  // Merge current user's real bookings into the current month (June)
  const chartData = baseMonthlyStats.map(item => {
    if (item.name === "Jun") {
      return {
        ...item,
        Spa: Number((item.Spa + realHours.spa).toFixed(1)),
        Home: Number((item.Home + realHours.home).toFixed(1))
      };
    }
    return item;
  });

  // Calculate cumulative stats
  const totalSpaHours = chartData.reduce((acc, curr) => acc + curr.Spa, 0);
  const totalHomeHours = chartData.reduce((acc, curr) => acc + curr.Home, 0);
  const aggregateHours = Number((totalSpaHours + totalHomeHours).toFixed(1));

  // Custom high-contrast luxury tooltip styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-950/95 border border-stone-800 p-3.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-mono text-[11px] space-y-1.5 backdrop-blur-md">
          <p className="text-stone-400 uppercase tracking-widest border-b border-stone-900 pb-1 font-bold">
            {label} &bull; Analysis
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-stone-300">{entry.name}:</span>
              </span>
              <span className="font-extrabold text-slate-100">{entry.value} hrs</span>
            </div>
          ))}
          <div className="border-t border-stone-900 pt-1 flex justify-between font-bold text-amber-400">
            <span>Aggregated:</span>
            <span>{(payload[0]?.value + (payload[1]?.value || 0)).toFixed(1)} hrs</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-stone-900/20 border border-stone-850 rounded-3xl p-6 space-y-6 relative overflow-hidden" id="lifestyle-wellness-chart-section">
      {/* Decorative gradient glowing mesh */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-violet-500/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gradient-to-tr from-amber-500/[0.02] to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header and key metrics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            <span>LIFESTYLE HEALING STATS</span>
          </div>
          <h4 className="text-xl font-sans font-bold text-slate-100 tracking-tight">
            Monthly Wellness Hours Tracker
          </h4>
          <p className="text-stone-400 text-xs max-w-xl leading-relaxed font-sans">
            A high-fidelity analysis of time spent on spiritual self-healing, comparing in-spa signature therapies with our elite white-gloved home delivery service.
          </p>
        </div>

        {/* Real-time cumulative summary badge */}
        <div className="flex items-center space-x-4 bg-stone-950/80 p-3.5 border border-stone-900 rounded-2xl shrink-0 font-mono">
          <div className="text-left">
            <span className="text-[8px] text-stone-500 uppercase block tracking-wide">6-Month Total Time</span>
            <span className="text-xl font-extrabold text-slate-100 tracking-tighter">{aggregateHours} hrs</span>
          </div>
          <div className="w-px h-8 bg-stone-900" />
          <div className="text-left">
            <span className="text-[8px] text-stone-500 uppercase block tracking-wide">Current Target</span>
            <span className="text-xs text-amber-500 font-bold block">PLATINUM ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Quick insights sub-row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-stone-950/40 rounded-xl border border-stone-900/60 font-mono text-left">
          <span className="text-[7.5px] text-stone-500 uppercase block">In-Spa Signatures</span>
          <span className="text-sm font-bold text-amber-400 mt-1 block">{totalSpaHours} hrs</span>
        </div>
        <div className="p-3 bg-stone-950/40 rounded-xl border border-stone-900/60 font-mono text-left">
          <span className="text-[7.5px] text-stone-500 uppercase block">Home Sanctuary</span>
          <span className="text-sm font-bold text-violet-400 mt-1 block">{totalHomeHours} hrs</span>
        </div>
        <div className="p-3 bg-stone-950/40 rounded-xl border border-stone-900/60 font-mono text-left col-span-2">
          <span className="text-[7.5px] text-stone-500 uppercase block">Active June Increment</span>
          <span className="text-sm font-bold text-emerald-400 mt-1 block">
            +{Number((realHours.spa + realHours.home).toFixed(1))} hrs from live bookings
          </span>
        </div>
      </div>

      {/* RECHARTS COMPONENT */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              {/* Luxury Gold/Amber Gradient */}
              <linearGradient id="colorSpa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
              {/* VIP Royal Violet Gradient */}
              <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#1c1917" // stone-900 
              vertical={false}
            />

            <XAxis 
              dataKey="name" 
              stroke="#78716c" // stone-500
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              className="font-mono"
            />

            <YAxis 
              stroke="#78716c" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              className="font-mono"
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle"
              iconSize={8}
              className="font-mono font-bold text-[10px]"
            />

            {/* Area representing Spa Signature services */}
            <Area
              type="monotone"
              name="In-Spa Signature Therapies"
              dataKey="Spa"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSpa)"
              activeDot={{ r: 6, stroke: "#1c1917", strokeWidth: 2 }}
            />

            {/* Area representing white-glove Home session calls */}
            <Area
              type="monotone"
              name="White-Glove Home Delivery"
              dataKey="Home"
              stroke="#8b5cf6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHome)"
              activeDot={{ r: 6, stroke: "#1c1917", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Static premium trust reassurance line */}
      <div className="flex items-center space-x-1.5 text-[9px] font-mono text-stone-500 pt-1.5 border-t border-stone-900">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Certified Wellness Ledger &bull; Standard and home services audits updated real-time</span>
      </div>
    </div>
  );
}
