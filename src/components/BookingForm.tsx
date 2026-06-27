/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Phone, User, CheckCircle, Trash2, Smartphone, DollarSign, RefreshCw, Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Booking, Service, CoverageArea } from "../types";
import { SERVICES, HOME_COVERAGE, CONTACT_PHONES, ADDRESS } from "../data";
import { collection, query, where, addDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { useFirebase } from "./FirebaseContext";
import ActiveSessionTimerCard from "./ActiveSessionTimerCard";

export default function BookingForm({
  initialMode = "spa",
  selectedServiceId = "",
  onSuccess
}: {
  initialMode?: "spa" | "home";
  selectedServiceId?: string;
  onSuccess?: () => void;
}) {
  const { user, signIn } = useFirebase();

  const [serviceMode, setServiceMode] = useState<"spa" | "home">(initialMode);
  const [selectedService, setSelectedService] = useState<string>(selectedServiceId || SERVICES[0].id);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>(HOME_COVERAGE[0].name);
  const [homeAddress, setHomeAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [justBooked, setJustBooked] = useState<Booking | null>(null);
  const [errorText, setErrorText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize dynamic bookings from Firestore on state changes
  useEffect(() => {
    if (!user) {
      setBookingList([]);
      return;
    }

    const pathForOnSnapshot = "bookings";
    const q = query(
      collection(db, pathForOnSnapshot),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookings: Booking[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          bookings.push({
            id: docSnap.id,
            customerName: data.customerName,
            phoneNumber: data.phoneNumber,
            selectedService: data.selectedService,
            serviceMode: data.serviceMode,
            bookingDate: data.bookingDate,
            bookingTime: data.bookingTime,
            homeAddress: data.homeAddress || undefined,
            notes: data.notes || undefined,
            status: data.status,
            createdAt: data.createdAt,
            activatedAt: data.activatedAt,
            durationMinutes: data.durationMinutes
          });
        });
        // Sort by ISO timestamp string (most recent first)
        bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBookingList(bookings);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, pathForOnSnapshot);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Sync selected service if parent alters it
  useEffect(() => {
    if (selectedServiceId) {
      setSelectedService(selectedServiceId);
    }
  }, [selectedServiceId]);

  const activeServiceObj = SERVICES.find(s => s.id === selectedService) || SERVICES[0];
  const activeAreaObj = HOME_COVERAGE.find(a => a.name === selectedArea) || HOME_COVERAGE[0];

  const calculateTotal = () => {
    if (serviceMode === "spa") {
      return activeServiceObj.priceSpa;
    } else {
      return activeServiceObj.priceHome + activeAreaObj.premiumFee;
    }
  };

  const timeSlots = [
    "08:00 AM", "09:30 AM", "11:00 AM", "12:30 PM", "02:00 PM",
    "03:30 PM", "05:00 PM", "06:30 PM", "08:00 PM", "09:30 PM"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!user) {
      setErrorText("Google Sign-in session is missing.");
      return;
    }
    if (!customerName.trim()) {
      setErrorText("Please state your full name.");
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 8) {
      setErrorText("Please provide a valid phone number.");
      return;
    }
    if (!bookingDate) {
      setErrorText("Please select your appointment date.");
      return;
    }
    if (!bookingTime) {
      setErrorText("Please select a convenient time slot.");
      return;
    }
    if (serviceMode === "home" && !homeAddress.trim()) {
      setErrorText("Please specify your delivery home address.");
      return;
    }

    setIsSubmitting(true);
    const pathForWrite = "bookings";

    try {
      const payload = {
        userId: user.uid,
        customerName,
        phoneNumber,
        selectedService: activeServiceObj.name,
        serviceMode,
        bookingDate,
        bookingTime,
        homeAddress: serviceMode === "home" ? `${selectedArea} - ${homeAddress}` : "",
        notes: notes.trim() || "",
        status: "confirmed",
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, pathForWrite), payload);

      const newBooking: Booking = {
        id: docRef.id,
        customerName,
        phoneNumber,
        selectedService: activeServiceObj.name,
        serviceMode,
        bookingDate,
        bookingTime,
        homeAddress: serviceMode === "home" ? `${selectedArea} - ${homeAddress}` : undefined,
        notes: notes.trim() || undefined,
        status: "confirmed",
        createdAt: payload.createdAt
      };

      setJustBooked(newBooking);

      // Reset fields
      setCustomerName("");
      setPhoneNumber("");
      setBookingDate("");
      setBookingTime("");
      setHomeAddress("");
      setNotes("");

      if (onSuccess) onSuccess();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, pathForWrite);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, "bookings", id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `bookings/${id}`);
    }
  };

  const triggerWhatsAppRedirect = (booking: Booking) => {
    const textCtx = `Hello Relax Spa Bangalore! I would like to confirm my booking with details:
- Name: ${booking.customerName}
- Phone: ${booking.phoneNumber}
- Service: ${booking.selectedService} (${booking.serviceMode === "spa" ? "In-Spa" : "Home delivered"})
- Date/Time: ${booking.bookingDate} at ${booking.bookingTime}
${booking.homeAddress ? `- Address: ${booking.homeAddress}` : ""}`;
    const uri = `https://wa.me/919980816728?text=${encodeURIComponent(textCtx)}`;
    window.open(uri, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      {/* LEFT FORM FIELD */}
      <div className="lg:col-span-7">
        {!user ? (
          <div className="bg-stone-900/40 border border-amber-500/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[460px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <h3 className="font-serif font-light text-2xl text-slate-100 uppercase tracking-widest mb-3">
              Secure Cloud Booking
            </h3>
            <p className="text-stone-400 text-xs sm:text-sm max-w-sm leading-relaxed mb-8">
              Join Relax Spa's executive wellness platform. Please secure your session with Google verification to schedule priority appointments, protect your PII, and track history.
            </p>

            <button
              id="google-signin-booking-btn"
              onClick={() => signIn().catch(() => {})}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-sans font-bold uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center space-x-2.5 shadow-xl hover:shadow-amber-500/20"
            >
              <span>Verify with Google</span>
            </button>
          </div>
        ) : (
          <div className="bg-stone-900/40 border border-amber-500/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sans font-bold text-slate-100 text-xl tracking-tight flex items-center">
                <Calendar className="w-5 h-5 text-amber-500 mr-2.5" />
                Schedule a Wellness Escape
              </h3>
              <div className="flex items-center space-x-2 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-850">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ""} referrerPolicy="no-referrer" className="w-4 h-4 rounded-full" />
                ) : (
                  <User className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span className="text-[10px] font-mono text-stone-400 max-w-[100px] truncate">
                  {user.displayName || "Guest"}
                </span>
              </div>
            </div>

            {/* MODE SELECTOR */}
            <div className="flex bg-stone-950 p-1.5 rounded-xl border border-stone-800 gap-1.5 mb-6">
              <button
                id="book-mode-spa"
                type="button"
                onClick={() => setServiceMode("spa")}
                className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
                  serviceMode === "spa"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-lg font-extrabold"
                    : "text-stone-400 hover:text-slate-100"
                }`}
              >
                Visit Our Spa (Vivek Nagar)
              </button>
              <button
                id="book-mode-home"
                type="button"
                onClick={() => setServiceMode("home")}
                className={`flex-1 py-3 text-xs uppercase tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
                  serviceMode === "home"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-lg font-extrabold"
                    : "text-stone-400 hover:text-slate-100"
                }`}
              >
                Luxury Home Service
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorText && (
                <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
                  {errorText}
                </div>
              )}

              {/* DYNAMIC PRICE ESTIMATE BANNER */}
              <div className="bg-stone-950 border border-amber-500/15 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest leading-none block">
                    Estimated Total Premium
                  </span>
                  <span className="text-xl font-sans font-bold text-amber-500 mt-0.5 block flex items-center">
                    ₹{calculateTotal().toLocaleString()}
                    <span className="text-[10px] font-mono text-stone-400 font-normal ml-2">
                      (GST Incl.)
                    </span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15 uppercase tracking-wide">
                    {serviceMode === "spa" ? "In-Spa VIP Cabin" : "Doorstep Sanitized Kit"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SERVICE SELECTION */}
                <div>
                  <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                    Select Therapy
                  </label>
                  <select
                    id="booking-service-select"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 hover:border-amber-500/20 focus:border-amber-500/50 text-xs text-slate-200 px-3 py-3 rounded-xl outline-none transition-all"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} - ₹{serviceMode === "spa" ? s.priceSpa : s.priceHome} ({s.duration})
                      </option>
                    ))}
                  </select>
                </div>

                {/* CUSTOMER NAME */}
                <div>
                  <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-stone-500 pointer-events-none" />
                    <input
                      id="booking-name-input"
                      type="text"
                      placeholder="Enter your name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-xs text-slate-200 pl-10 pr-3 py-3 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CONTACT PHONE */}
                <div>
                  <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                    WhatsApp Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-stone-500 pointer-events-none" />
                    <input
                      id="booking-phone-input"
                      type="tel"
                      placeholder="10-digit number for notification"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-xs text-slate-200 pl-10 pr-3 py-3 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>

                {/* DATE */}
                <div>
                  <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                    Appointment Date
                  </label>
                  <div className="relative">
                    <input
                      id="booking-date-input"
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-xs text-slate-200 px-3 py-3 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* TIME SLOTS CAROUSEL-GRID */}
              <div>
                <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                  Select Time Slot (Available Hours)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map((ts) => (
                    <button
                      key={ts}
                      type="button"
                      onClick={() => setBookingTime(ts)}
                      className={`py-2 text-[10px] font-mono font-bold rounded-lg border transition-all cursor-pointer text-center ${
                        bookingTime === ts
                          ? "bg-amber-500/10 border-amber-500 text-amber-500 shadow-sm"
                          : "bg-stone-950 border-stone-800 hover:border-amber-500/20 text-stone-300"
                      }`}
                    >
                      {ts}
                    </button>
                  ))}
                </div>
              </div>

              {/* DYNAMIC FIELDS FOR HOME OPTION */}
              {serviceMode === "home" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 border-t border-stone-800 pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* coverage area */}
                    <div>
                      <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                        Bangalore Area Zone
                      </label>
                      <select
                        id="booking-area-select"
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 text-xs text-slate-200 px-3 py-3 rounded-xl outline-none"
                      >
                        {HOME_COVERAGE.map((a) => (
                          <option key={a.name} value={a.name}>
                            {a.name} {a.premiumFee > 0 ? `(+₹${a.premiumFee} transit)` : "(Complimentary travel)"}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* delivery times info */}
                    <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 flex flex-col justify-center">
                      <span className="text-[10px] font-mono text-amber-500 leading-none">
                        ⚡ Estimated Therapist Travel Lead Time
                      </span>
                      <span className="text-sm font-sans font-extrabold text-slate-200 mt-1">
                        {activeAreaObj.estimatedTimeMin} Minutes dispatch
                      </span>
                      <span className="text-[9px] font-mono text-stone-500 mt-1">
                        Zone category: {activeAreaObj.tag}
                      </span>
                    </div>
                  </div>

                  {/* Home Address input */}
                  <div>
                    <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                      Detailed Residence Address / Villa / Apartment
                    </label>
                    <textarea
                      id="booking-address-input"
                      rows={2}
                      placeholder="Specify wing, building number, street and nearest landmark..."
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-xs text-slate-200 px-3 py-2.5 rounded-xl outline-none resize-none transition-all"
                    />
                  </div>
                </motion.div>
              )}

              {/* NOTES AND PREFERENCES */}
              <div>
                <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                  Specific Instructions / Therapist Requests (Optional)
                </label>
                <input
                  id="booking-notes-input"
                  type="text"
                  placeholder="e.g., Focus on stiff neck, prefer light pressure, herbal oils..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 text-xs text-slate-200 px-3 py-3 rounded-xl outline-none transition-all"
                />
              </div>

              <button
                id="submit-booking-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 disabled:from-stone-800 disabled:to-stone-900 text-stone-950 disabled:text-stone-500 font-sans font-bold text-xs uppercase tracking-widest rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg hover:shadow-cyan-400/10 cursor-pointer flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Syncing Securely...</span>
                ) : (
                  <>
                    <span>Confirm Priority Reservation</span>
                    <Sparkles className="w-4 h-4 text-stone-950 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* RIGHT DISPLAY: SUCCESS CARD & CLOUD BOOKINGS */}
      <div className="lg:col-span-5 space-y-6">
        {/* JUST BOOKED FLASH CARD */}
        <AnimatePresence>
          {justBooked && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-emerald-950/80 to-stone-950 border border-emerald-500/30 backdrop-blur-md rounded-2xl p-5 shadow-2xl relative overflow-hidden"
            >
              {/* Confetti Glow */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-emerald-400 text-sm tracking-wide">
                      Booking Confirmed!
                    </h4>
                    <p className="text-slate-400 text-[10px] leading-tight">
                      Your premium priority slot is locked.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setJustBooked(null)}
                  className="text-stone-500 hover:text-slate-300 text-xs font-semibold select-none cursor-pointer"
                >
                  Dismiss
                </button>
              </div>

              {/* SUMMARY DETAILS */}
              <div className="mt-4 bg-stone-950/90 border border-stone-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-mono text-[10px]">GUEST</span>
                  <span className="text-slate-200 font-semibold">{justBooked.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-mono text-[10px]">THERAPY</span>
                  <span className="text-amber-500 font-bold">{justBooked.selectedService}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-mono text-[10px]">SCHEDULE</span>
                  <span className="text-slate-200 font-mono text-[11px] font-medium">
                    {justBooked.bookingDate} at {justBooked.bookingTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-mono text-[10px]">DELIVERY MODE</span>
                  <span className="text-slate-200 font-semibold capitalize">
                    {justBooked.serviceMode === "spa" ? "In-Spa VIP cabin" : "At Home Session"}
                  </span>
                </div>
                {justBooked.homeAddress && (
                  <div className="border-t border-stone-900 pt-2 text-[11px] text-stone-400">
                    <MapPin className="w-3 h-3 text-amber-500 inline mr-1" />
                    {justBooked.homeAddress}
                  </div>
                )}
              </div>

              {/* ACTION: SEND TO WHATSAPP */}
              <button
                onClick={() => triggerWhatsAppRedirect(justBooked)}
                className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Notify On WhatsApp</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PHYSICAL CONTACT CARD */}
        <div className="bg-stone-900/30 border border-stone-800/80 rounded-2xl p-5 space-y-4">
          <h4 className="font-sans font-bold text-slate-100 text-sm tracking-wide">
            Prefer Direct Scheduling?
          </h4>
          <p className="text-stone-400 text-xs leading-relaxed">
            Directly call or WhatsApp our receptionist team on Vivek Nagar service channels. We will instantly block your slot over voice call.
          </p>

          <div className="space-y-2 text-xs">
            {CONTACT_PHONES.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="flex items-center space-x-2.5 px-3 py-2.5 bg-stone-950 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/20 rounded-xl text-amber-400 font-mono font-medium transition-all"
              >
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Call {phone}</span>
              </a>
            ))}
          </div>

          <div className="border-t border-stone-800 pt-3 flex items-start space-x-2 text-xs text-stone-500 font-mono">
            <MapPin className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
            <p className="leading-tight text-[10px]">
              {ADDRESS}
            </p>
          </div>
        </div>

        {/* SPA OPERATIONAL DESK & ACTIVE TIMERS */}
        {user && bookingList.some(bk => bk.status === "confirmed" || bk.status === "active") && (
          <div className="bg-stone-900/30 border border-amber-500/15 rounded-2xl p-5 space-y-4">
            <h4 className="font-sans font-bold text-amber-400 text-[11px] tracking-widest uppercase font-mono flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
              <span>Spa Care Station & Timers</span>
            </h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Operational intake station once guests arrive. Select Fast Mode for rapid 60-second test runs, or Standard Mode to simulate a real, luxurious 60-minute countdown.
            </p>
            <div className="space-y-3">
              {bookingList
                .filter(bk => bk.status === "confirmed" || bk.status === "active")
                .map((bk) => (
                  <ActiveSessionTimerCard key={bk.id} booking={bk} />
                ))}
            </div>
          </div>
        )}

        {/* ACTIVE APPOINTMENTS RESILIENCE LIST */}
        <div className="bg-stone-900/20 border border-stone-800/60 rounded-2xl p-5 space-y-4">
          <h4 className="font-sans font-bold text-slate-300 text-xs tracking-wider uppercase font-mono">
            Active Appointments ({bookingList.length})
          </h4>

          {!user ? (
            <p className="text-stone-600 text-xs font-mono text-center py-4">
              Please verify session to fetch cloud records.
            </p>
          ) : bookingList.length === 0 ? (
            <p className="text-stone-600 text-xs font-mono text-center py-4">
              No recent reservations logged in Firestore.
            </p>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-800">
              {bookingList.map((bk) => (
                <div
                  key={bk.id}
                  className="p-3 bg-stone-950/60 border border-stone-800/80 rounded-xl flex justify-between items-center text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <p className="font-bold text-slate-200 leading-tight">
                        {bk.selectedService}
                      </p>
                      {bk.status === "active" ? (
                        <span className="px-1.5 py-0.5 bg-emerald-950/40 text-[7px] font-mono text-emerald-400 rounded border border-emerald-500/20 uppercase font-black tracking-wider animate-pulse">Live</span>
                      ) : bk.status === "completed" ? (
                        <span className="px-1.5 py-0.5 bg-stone-900 text-[7px] font-mono text-stone-500 rounded border border-stone-800 uppercase tracking-wide">Done</span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-amber-950/25 text-[7px] font-mono text-amber-500 rounded border border-amber-500/15 uppercase tracking-wide font-semibold">Ready</span>
                      )}
                    </div>
                    <p className="text-[10px] text-stone-400 font-mono leading-none pt-0.5">
                      {bk.bookingDate} at {bk.bookingTime}
                    </p>
                    <p className="text-[9px] text-stone-500 capitalize leading-none pt-0.5">
                      Client: {bk.customerName} ({bk.serviceMode === "spa" ? "In-Spa" : "Home"})
                    </p>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => triggerWhatsAppRedirect(bk)}
                      title="Share details on WhatsApp"
                      className="w-7 h-7 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => handleCancelBooking(bk.id)}
                      title="Cancel reservations"
                      className="w-7 h-7 bg-red-950/40 text-red-400 hover:bg-red-900/30 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
