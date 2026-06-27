/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Facility, Testimonial, FAQItem, BlogPost, CoverageArea, MembershipPlan } from "./types";

export const BRAND_NAME = "Relax Spa Bangalore";
export const BUSINESS_NAME = "Relax Spa | Men's Spa in Bangalore";
export const TAGLINE = "Luxury Wellness. Anywhere. Anytime.";
export const SECONDARY_TAGLINE = "Visit The Spa. Or Bring The Experience Home.";

export const ADDRESS = "First Floor, No 145/1, Old Agram Road, Rose Garden, Vannarpet Layout, Vivek Nagar, Bengaluru, Karnataka 560047";
export const LANDMARK = "Rose Garden, Vannarpet Layout (Near Vivek Nagar / Koramangala boundaries)";
export const CONTACT_PHONES = ["+91 99808 16728", "+91 63621 15001"];
export const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/RelaxSpaBangaloreVivekNagar"; // Simulated Google Maps Link referencing actual address

export const BUSINESS_HOURS = "Daily: 8:00 AM – 10:30 PM";

export const GOOGLE_RATING = {
  stars: 4.5,
  verifiedReviewsCount: 160,
  highlights: [
    "Proper Hygiene",
    "Premium Setup",
    "Comfortable Environment",
    "Friendly Staff",
    "Relaxing Experience",
    "Steam Facility",
    "Customer Satisfaction"
  ]
};

export const SERVICES: Service[] = [
  {
    id: "swedish-massage",
    name: "Swedish Massage",
    duration: "60 / 90 Mins",
    priceSpa: 1800,
    priceHome: 2800,
    shortDesc: "Classic therapy using soft-to-medium pressure long gliding strokes to restore muscles and elevate circulation.",
    longDesc: "Our Swedish massage is designed specifically for deep mental unwinding and muscle relaxation. Traditional long strokes, kneading, and light rhythmic taps are applied masterfully with premium organic essential oils to flush tension out of local muscle regions and elevate direct serotonin levels.",
    benefits: ["Promotes deep muscle relaxation", "Enhances blood flow and oxygenation", "Reduces physical and mental anxiety", "Increases full-body flexibility"],
    category: "Massage Spa"
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue Therapy",
    duration: "60 / 90 Mins",
    priceSpa: 2200,
    priceHome: 3500,
    shortDesc: "Strong, slow, and concentrated pressure targeting deep muscle fibers and fascia to resolve chronicles and knots.",
    longDesc: "Designed for individuals seeking intense therapeutic relief. Ideal for active professionals suffering from stiff necks, lower back aches, and shoulder tightness. The therapist uses trigger point release, deep finger pressure, and deliberate strokes to dismantle stubborn scar tissues and chronic knots.",
    benefits: ["Soothes chronic muscle soreness", "Perfect for active athletes or sedentary desk job workers", "Dismantles stubborn muscle adhesions", "Significantly reduces stress hormone cortisol"],
    category: "Men's Wellness Centre"
  },
  {
    id: "four-hands",
    name: "Four Hands Therapy",
    duration: "60 / 90 Mins",
    priceSpa: 3500,
    priceHome: 5500,
    shortDesc: "Two expert therapists working in perfect choreographic harmony for an unparalleled state of sensory bliss.",
    longDesc: "The pinnacle of our luxury spa offerings. Two therapists coordinate their stroke movements perfectly across your body, creating an ultra-orchestrated rhythm that induces a profound meditative state. Your brain gets delightfully overwhelmed, forcing you to completely let go of all analytical thoughts.",
    benefits: ["Doubles the therapeutic benefit in half the time", "Dramatically forces mental surrender", "Ultimate luxurious pampering experience", "Deepest state of cognitive quietude"],
    category: "Wellness & Relaxation Services"
  },
  {
    id: "aromatherapy",
    name: "Aromatherapy",
    duration: "60 / 90 Mins",
    priceSpa: 2000,
    priceHome: 3100,
    shortDesc: "Indulgent gentle massage integrated with select botanical aromatherapy elixirs to soothe the nervous system.",
    longDesc: "A sensory journey combining therapeutic touch with premium botanical extracts. Based on your physical stress type, our experts formulate custom blends of lavender, sandalwood, chamomile, or eucalyptus oils. Best enjoyed to combat high workloads, insomnia, or mental burnout.",
    benefits: ["Balances somatic energy centers", "Clears head congestion and promotes restful sleep", "Ultra-soothing on sensory nerve receptors", "Durable skin hydration and cell nourishment"],
    category: "Wellness & Relaxation Services"
  },
  {
    id: "balinese-massage",
    name: "Balinese Harmony Therapy",
    duration: "60 / 90 Mins",
    priceSpa: 2300,
    priceHome: 3600,
    shortDesc: "Traditional intense Indonesian therapy blending hot oil rubbing, acupressure, and skin rolling for joint and circulation restoration.",
    longDesc: "An ancient therapeutic approach blending acupressure, skin-rolling, and firm smooth strokes. Balinese therapy utilizes rich warm coconut and ginger oils to open energetic meridians, stimulate deep tissue blood circulation, and resolve dense stress lines across the back and limbs.",
    benefits: ["Releases high-tensile joint blockages", "Highly refreshing and stimulating for deep energy flow", "Deep, warm aromatic oil penetration", "Improves overall lymph movement"],
    category: "Massage Spa"
  },
  {
    id: "sports-massage",
    name: "Sports Performance Athletic Massage",
    duration: "60 / 90 Mins",
    priceSpa: 2400,
    priceHome: 3800,
    shortDesc: "Highly restorative stretching and targeted deep dynamic therapy designed specifically for rapid active-recovery and sports fatigue relief.",
    longDesc: "Perfect for athletes, gym enthusiasts, and runners. This treatment integrates dry active stretch combinations, trigger release points, high-frequency kinetic compressions, and lactic acid flushing. Formulated to increase muscular flexibility and reduce recovery times.",
    benefits: ["Dramatically flushes lactic acid buildup", "Restores biomechanical range of motion", "Minimizes muscle pull and strain risks", "Accelerates fiber healing after resistance training"],
    category: "Men's Wellness Centre"
  },
  {
    id: "head-shoulder",
    name: "Indian Head & Shoulder Champis",
    duration: "45 Mins",
    priceSpa: 1100,
    priceHome: 1750,
    shortDesc: "Traditional warm ayurvedic oil crowning massage followed by targeted dry neck-shoulder tension decompression.",
    longDesc: "An intense reviving therapy targeting the upper torso where most stress accumulates. Includes warm therapeutic oil application to the crown, relaxing facial stimulation points, and a sequence of energetic kneading and stretching throughout the neck, trapezius, and upper back.",
    benefits: ["Clears severe mental strain and corporate headaches", "Strengthens hair roots and enlivens scalp circulation", "Relieves stiff upper neck and keyboard shoulder posture", "Induces instant deep, tranquil sleep patterns"],
    category: "Wellness & Relaxation Services"
  },
  {
    id: "foot-reflexology",
    name: "Vedic Foot Reflexology Point Therapy",
    duration: "45 / 60 Mins",
    priceSpa: 1200,
    priceHome: 1900,
    shortDesc: "Ancient targeted pressure-zone stimulation of your foot sole points to balance internal metabolic pathways and release leg exhaustion.",
    longDesc: "Our specialists activate localized nerve ending maps on the feet that correspond directly to visceral bodily organs and meridian systems. Ideal for people walking or standing for long hours, or anyone looking to regulate internal systemic equilibrium.",
    benefits: ["Soothes absolute tightness in calves, ankles, and arches", "Promotes general metabolic and digestive harmony", "Stops nervous restless legs syndrome", "Creates a unique feeling of full-body lightness"],
    category: "Wellness & Relaxation Services"
  },
  {
    id: "body-scrub",
    name: "Body Scrub & Exfoliation",
    duration: "45 Mins",
    priceSpa: 1500,
    priceHome: 2400,
    shortDesc: "Complete skin cleansing using natural micro-exfoliants to strip off dry cells, followed by premium moisturization.",
    longDesc: "We sweep away dead, dull skin cells to reveal healthy and glowing skin underneath. Using a gold-infused salt or walnut scrub, our therapists massage your skin, improving microcirculation and encouraging lymphatic drainage, followed by a warm herbal wrap and moisturizer.",
    benefits: ["Strips away environmental pollutants and dead skin", "Restores soft, supple, glowing skin texture", "Improves overall cellular respiration", "Prepares skin for deeper massage oil absorption"],
    category: "Wellness & Relaxation Services"
  },
  {
    id: "steam-experience",
    name: "Steam & Sauna Session",
    duration: "30 Mins",
    priceSpa: 800,
    priceHome: 1250, // Home steam provided via wellness steam kit
    shortDesc: "Indulgent hot steam facility access to expand respiratory channels, flush out heavy toxins and sweat out fatigue.",
    longDesc: "The perfect completion hook to any therapeutic massage. Step into our premium steam room enclosed with customized pine seating and ambient lighting. The wet steam opens up skin pores, accelerates toxin elimination, and gets rid of modern lifestyle physical exhaustion.",
    benefits: ["Expands blood vessels for rapid muscle recovery", "Clears sinus and respiratory blockages", "Flushes deep-seated dermal impurities", "Imparts a clean, vibrant physical glow"],
    category: "Steam & Sauna Facility"
  },
  {
    id: "relaxation-combo",
    name: "Stress Relief & Relaxation Package",
    duration: "120 Mins",
    priceSpa: 3800,
    priceHome: 5900,
    shortDesc: "A complete restorative retreat combining Swedish therapy, a nourishing scrub, and aromatic steam treatment.",
    longDesc: "Our most popular signature combo. Includes a 75-minute high-end Custom Swedish or Deep Tissue Massage, a 25-minute gentle natural body scrub, and ends with 20 minutes in our customized herbal steam chamber. Perfect for corporate warriors during weekends.",
    benefits: ["Holistic head-to-toe sensory detoxification", "Substantial discount compared to independent bookings", "Triggers deep lymphatic release and blood circulation", "Repairs muscle knots and skin dullness concurrently"],
    category: "Wellness Packages"
  }
];

export const FACILITIES: Facility[] = [
  {
    id: "reception",
    name: "Premium Reception & Lounge",
    description: "An elegant, warm-toned checking zone designed with gold ambient lighting and comfortable velvet lounge seating, serving traditional Vedic herbal tea.",
    features: ["Calming low-key acoustics", "Curated welcome drinks", "Personal consultation suites"]
  },
  {
    id: "steam-sauna",
    name: "Luxury Steam Facility",
    description: "Premium high-grade steam chamber generating rich humid vapor infused with organic eucalyptus sprigs.",
    features: ["Thermostatic temperature controls", "Eucalyptus botanical infusions", "Chilled shower access"]
  },
  {
    id: "treatment-rooms",
    name: "Private Treatment Rooms",
    description: "Soundproof private chambers curated with obsidian black marble details, warm gold candlelight reflections, and ergonomic massage tables.",
    features: ["Independent sound systems", "Dimmable starfield ceiling", "En-suite private showers"]
  },
  {
    id: "lounge",
    name: "Relaxation Lounge",
    description: "A post-treatment sanctuary featuring ergonomic heated loungers, soft plush robes, and soothing sensory visual screens.",
    features: ["Heated cervical neck rolls", "Aromatic micro-misting", "Gourmet nutrient snacks"]
  }
];

export const HOME_COVERAGE: CoverageArea[] = [
  { name: "Vivek Nagar", estimatedTimeMin: 15, premiumFee: 0, tag: "Immediate / Local Zone" },
  { name: "Koramangala", estimatedTimeMin: 20, premiumFee: 0, tag: "Primary Zone" },
  { name: "MG Road", estimatedTimeMin: 25, premiumFee: 100, tag: "Central Zone" },
  { name: "Richmond Town", estimatedTimeMin: 25, premiumFee: 100, tag: "Central Zone" },
  { name: "Frazer Town", estimatedTimeMin: 35, premiumFee: 200, tag: "North Bangalore" },
  { name: "Indiranagar", estimatedTimeMin: 30, premiumFee: 150, tag: "East Bangalore" },
  { name: "HSR Layout", estimatedTimeMin: 30, premiumFee: 150, tag: "South Bangalore" },
  { name: "BTM Layout", estimatedTimeMin: 35, premiumFee: 200, tag: "South Bangalore" },
  { name: "Electronic City", estimatedTimeMin: 50, premiumFee: 400, tag: "Tech Corridor" },
  { name: "Whitefield", estimatedTimeMin: 55, premiumFee: 450, tag: "Tech Corridor" }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "rev-1",
    author: "Rohan Nair",
    rating: 5,
    text: "The Swedish Massage coupled with the steam facility at Vivek Nagar is exceptional. Extremely proper hygiene standards. The therapists are genuine professionals who know human muscle anatomy extremely well. Highly recommended!",
    date: "2026-05-12",
    verified: true,
    highlights: ["Proper Hygiene", "Steam Facility", "Friendly Staff"]
  },
  {
    id: "rev-2",
    author: "Siddharth Sen",
    rating: 5,
    text: "Relax Spa Bangalore offers the best Men's home massage service in Koramangala. The therapist arrived with a complete portable setup, pre-heated oils, and clean luxury linen sheets. My living room literally felt like a premium spa resort. Exceptional convenience!",
    date: "2026-06-02",
    verified: true,
    highlights: ["Premium Setup", "Relaxing Experience", "Customer Satisfaction"]
  },
  {
    id: "rev-3",
    author: "Major Christopher",
    rating: 5,
    text: "I regularly book the Deep Tissue Therapy after heavy workouts. The facility near Agram Road is very peaceful, tidy, and has a comfortable high-end interior. Staff behave with complete professionalism. True luxury.",
    date: "2026-06-10",
    verified: true,
    highlights: ["Comfortable Environment", "Proper Hygiene", "Customer Satisfaction"]
  }
];

export const MEMBERSHIPS: MembershipPlan[] = [
  {
    id: "silver",
    name: "Silver",
    price: "₹9,999 / Year",
    benefits: [
      "10% Flat Discount on all In-Spa and Home services",
      "Priority Same-Day booking clearance",
      "Access to Silver Lounge and complimentary select herbal tea blends",
      "Special Members-Only offers on festivals and birthdays"
    ],
    color: "from-slate-400 to-zinc-200",
    glow: "rgba(148, 163, 184, 0.2)"
  },
  {
    id: "gold",
    name: "Gold",
    price: "₹19,999 / Year",
    benefits: [
      "15% Flat Discount on all In-Spa and Home services",
      "Extra Rewards Points (equivalent to 1 free service per year)",
      "Complimentary Steam Facility access on any booking",
      "Exclusive slot reservations even during heavy weekend rushes",
      "1 Guest pass per quarter with companion discounts"
    ],
    color: "from-amber-500 to-yellow-200",
    glow: "rgba(234, 179, 8, 0.2)"
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "₹34,999 / Year",
    benefits: [
      "25% Flat Discount on all In-Spa and Home services",
      "VIP Access to premium Private treatment chambers",
      "Premium Rewards: Custom formulated essential oil bottles given as dry gifts",
      "Dedicated wellness concierge agent for rapid scheduling via phone/WhatsApp",
      "Zero Cancellation or rescheduling fees in any event"
    ],
    color: "from-emerald-600 to-teal-200",
    glow: "rgba(16, 185, 129, 0.2)"
  },
  {
    id: "black-elite",
    name: "Black Elite",
    price: "₹59,999 / Year",
    benefits: [
      "35% Flat Discount on all Spa & Home Wellness services",
      "Unlimited Complimentary Steam & Sauna access anytime without prior service",
      "Maximum Rewards: 1 complimentary Four Hands Therapy voucher every quarter",
      "Premium Priority Line Support - 24/7 on-call dispatch",
      "Custom temperature and sensory configuration presets preloaded in rooms"
    ],
    color: "from-zinc-900 to-neutral-700 border border-amber-500/30",
    glow: "rgba(217, 119, 6, 0.3)"
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "Do you offer Male-to-Male spa therapies?",
    answer: "Yes, Relax Spa Bangalore is an exclusive Men's Wellness Centre with certified male therapists providing high-quality massage and relaxation services for gentlemen.",
    category: "General"
  },
  {
    id: "faq-2",
    question: "How do I book a Home service session?",
    answer: "You can book via our interactive Wellness Concierge Aria, submit the Home Service Booking form on our website, or directly WhatsApp us at +91 99808 16728. Our therapists travel equipped with sanitizers, portable beds, fresh linens, and oils.",
    category: "Home Service"
  },
  {
    id: "faq-3",
    question: "Are there additional transportation charges for home bookings?",
    answer: "For primary zones like Koramangala and Vivek Nagar, travel is fully complimentary. For farther zones like Electronic City and Whitefield, a basic premium travel fee is appended to reward the therapist's travel time.",
    category: "Home Service"
  },
  {
    id: "faq-4",
    question: "What hygiene protocols are followed at Vivek Nagar spa?",
    answer: "Proper Hygiene is our topmost priority. All therapy beds are sanitized after every session. We use single-use disposable bedsheets, and therapists wash up rigorously. Our steam facilities undergo thorough automated heat clean cycles.",
    category: "Hygiene"
  },
  {
    id: "faq-5",
    question: "Is steam and sauna available for all customers?",
    answer: "Yes. Our premium wet steam chambers are available. It is included for free in select combos or Gold+ membership levels, or can be added onto any standalone massage therapy for a nominal fee.",
    category: "Facilities"
  }
];

export const BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "5 Scientifically Backed Reasons Why Deep Tissue Massages Decompress Tech Fatigue",
    excerpt: "Sitting on office chairs across Bangalore's tech parks creates significant cervical pressure. Discover how focal deep pressure repairs muscle strains.",
    content: "With Bangalore being the IT capital, thousands of professionals sit posture-strained for 9+ hours daily. This creates myofascial tightness, particularly in the levator scapulae and lower lumbar zones. Deep tissue therapy uses focused, slow, structural friction to penetrate heavy muscle layers, promoting microcirculation and releasing muscular spasms...",
    readTime: "4 Mins Read",
    date: "2026-06-01",
    tags: ["Tech Neck", "Muscle Science", "Bangalore Techies"]
  },
  {
    id: "blog-2",
    title: "Spiritual Surrender: What Happens to the Brain During a Four Hands Massage?",
    excerpt: "Explore the fascinating biology of sensory overload, and why two therapist hands can turn off the constant analytical chatter of active minds.",
    content: "Usually, during a single-therapist massage, your mind tracks where the therapist's hand represents on your body. When two certified therapists coordinate their strokes simultaneously, the tactile receptors send multiple synchronous signals to the nervous system. The somatic cortex fails to track both zones, triggering a beautiful, peaceful surrender...",
    readTime: "5 Mins Read",
    date: "2026-06-08",
    tags: ["Mindfulness", "Vedic Serenity", "Four Hands"]
  }
];
