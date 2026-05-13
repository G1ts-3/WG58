"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Scroll-to-top button that appears after scrolling 400px */
export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-28 right-6 md:bottom-32 md:right-10 bg-primary text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-lg md:text-xl shadow-xl z-40 hover:bg-accent hover:-translate-y-1 transition-all"
          aria-label="Scroll to top"
        >
          <i className="fas fa-arrow-up"></i>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* Floating WhatsApp button */
export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/6282116010376"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-6 md:bottom-10 md:right-10 bg-[#25d366] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-2xl z-50 hover:scale-110 transition-all active:scale-95 group"
      aria-label="Chat via WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
      <span className="hidden md:block absolute right-full mr-3 bg-white text-charcoal px-4 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-parchment-dark whitespace-nowrap">
        Butuh Bantuan? Chat Kami!
      </span>
    </a>
  );
}
