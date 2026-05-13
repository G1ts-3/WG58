"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";

/* ========================================
   Navbar — Glassmorphism Sticky Header
   - Transparent over hero, frosted when scrolled
   - Hides on scroll-down, reveals on scroll-up
   ======================================== */

const navLinks = [
  { href: "#home", label: "Beranda" },
  { href: "#about", label: "Tentang" },
  { href: "#menu", label: "Menu" },
  { href: "#reservasi", label: "Reservasi" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { scrollY } = useScroll();

  /* Track scroll direction for hide/reveal */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrollingDown = latest > lastScrollY.current;
    const pastHero = latest > 100;

    setIsScrolled(pastHero);

    if (pastHero) {
      setIsVisible(!scrollingDown || latest < 200);
    } else {
      setIsVisible(true);
    }

    lastScrollY.current = latest;
  });

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsMobileOpen(false);
    const href = e.currentTarget.getAttribute("href");
    if (href?.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        id="mainNav"
        className={`fixed w-full z-50 transition-all duration-500 ${
          isScrolled ? "nav-glass py-3" : "nav-glass-hero py-5"
        }`}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -120 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a href="#home" onClick={handleNavClick} className="flex items-center gap-3 group">
            <Image
              src="/logo.jpg"
              alt="Warung Gunung 58 Logo"
              width={48}
              height={48}
              className="rounded-full object-cover border-2 border-accent shadow-lg transition-transform group-hover:scale-105"
            />
            <span
              className={`font-[var(--font-heading)] text-2xl font-bold tracking-tight transition-colors duration-500 ${
                isScrolled ? "text-primary" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              WG58
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10 font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={
                  link.href === "#reservasi"
                    ? "bg-accent text-white px-8 py-3 rounded-full text-xs font-bold btn-shine shadow-lg hover:shadow-accent/30 transition-all hover:scale-105 uppercase tracking-widest"
                    : `transition-colors duration-300 text-xs tracking-widest uppercase font-bold hover:text-accent ${
                        isScrolled ? "text-charcoal-light" : "text-white/90"
                      }`
                }
              >
                {link.label === "Reservasi" ? "Pesan Meja" : link.label}
              </a>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-2xl p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
          >
            <i className={`fas fa-bars ${isScrolled ? "text-primary" : "text-white"}`}></i>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <motion.div
        className="md:hidden fixed inset-0 z-[60] flex flex-col justify-center items-center gap-8"
        initial={{ opacity: 0, x: "100%" }}
        animate={{
          opacity: isMobileOpen ? 1 : 0,
          x: isMobileOpen ? "0%" : "100%",
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: isMobileOpen ? "auto" : "none" }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-primary/95 backdrop-blur-xl" />

        {/* Close Button */}
        <button
          className="absolute top-8 right-8 text-white text-3xl min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Mobile Links */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="text-white text-2xl font-bold hover:text-accent transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isMobileOpen ? 1 : 0,
                y: isMobileOpen ? 0 : 20,
              }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              {link.label}
            </motion.a>
          ))}
          <motion.a
            href="#reservasi"
            onClick={handleNavClick}
            className="bg-accent px-10 py-4 rounded-full text-white text-xl font-bold mt-4 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isMobileOpen ? 1 : 0,
              y: isMobileOpen ? 0 : 20,
            }}
            transition={{ delay: 0.4 }}
          >
            Pesan Meja
          </motion.a>
        </div>
      </motion.div>
    </>
  );
}
