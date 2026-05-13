"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

/* ========================================
   Info Cards — 3D Tilt Effect
   Floating cards below hero with location, hours, and contact
   ======================================== */

const cards = [
  {
    icon: "fas fa-map-marker-alt",
    title: "Lokasi Kami",
    line1: "Jl. Raya Tugu, Cisarua,",
    line2: "Kab. Bandung Barat",
    href: "https://www.google.com/maps/search/Warung+Gunung+58+Jl.+Raya+Tugu,+Kp+Tugu+1+No.58,+Tugumukti,+Kec.+Cisarua",
  },
  {
    icon: "fas fa-clock",
    title: "Jam Operasional",
    line1: "Buka Setiap Hari",
    line2: "09:00 – 21:00 WIB",
  },
  {
    icon: "fas fa-phone-alt",
    title: "Layanan Reservasi",
    line1: "0821-1601-0376",
    line2: "Konsultasi Via WhatsApp",
    href: "https://wa.me/6282116010376",
  },
];

export default function InfoCards() {
  return (
    <section className="container mx-auto px-6 -mt-24 lg:-mt-32 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            className="optimize-gpu"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
          >
            <Tilt
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1500}
              scale={1.05}
              transitionSpeed={800}
              glareEnable={true}
              glareMaxOpacity={0.2}
              glareColor="#ffffff"
              glarePosition="all"
              glareBorderRadius="2rem"
              className="tilt-card"
            >
              {card.href ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="premium-card p-8 lg:p-10 rounded-[2rem] flex items-center gap-5 lg:gap-6 cursor-pointer hover:shadow-2xl transition-all group block"
                >
                  <div className="bg-primary p-4 lg:p-5 rounded-2xl shrink-0 text-white shadow-lg shadow-primary/20 group-hover:bg-accent transition-colors">
                    <i className={`${card.icon} text-2xl lg:text-3xl`}></i>
                  </div>
                  <div className="tilt-card-inner">
                    <h3 className="font-bold text-lg lg:text-xl mb-1 text-primary group-hover:underline" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {card.title}
                    </h3>
                    <p className="text-warm-gray text-xs lg:text-sm leading-relaxed font-medium">
                      {card.line1}
                      <br />
                      {card.line2}
                    </p>
                  </div>
                </a>
              ) : (
                <div className="premium-card p-8 lg:p-10 rounded-[2rem] flex items-center gap-5 lg:gap-6 cursor-default">
                  <div className="bg-primary p-4 lg:p-5 rounded-2xl shrink-0 text-white shadow-lg shadow-primary/20">
                    <i className={`${card.icon} text-2xl lg:text-3xl`}></i>
                  </div>
                  <div className="tilt-card-inner">
                    <h3 className="font-bold text-lg lg:text-xl mb-1 text-primary" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {card.title}
                    </h3>
                    <p className="text-warm-gray text-xs lg:text-sm leading-relaxed font-medium">
                      {card.line1}
                      <br />
                      {card.line2}
                    </p>
                  </div>
                </div>
              )}
            </Tilt>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
