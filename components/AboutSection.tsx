"use client";

import { motion } from "framer-motion";
import Image from "next/image";

/* ========================================
   About Section — Asymmetric Grid + Slow Zoom
   Features an offset image with continuous slow zoom,
   experience badge, and feature icons
   ======================================== */

const features = [
  { icon: "fas fa-leaf", label: "Bahan Organik" },
  { icon: "fas fa-utensils", label: "Resep Orisinil" },
  { icon: "fas fa-mountain", label: "Suasana Sejuk" },
  { icon: "fas fa-wifi", label: "Koneksi Cepat" },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 relative bg-parchment">
      <div className="container mx-auto px-6">
        {/* Asymmetric Grid: image takes more space, text offset */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Image Column — spans 7 of 12 columns */}
          <motion.div
            className="lg:col-span-7 relative optimize-gpu"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Decorative blur */}
            <div className="absolute -top-16 -left-16 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none optimize-gpu" />

            {/* Main Image Container */}
            <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[3rem] shadow-2xl">
              <div className="slow-zoom">
                <Image
                  src="/assets/atmosphere.png"
                  alt="Suasana Warung Gunung 58 yang asri dan sejuk"
                  width={900}
                  height={600}
                  className="w-full h-[400px] lg:h-[600px] object-cover"
                  priority
                />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-60" />
            </div>

            {/* Experience Badge */}
            <motion.div
              className="absolute -bottom-6 -right-4 lg:-bottom-8 lg:-right-8 premium-card p-8 lg:p-10 rounded-[2rem] z-20 hidden sm:block border-accent/20 optimize-gpu"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            >
              <p
                className="text-primary text-4xl lg:text-6xl font-bold mb-1 tracking-tighter"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                10+
              </p>
              <p className="text-warm-gray text-[10px] lg:text-xs font-bold uppercase tracking-[0.3em]">
                Tahun <br/> Pengalaman
              </p>
            </motion.div>
          </motion.div>

          {/* Text Column — spans 5 of 12 columns */}
          <motion.div
            className="lg:col-span-5 lg:pl-8 optimize-gpu"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs mb-5 block">
              Kisah Kami
            </span>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] text-primary"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Melestarikan Warisan Sunda
            </h2>
            <p className="text-warm-gray text-base lg:text-lg mb-10 leading-loose font-light">
              Berdiri di tengah asrinya Cisarua,{" "}
              <strong className="text-charcoal font-semibold">
                Warung Gunung 58 (WG58)
              </strong>{" "}
              lahir dari kerinduan akan rasa masakan rumah yang autentik. Kami
              menggunakan bumbu tradisional yang diracik segar setiap pagi.
            </p>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-8 mb-10">
              {features.map((feat) => (
                <div key={feat.label} className="flex items-center gap-3 group">
                  <div className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <i
                      className={`${feat.icon} text-primary group-hover:text-white transition-colors duration-300`}
                    ></i>
                  </div>
                  <span className="font-semibold text-charcoal text-sm lg:text-base">
                    {feat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Link */}
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#menu")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-3 text-primary font-bold text-lg hover:text-accent transition-colors group"
            >
              Jelajahi Menu Kami
              <i className="fas fa-long-arrow-alt-right transition-transform group-hover:translate-x-3"></i>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
