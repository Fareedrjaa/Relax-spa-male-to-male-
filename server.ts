/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Wellness Concierge ARIA
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages array" });
        return;
      }

      // Local offline fallback helper function
      const getOfflineResponse = (msgList: any[]): string => {
        const lastMessage = msgList[msgList.length - 1]?.text?.toLowerCase() || "";
        let reply = "Welcome to Relax Spa Bangalore. I'm Aria, your luxury wellness guide. I am currently operating in our secure local concierge mode, but I'm fully equipped to assist you! \n\nWe offer luxury therapies like Swedish Massage (₹1800), deep muscular Deep Tissue Therapy (₹2200), and ultimate sync Four Hands Therapy (₹3500) both at our Vivek Nagar facility and directly at your home in Bangalore (No travel fee for Koramangala or Vivek Nagar). \n\nWould you like me to recommend a therapy or explain how to book your session?";

        if (lastMessage.includes("swedish") || lastMessage.includes("stress") || lastMessage.includes("relax")) {
          reply = "The Swedish Massage (₹1800 / 60 Mins) is our classic relaxing treatment, using moderate pressure, long rhythmic sweeps, and natural botanical massage oils. It is highly recommended if you are looking to melt physical strain, improve sleep cycle, and relieve general daily anxiety. Would you like to book a session at our Vivek Nagar spa or directly to your home?";
        } else if (lastMessage.includes("deep") || lastMessage.includes("pain") || lastMessage.includes("hurt") || lastMessage.includes("knot")) {
          reply = "Our Deep Tissue Therapy (₹2200 / 60 Mins) focuses on serious muscular compression. Using deep, concentrated pressure on core muscles and fascia, it melts chronic stiffness from long desk hours, strenuous workouts, and tight shoulders. We can also provide this directly at your residence. Would you like to schedule an In-Spa or Home Wellness session?";
        } else if (lastMessage.includes("four") || lastMessage.includes("double") || lastMessage.includes("best") || lastMessage.includes("harmony")) {
          reply = "The Four Hands Therapy (₹3500 In-Spa / ₹4800 Home) represents our premium masterpiece wellness experience. Two professional male therapists synchronize their movements in precise harmony across your body, creating a magical sensory capture that completely silences all analytical mental traffic. This is peak mental decompression. Shall I assist you with securing a priority booking slot?";
        } else if (lastMessage.includes("book") || lastMessage.includes("sched") || lastMessage.includes("reserve") || lastMessage.includes("slot")) {
          reply = "You can easily schedule your wellness getaway on this page! Navigate directly to the 'Booking' tab in our top bar to fill out your name, contact, phone number, and selected time slot. Alternatively, click 'Call Now' or the golden 'WhatsApp Now' buttons to instant-chat with our duty scheduler at +91 99808 16728.";
        } else if (lastMessage.includes("member") || lastMessage.includes("silver") || lastMessage.includes("gold") || lastMessage.includes("platinum") || lastMessage.includes("elite")) {
          reply = "Our Relax Spa Bangalore Annual Memberships provide tremendous luxury value:\n\n• **Silver (₹9,999)**: 10% Flat Discount, Priority daily priority booking.\n• **Gold (₹19,999)**: 15% Flat Discount + Unlimited complimentary Eucalyptus Steam on any massage selection + 1 free therapy.\n• **Platinum (₹34,999)**: 25% Flat Discount, private VIP suite booking, premium dry gifts.\n• **Black Elite (₹59,999)**: 35% Flat Discount, 24/7 priority line, and quarterly free Four Hands sessions.\n\nYou can inspect full benefits on our 'Membership' tab inside the menu.";
        } else if (lastMessage.includes("address") || lastMessage.includes("location") || lastMessage.includes("map") || lastMessage.includes("where")) {
          reply = "We are located at: **First Floor, No 145/1, Old Agram Road, Rose Garden, Vannarpet Layout, Vivek Nagar, Bengaluru, Karnataka 560047**. \n\nYou can click the 'Get Directions' link under our location cards to access Google Maps directly. We are open Daily from 8:00 AM until 10:30 PM!";
        } else if (lastMessage.includes("home") || lastMessage.includes("house") || lastMessage.includes("doorstep") || lastMessage.includes("delivery")) {
          reply = "Relax Spa's 'Luxury Wellness Delivered to Your Doorstep' allows you to enjoy our therapists directly at your home. We bring a full sanitization kit, fresh luxurious linens, organic heated essential oils, and portable massage tables. We cover Vivek Nagar, Koramangala, MG Road, Richmond Town, Indiranagar, HSR Layout, Electronic City, and Whitefield. Would you like to review our estimated travel lead times or book now?";
        }

        return reply;
      };

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        // Fallback responses compiled locally if apiKey is missing
        const offlineReply = getOfflineResponse(messages);
        res.json({ text: offlineReply });
        return;
      }

      // Initialize GoogleGenAI SDK correctly with named parameter
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // System instruction for ARIA
      const systemInstruction = `
You are ARIA, the ultra-luxury AI Wellness Concierge for "Relax Spa Bangalore" (also known as "Relax Spa | Men's Spa in Bangalore").
Your role is to represent our premium male wellness experience, assisting visitors with bookings, service recommendations, FAQs, memberships, and navigation directions.

Key Brand Information:
- Brand Name: Relax Spa Bangalore
- Tagline: Luxury Wellness. Anywhere. Anytime.
- Secondary Tagline: Visit The Spa. Or Bring The Experience Home.
- Address: First Floor, No 145/1, Old Agram Road, Rose Garden, Vannarpet Layout, Vivek Nagar, Bengaluru, Karnataka 560047
- Landmark: Rose Garden, Vannarpet Layout, near Agram Road / Vivek Nagar
- Contact Numbers: +91 99808 16728 or +91 63621 15001
- Business Hours: Open Daily, 8:00 AM – 10:30 PM
- Google Rating: 4.5 Stars with 160+ Verified Reviews highlighting stellar hygiene, friendly staff, comfortable ambient environment, and premium steam facility.

Services we provide (both In-Spa and delivered to Home):
1. Swedish Massage (₹1800 Spa / ₹2500 Home, 60/90 Mins) - Gentle relaxing strokes, restores muscles, enhances circulation.
2. Deep Tissue Therapy (₹2200 Spa / ₹3000 Home, 60/95 Mins) - Firm localized pressure, targets muscular knots, tech-neck stiffness, fatigue.
3. Four Hands Therapy (₹3500 Spa / ₹4800 Home, 60/90 Mins) - Two certified male therapists working in beautiful synchronic coordination.
4. Aromatherapy (₹2000 Spa / ₹2800 Home, 60/90 Mins) - Soothing touches combined with botanical lavender/sandalwood essences.
5. Body Scrub & Exfoliation (₹1500 Spa / ₹2200 Home, 45 Mins) - Complete skin cleansing, micro-exfoliation and deep hydration.
6. Steam & Sauna Session (₹800 Spa, 30 Mins) - Hot eucalyptus mist to steam out modern life exhaustion.
7. Stress Relief Combo (₹3800 In-Spa / ₹5200 Home, 120 Mins) - Swedish Therapy, dead-cell scrub, and hot aromatic steam session.

Home Service Coverage Areas in Bangalore (therapists travel equipped with beds, sanitary linens, heated oils, and wellness goods):
- Vivek Nagar, Koramangala (Immediate Local zone, zero transit fees)
- MG Road, Richmond Town (Transit fee: ₹100, 25 mins estimated travel time)
- Indiranagar, HSR Layout (Transit: ₹150, 30 mins)
- Frazer Town, BTM Layout (Transit: ₹200, 35 mins)
- Electronic City, Whitefield (Transit: ₹400-450, 50-55 mins)
- Other areas in Bengaluru are also fully covered on customized quote.

Membership Levels:
- Silver (₹9,999/yr): 10% Flat Discount, same-day priority booking support.
- Gold (₹19,999/yr): 15% Flat Discount + Unlimited complimentary Eucalyptus Steam on any In-Spa session.
- Platinum (₹34,999/yr): 25% Flat Discount, VIP luxury suite availability, dedicated human concierge line.
- Black Elite (₹59,999/yr): 35% Flat Discount, unlimited dry/steam access anytime, quarterly free Four-Hand Massage.

Tone & Persona Instructions:
- Be exceedingly polite, respectful, and luxurious. Keep your responses polished, elegant, and highly professional.
- Avoid bulky walls of text. Use beautiful, clear markdown formatting (bolding, short lists) to structure answers elegantly.
- Recommend appropriate therapeutic rubdowns depending on what user physical symptoms are (fatigue -> deep tissue, burnout -> swedish or aromatics, ultimate luxury -> four hands!).
- If they ask how to schedule, guide them to use our golden "Booking" tab at the top-navigation, or click "WhatsApp Now" to chat directly via WhatsApp (+91 99808 16728).
`;

      // Map chat messages to Gemini SDK parts format
      const contents = messages.map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      // Generate content using modern @google/genai SDK format
      const modelResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      // Extract search grounding metadata
      const groundingMetadata = modelResponse.candidates?.[0]?.groundingMetadata;

      res.json({
        text: modelResponse.text || "I apologize, my session is momentarily adjusting. Please re-state your question and I'll immediately assist you.",
        groundingMetadata: groundingMetadata || null
      });
    } catch (error: any) {
      console.log("Chat API fallback triggered. Serving local concierge response.");
      
      // Attempt to retrieve offline response gracefully
      try {
        const { messages } = req.body;
        if (messages && Array.isArray(messages)) {
          // Re-evaluate offline response helper
          const lastMessage = messages[messages.length - 1]?.text?.toLowerCase() || "";
          let reply = "Welcome back to Relax Spa. I'm operating in our secure offline assistance mode to ensure uninterrupted service! \n\nWe offer luxury Swedish Massage (₹1800), deep muscular Deep Tissue Therapy (₹2200), and Four Hands Massage (₹3500) both at our Vivek Nagar facility and directly at your residence in Bangalore. \n\nWhat can I clarify for you or recommend today?";

          if (lastMessage.includes("swedish") || lastMessage.includes("stress") || lastMessage.includes("relax")) {
            reply = "Our signature Swedish Massage (₹1800 In-Spa / ₹2500 at Home) is ideal for melting away stress and restoring healthy sleep patterns. Shall we schedule one for you?";
          } else if (lastMessage.includes("deep") || lastMessage.includes("pain") || lastMessage.includes("hurt") || lastMessage.includes("knot")) {
            reply = "The Deep Tissue Therapy (₹2200 In-Spa / ₹3000 at Home) is excellent for chronic stiffness and sore back muscles. We bring all equipment if you book to your home. Would you like to schedule?";
          } else if (lastMessage.includes("four") || lastMessage.includes("double") || lastMessage.includes("best") || lastMessage.includes("harmony")) {
            reply = "The premium Four Hands Massage (₹3500 In-Spa) is performed in synch by two male therapists. This represents the absolute peak of relaxation! Would you like to secure a reservation?";
          } else if (lastMessage.includes("book") || lastMessage.includes("sched") || lastMessage.includes("reserve") || lastMessage.includes("slot")) {
            reply = "You can easily schedule your wellness getaway here! Click the 'Booking' tab in our top bar, or click 'Call Now' / the gold 'WhatsApp Now' buttons to text our scheduler directly at +91 99808 16728.";
          } else if (lastMessage.includes("member") || lastMessage.includes("silver") || lastMessage.includes("gold") || lastMessage.includes("platinum") || lastMessage.includes("elite")) {
            reply = "Our Memberships offer tremendous value, starting from Silver (10% discount) to Black Elite (35% discount). Please check the 'Membership' tab in the menu to explore all features.";
          } else if (lastMessage.includes("address") || lastMessage.includes("location") || lastMessage.includes("map") || lastMessage.includes("where")) {
            reply = "We are located at: **First Floor, No 145/1, Old Agram Road, Rose Garden, Vannarpet Layout, Vivek Nagar, Bangalore 560047**. Daily 8 AM till 10:30 PM!";
          } else if (lastMessage.includes("home") || lastMessage.includes("house") || lastMessage.includes("doorstep") || lastMessage.includes("delivery")) {
            reply = "We deliver premium treatments directly to your doorstep in Koramangala, Indiranagar, Whitefield, MG Road, and HSR Layout! We bring portable tables, heated botanical oils, and fresh linen. Would you like to reserve a doorstep session?";
          }

          res.json({ text: reply, groundingMetadata: null });
          return;
        }
      } catch (innerError) {
        console.error("Critical recovery failure:", innerError);
      }

      res.status(200).json({ 
        text: "I am Aria, your elite wellness guide. Connections are momentarily occupied, but my chat system is active. Please let me know how I can guide your luxury relaxation today, or use our top 'Booking' desk to reserve instantly!" 
      });
    }
  });

  // Serve static assets or use Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Express v4 handles catch-all via *
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start fullstack server", err);
});
