"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

/* ========================================
   Hero Section
   - Parallax background driven by scroll
   - Staggered character-by-character headline
   - Floating "Pesan Meja" button
   ======================================== */

const headline1 = "Cita Rasa";
const headline2 = "Gunung";
const headline3 = "Autentik";

/* Character-by-character animation variants */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.3,
    },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  /* Parallax scroll effect */
  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.4}px) scale(1.1)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <div className="absolute inset-0">
        <div
          ref={parallaxRef}
          className="w-full h-full hero-parallax"
          style={{
            backgroundImage: "url(/assets/hero.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.1)",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pb-16 lg:pb-24">
        {/* Staggered Headline */}
        <motion.h1
          className="font-[var(--font-heading)] text-5xl md:text-7xl lg:text-8xl text-white font-bold mb-6 leading-tight"
          style={{ fontFamily: "var(--font-cormorant)" }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Line 1: "Cita Rasa" */}
          <span className="block">
            {headline1.split("").map((char, i) => (
              <motion.span
                key={`h1-${i}`}
                variants={charVariants}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>

          {/* Line 2: "Gunung" in accent italic */}
          <span className="block">
            {headline2.split("").map((char, i) => (
              <motion.span
                key={`h2-${i}`}
                variants={charVariants}
                className="inline-block text-accent italic"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            {"\u00A0"}
            {/* "Autentik" same line */}
            {headline3.split("").map((char, i) => (
              <motion.span
                key={`h3-${i}`}
                variants={charVariants}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-2xl text-white mb-10 max-w-2xl mx-auto font-bold tracking-wide drop-shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          &mdash; Menyajikan kehangatan tradisi Sunda di sejuknya pegunungan Cisarua &mdash;
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <a
            href="#menu"
            onClick={(e) => handleNavClick(e, "#menu")}
            className="bg-accent text-white px-12 py-4 rounded-full text-lg font-bold btn-shine shadow-2xl transition-transform hover:scale-105 min-h-[48px]"
          >
            Eksplor Menu
          </a>
          <a
            href="#reservasi"
            onClick={(e) => handleNavClick(e, "#reservasi")}
            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-12 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-primary transition-all btn-float min-h-[48px]"
          >
            Pesan Meja
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <a
          href="#about"
          onClick={(e) => handleNavClick(e, "#about")}
          className="text-white/40 hover:text-white/70 transition-colors"
          aria-label="Scroll to About section"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <i className="fas fa-chevron-down text-2xl"></i>
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
