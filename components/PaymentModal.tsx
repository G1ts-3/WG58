"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ========================================
   Payment Modal — Mock Payment Gateway
   Simulates Midtrans-Snap-like payment UI
   - Payment method tabs: QRIS, Virtual Account, GoPay
   - Mock processing state (2s spinner)
   - Success screen with booking ID & WhatsApp link
   ======================================== */

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  bookingData: {
    name: string;
    whatsapp: string;
    email: string;
    date: string;
    time: string;
    pax: number;
  };
}

type PaymentMethod = "qris" | "va" | "gopay";
type PaymentState = "selecting" | "processing" | "success";

/* Format Rupiah */
function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

/* Generate mock booking ID */
function generateBookingId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WG58-${date}-${rand}`;
}

export default function PaymentModal({
  isOpen,
  onClose,
  total,
  bookingData,
}: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("qris");
  const [state, setState] = useState<PaymentState>("selecting");
  const bookingId = useMemo(() => generateBookingId(), []);

  const handlePay = () => {
    setState("processing");
    setTimeout(() => setState("success"), 2500);
  };

  const handleClose = () => {
    setState("selecting");
    setMethod("qris");
    onClose();
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Halo WG58! Saya sudah melakukan pembayaran DP reservasi.\n\n` +
        `📋 Booking ID: ${bookingId}\n` +
        `👤 Nama: ${bookingData.name}\n` +
        `📅 Tanggal: ${bookingData.date}\n` +
        `🕐 Waktu: ${bookingData.time}\n` +
        `👥 Jumlah Tamu: ${bookingData.pax} orang\n` +
        `💰 Total DP: ${formatRupiah(total)}\n\n` +
        `Mohon konfirmasinya. Terima kasih! 🙏`
    );
    window.open(`https://wa.me/6282116010376?text=${msg}`, "_blank");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={state !== "processing" ? handleClose : undefined}
          />

          {/* Modal Container */}
          <motion.div
            className="relative bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="bg-primary p-6 text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Payment Gateway</p>
                    <p className="text-white/60 text-xs">Warung Gunung 58</p>
                  </div>
                </div>
                {state !== "processing" && (
                  <button
                    onClick={handleClose}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close payment modal"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-white/60 text-xs uppercase tracking-wider">
                  Total Pembayaran
                </p>
                <p
                  className="text-3xl font-bold mt-1"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {formatRupiah(total)}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* ===== SELECTING STATE ===== */}
                {state === "selecting" && (
                  <motion.div
                    key="selecting"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <p className="text-sm font-semibold text-charcoal mb-4">
                      Pilih Metode Pembayaran
                    </p>

                    {/* Payment Method Tabs */}
                    <div className="space-y-3 mb-6">
                      {/* QRIS */}
                      <button
                        onClick={() => setMethod("qris")}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          method === "qris"
                            ? "border-primary bg-primary/5"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                          QRIS
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-charcoal">QRIS</p>
                          <p className="text-xs text-warm-gray">
                            Scan & bayar dari semua e-wallet
                          </p>
                        </div>
                        {method === "qris" && (
                          <i className="fas fa-check-circle text-primary ml-auto text-lg"></i>
                        )}
                      </button>

                      {/* Virtual Account */}
                      <button
                        onClick={() => setMethod("va")}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          method === "va"
                            ? "border-primary bg-primary/5"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white">
                          <i className="fas fa-university"></i>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-charcoal">Virtual Account</p>
                          <p className="text-xs text-warm-gray">
                            BCA, BNI, BRI, Mandiri
                          </p>
                        </div>
                        {method === "va" && (
                          <i className="fas fa-check-circle text-primary ml-auto text-lg"></i>
                        )}
                      </button>

                      {/* GoPay */}
                      <button
                        onClick={() => setMethod("gopay")}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          method === "gopay"
                            ? "border-primary bg-primary/5"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                          <i className="fas fa-wallet"></i>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-charcoal">GoPay</p>
                          <p className="text-xs text-warm-gray">
                            Bayar langsung dari GoPay
                          </p>
                        </div>
                        {method === "gopay" && (
                          <i className="fas fa-check-circle text-primary ml-auto text-lg"></i>
                        )}
                      </button>
                    </div>

                    {/* Payment Details based on method */}
                    <div className="bg-parchment rounded-2xl p-5 mb-6">
                      {method === "qris" && (
                        <div className="text-center">
                          <p className="text-sm font-semibold mb-3 text-charcoal">
                            Scan QR Code
                          </p>
                          {/* Mock QRIS QR Code */}
                          <div className="w-48 h-48 mx-auto bg-white rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-center mb-3">
                            <div className="text-center">
                              <i className="fas fa-qrcode text-6xl text-primary/30"></i>
                              <p className="text-xs text-warm-gray mt-2">
                                Mock QR Code
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-warm-gray">
                            Berlaku 15 menit setelah konfirmasi
                          </p>
                        </div>
                      )}
                      {method === "va" && (
                        <div>
                          <p className="text-sm font-semibold mb-3 text-charcoal">
                            Nomor Virtual Account
                          </p>
                          <div className="bg-white rounded-xl p-4 flex items-center justify-between">
                            <div>
                              <p className="text-xs text-warm-gray">BCA Virtual Account</p>
                              <p className="font-mono font-bold text-lg text-charcoal tracking-wider">
                                8806 0821 1601 0376
                              </p>
                            </div>
                            <button
                              className="text-primary font-semibold text-sm hover:text-accent"
                              onClick={() =>
                                navigator.clipboard?.writeText("8806082116010376")
                              }
                            >
                              <i className="fas fa-copy"></i> Salin
                            </button>
                          </div>
                        </div>
                      )}
                      {method === "gopay" && (
                        <div className="text-center">
                          <p className="text-sm font-semibold mb-3 text-charcoal">
                            GoPay
                          </p>
                          <div className="w-48 h-48 mx-auto bg-white rounded-2xl border-2 border-dashed border-blue-200 flex items-center justify-center mb-3">
                            <div className="text-center">
                              <i className="fas fa-wallet text-5xl text-blue-300"></i>
                              <p className="text-xs text-warm-gray mt-2">
                                Redirect ke GoPay App
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Pay Button */}
                    <button
                      onClick={handlePay}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg btn-shine shadow-xl transition-all hover:bg-primary-dark active:scale-[0.98] min-h-[52px]"
                    >
                      Bayar {formatRupiah(total)}
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-4 text-warm-gray-light text-xs">
                      <i className="fas fa-lock"></i>
                      <p>Pembayaran aman & terenkripsi</p>
                    </div>
                  </motion.div>
                )}

                {/* ===== PROCESSING STATE ===== */}
                {state === "processing" && (
                  <motion.div
                    key="processing"
                    className="py-16 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="relative w-24 h-24 mx-auto mb-8">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <i className="fas fa-wallet text-2xl text-primary animate-pulse" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl text-charcoal mb-2">Menghubungkan ke GoPay...</h3>
                    <p className="text-warm-gray text-sm max-w-xs mx-auto">Sistem sedang memverifikasi merchant <strong>Milkku</strong> dan menyiapkan pembayaran otomatis Anda.</p>
                  </motion.div>
                )}

                {/* ===== SUCCESS STATE ===== */}
                {state === "success" && (
                  <motion.div
                    key="success"
                    className="py-8 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 relative">
                      <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                      <div className="relative bg-primary w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                        <i className="fas fa-check" />
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>Pembayaran Berhasil!</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Terverifikasi Otomatis
                    </div>

                    <div className="bg-parchment/50 backdrop-blur border border-parchment-dark rounded-2xl p-6 mb-8 text-left space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-parchment-dark">
                        <span className="text-xs font-bold text-warm-gray uppercase tracking-widest">Merchant</span>
                        <span className="font-bold text-charcoal text-sm">MILKKU - WG58</span>
                      </div>
                      <div className="flex justify-between items-center"><span className="text-xs text-warm-gray">Booking ID</span><span className="font-mono font-bold text-primary text-xs">{bookingId}</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-warm-gray">Nama</span><span className="font-bold text-charcoal text-xs">{bookingData.name}</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs text-warm-gray">Jadwal</span><span className="font-bold text-charcoal text-xs">{bookingData.date} | {bookingData.time}</span></div>
                      <div className="flex justify-between items-center pt-3 border-t border-parchment-dark"><span className="text-sm font-bold text-charcoal">Total Terbayar</span><span className="text-xl font-bold text-primary" style={{ fontFamily: "var(--font-cormorant)" }}>{formatRupiah(total)}</span></div>
                    </div>

                    <p className="text-xs text-warm-gray mb-8 italic">Bukti pembayaran telah dikirim secara otomatis ke sistem kami. Anda tidak perlu mengirim bukti transfer manual.</p>

                    <button onClick={handleClose} className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-primary-dark transition-all">Selesai</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
