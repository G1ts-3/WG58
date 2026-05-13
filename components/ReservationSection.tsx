"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ========================================
   Multi-Step Reservation Wizard (Simplified)
   Step 0: Date, Time, Pax
   Step 1: Customer Details
   Step 2: Payment
   ======================================== */

function formatRupiah(n: number) { return `Rp ${n.toLocaleString("id-ID")}`; }

/* ---- Custom Calendar Component ---- */
function Calendar({ selected, onSelect }: { selected: string; onSelect: (d: string) => void }) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = new Date(); today.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-parchment-dark">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-parchment flex items-center justify-center transition-colors"><i className="fas fa-chevron-left text-[10px] text-charcoal"></i></button>
        <span className="text-xs font-bold text-charcoal tracking-wide uppercase">{monthNames[month]} {year}</span>
        <button onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-parchment flex items-center justify-center transition-colors"><i className="fas fa-chevron-right text-[10px] text-charcoal"></i></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {["M", "S", "S", "R", "K", "J", "S"].map(d => (
          <div key={d} className="text-[10px] font-bold text-accent py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const date = new Date(year, month, day);
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isPast = date < today;
          const isSelected = selected === dateStr;
          const isToday = date.getTime() === today.getTime();
          return (
            <button
              key={dateStr}
              disabled={isPast}
              onClick={() => onSelect(dateStr)}
              className={`w-full aspect-square rounded-lg text-[11px] font-bold transition-all
                ${isPast ? "text-warm-gray-light opacity-30 cursor-not-allowed" : "hover:bg-primary hover:text-white text-charcoal"}
                ${isSelected ? "bg-primary text-white shadow-lg" : ""}
                ${isToday && !isSelected ? "text-accent border border-accent/30" : ""}
              `}
            >{day}</button>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Time Slots ---- */
const timeSlots = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

/* ---- Step Indicator ---- */
function StepIndicator({ current }: { current: number }) {
  const steps = ["Booking", "Kontak", "Bayar"];
  return (
    <div className="flex items-center justify-between mb-8 max-w-xs mx-auto">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < current ? "bg-primary text-white" : i === current ? "bg-accent text-white" : "bg-parchment-dark text-warm-gray"
              }`}>{i < current ? <i className="fas fa-check text-[10px]" /> : i + 1}</div>
            <span className="text-[9px] mt-1 font-bold text-warm-gray uppercase tracking-widest">{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-[2px] mx-2 rounded-full ${i < current ? "bg-primary" : "bg-parchment-dark"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ReservationSection() {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pax, setPax] = useState(2);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const bookingFee = 50000;

  const canNext = () => {
    if (step === 0) return date && time && pax > 0;
    if (step === 1) return name.trim() && whatsapp.trim();
    return true;
  };

  const goNext = () => { setDirection(1); setStep(step + 1); };
  const goPrev = () => { setDirection(-1); setStep(step - 1); };

  const formatDate = (d: string) => {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/send-wa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: name,
          whatsapp,
          email: email || "-",
          tanggal: formatDate(date),
          waktu: `${time} WIB`,
          jumlahTamu: `${pax} Orang`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -50 : 50, opacity: 0 }),
  };

  return (
    <>
      <section id="reservasi" className="py-24 lg:py-32 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,...')", backgroundSize: "60px" }} />
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left: Info */}
            <motion.div className="lg:w-1/2 text-white text-center lg:text-left optimize-gpu" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
              <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Kunjungi Kami</span>
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>Rencanakan Momen Berharga</h2>
              <p className="text-white/60 text-sm lg:text-base mb-10 leading-relaxed max-w-md mx-auto lg:mx-0">Kami menyediakan area lesehan yang luas dan nyaman untuk momen spesial Anda bersama keluarga.</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <a href="https://www.google.com/maps/search/Warung+Gunung+58+Jl.+Raya+Tugu,+Kp+Tugu+1+No.58,+Tugumukti,+Kec.+Cisarua" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors"><i className="fas fa-map-marker-alt" /></div>
                  <div className="text-left"><p className="text-[10px] font-bold text-accent uppercase tracking-widest">Lokasi</p><p className="text-xs opacity-70 group-hover:underline">Cisarua, Bandung Barat</p></div>
                </a>
                <a href="https://wa.me/6282116010376" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors"><i className="fab fa-whatsapp" /></div>
                  <div className="text-left"><p className="text-[10px] font-bold text-accent uppercase tracking-widest">WhatsApp</p><p className="text-xs opacity-70 group-hover:underline">0821-1601-0376</p></div>
                </a>
              </div>
            </motion.div>

            {/* Right: Compact Wizard */}
            <motion.div
              className="lg:w-1/2 w-full max-w-xl optimize-gpu"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="premium-card p-6 md:p-8 rounded-[2.5rem] relative">
                {submitStatus === "success" ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fas fa-check text-3xl text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-primary mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>Reservasi Terkirim!</h3>
                    <p className="text-warm-gray text-sm mb-8">Tim kami akan segera menghubungi Anda via WhatsApp di nomor <strong className="text-charcoal">{whatsapp}</strong> untuk konfirmasi lebih lanjut.</p>
                    <button onClick={() => { setStep(0); setSubmitStatus("idle"); setDate(""); setTime(""); setName(""); setWhatsapp(""); setEmail(""); }} className="px-8 py-3 bg-parchment text-charcoal font-bold rounded-xl hover:bg-primary/10 transition-colors">Buat Reservasi Baru</button>
                  </motion.div>
                ) : (
                  <>
                    <StepIndicator current={step} />

                    <div className="min-h-[300px] flex flex-col">
                      <AnimatePresence mode="wait" custom={direction}>
                        {step === 0 && (
                          <motion.div key="step0" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                            <h3 className="text-xl font-bold text-charcoal mb-6 text-center" style={{ fontFamily: "var(--font-cormorant)" }}>Pilih Jadwal Kedatangan</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                              <Calendar selected={date} onSelect={setDate} />
                              <div className="space-y-6">
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-widest text-warm-gray mb-3">Waktu Kedatangan</label>
                                  <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map(t => (
                                      <button key={t} onClick={() => setTime(t)} className={`py-2 rounded-xl text-xs font-bold transition-all ${time === t ? "bg-primary text-white shadow-lg" : "bg-parchment text-charcoal hover:bg-primary/10"}`}>{t}</button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-widest text-warm-gray mb-3">Jumlah Tamu</label>
                                  <div className="flex items-center gap-4 bg-parchment p-2 rounded-2xl w-fit">
                                    <button onClick={() => setPax(Math.max(1, pax - 1))} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-charcoal hover:bg-primary hover:text-white transition-all shadow-sm"><i className="fas fa-minus text-[10px]" /></button>
                                    <span className="text-xl font-bold text-charcoal w-6 text-center">{pax}</span>
                                    <button onClick={() => setPax(Math.min(50, pax + 1))} className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-charcoal hover:bg-primary hover:text-white transition-all shadow-sm"><i className="fas fa-plus text-[10px]" /></button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {step === 1 && (
                          <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                            <h3 className="text-xl font-bold text-charcoal mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>Informasi Kontak</h3>
                            <p className="text-xs text-warm-gray mb-6">Pastikan nomor WhatsApp aktif untuk konfirmasi reservasi.</p>
                            <div className="grid grid-cols-1 gap-5">
                              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nama Lengkap" className="w-full bg-parchment p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-medium" />
                              <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="Nomor WhatsApp" className="w-full bg-parchment p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-medium" />
                              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (Opsional)" className="w-full bg-parchment p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary text-sm font-medium" />
                            </div>
                          </motion.div>
                        )}

                        {step === 2 && (
                          <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                            <h3 className="text-xl font-bold text-charcoal mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>Konfirmasi Akhir</h3>
                            <div className="bg-parchment rounded-3xl p-6 space-y-4 mb-8">
                              <div className="flex justify-between items-center"><span className="text-xs font-bold text-warm-gray uppercase">Jadwal</span><span className="text-sm font-bold text-charcoal">{formatDate(date)} | {time} WIB</span></div>
                              <div className="flex justify-between items-center"><span className="text-xs font-bold text-warm-gray uppercase">Tamu</span><span className="text-sm font-bold text-charcoal">{pax} Orang</span></div>
                              <div className="flex justify-between items-center"><span className="text-xs font-bold text-warm-gray uppercase">Nama</span><span className="text-sm font-bold text-charcoal">{name}</span></div>
                              <div className="flex justify-between items-center"><span className="text-xs font-bold text-warm-gray uppercase">WhatsApp</span><span className="text-sm font-bold text-primary">{whatsapp}</span></div>
                            </div>

                            {submitStatus === "error" && (
                              <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs rounded-xl font-medium">
                                <i className="fas fa-exclamation-circle mr-2" /> Gagal mengirim reservasi. Silakan coba lagi.
                              </div>
                            )}

                            <p className="text-xs text-center text-warm-gray mb-6 leading-relaxed">
                              Data reservasi akan dikirim secara otomatis. Tim kami akan menghubungi nomor WhatsApp Anda (<strong className="text-charcoal">{whatsapp}</strong>) untuk instruksi pembayaran lebih lanjut.
                            </p>
                            <button
                              onClick={handleSubmit}
                              disabled={isSubmitting}
                              className="w-full bg-accent text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-wait"
                            >
                              {isSubmitting ? <><i className="fas fa-spinner fa-spin mr-2" /> Mengirim...</> : "Kirim Reservasi Sekarang"}
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="mt-auto pt-8 flex items-center justify-between border-t border-parchment-dark">
                        {step > 0 ? (
                          <button onClick={goPrev} disabled={isSubmitting} className="text-xs font-bold text-warm-gray hover:text-charcoal uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"><i className="fas fa-arrow-left" /> Kembali</button>
                        ) : <div />}
                        {step < 2 && (
                          <button onClick={goNext} disabled={!canNext()} className={`px-10 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${canNext() ? "bg-primary text-white hover:bg-accent shadow-lg" : "bg-parchment-dark text-warm-gray-light cursor-not-allowed"}`}>Lanjut <i className="fas fa-arrow-right ml-2" /></button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
