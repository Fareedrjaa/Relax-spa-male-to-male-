/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  name: string;
  duration: string; // e.g., "60 Mins / 90 Mins"
  priceSpa: number; // in INR
  priceHome: number; // in INR
  shortDesc: string;
  longDesc: string;
  benefits: string[];
  category: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  features: string[];
}

export interface Testimonial {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  highlights: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
  tags: string[];
}

export interface Booking {
  id: string;
  customerName: string;
  phoneNumber: string;
  selectedService: string;
  serviceMode: "spa" | "home";
  bookingDate: string;
  bookingTime: string;
  homeAddress?: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "active";
  createdAt: string;
  activatedAt?: string;
  durationMinutes?: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "aria";
  text: string;
  timestamp: string;
  groundingMetadata?: any;
}

export interface CoverageArea {
  name: string;
  estimatedTimeMin: number;
  premiumFee: number;
  tag: string;
}

export interface MembershipPlan {
  id: string;
  name: "Silver" | "Gold" | "Platinum" | "Black Elite";
  price: string;
  benefits: string[];
  color: string;
  glow: string;
}
