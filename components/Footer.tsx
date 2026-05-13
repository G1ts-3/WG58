"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0F1A14] pt-24 pb-12 relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 pb-20 border-b border-white/5">
          
          {/* Brand Section (Column 1-4) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-accent blur-md opacity-20 animate-pulse" />
                <Image 
                  src="/logo.jpg" 
                  alt="WG58 Logo" 
                  width={64} 
                  height={64} 
                  className="rounded-full border-2 border-accent p-1 relative z-10" 
                />
              </div>
              <div>
                <span className="text-3xl font-bold text-white tracking-tighter block" style={{ fontFamily: "var(--font-cormorant)" }}>WG58</span>
                <span className="text-[10px] text-accent font-bold uppercase tracking-[0.4em]">Warung Gunung</span>
              </div>
            </div>
            <p className="text-white/50 leading-relaxed mb-10 text-sm lg:text-base italic max-w-sm">
              &ldquo;Melestarikan cita rasa Sunda autentik dengan sentuhan modernitas. Tempat di mana setiap hidangan memiliki cerita dan setiap kunjungan adalah kenangan.&rdquo;
            </p>
            <div className="flex gap-4">
              {[{ icon: "fab fa-instagram", label: "Instagram" }, { icon: "fab fa-tiktok", label: "TikTok" }, { icon: "fab fa-whatsapp", label: "WhatsApp" }].map((s, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/50 hover:bg-accent hover:text-white hover:-translate-y-1 transition-all shadow-lg"
                  aria-label={s.label}
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Map Section (Column 5-8) */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold text-xs mb-8 uppercase tracking-[0.3em]">Temukan Kami</h4>
            <div className="rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group h-64 relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.545123307775!2d107.514742!3d-6.825026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e45447a1262d%3A0x6734c5689408f6d3!2sWarung%20Gunung%2058!5e0!3m2!1sen!2sid!4v1715560000000!5m2!1sen!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute bottom-4 right-4">
                <a 
                  href="https://www.google.com/maps/search/Warung+Gunung+58+Jl.+Raya+Tugu,+Kp+Tugu+1+No.58,+Tugumukti,+Kec.+Cisarua" 
                  target="_blank" 
                  className="bg-accent text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-directions" /> Petunjuk Arah
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links & Contact (Column 9-12) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white font-bold text-xs mb-8 uppercase tracking-[0.3em]">Tautan</h4>
              <ul className="space-y-4">
                {[{ label: "Beranda", href: "#home" }, { label: "Tentang", href: "#about" }, { label: "Menu", href: "#menu" }, { label: "Reservasi", href: "#reservasi" }].map(l => (
                  <li key={l.href}>
                    <a 
                      href={l.href} 
                      onClick={e => handleNavClick(e, l.href)} 
                      className="text-white/40 hover:text-accent transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                    >
                      <span className="w-1 h-1 bg-accent/30 rounded-full" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-xs mb-8 uppercase tracking-[0.3em]">Kontak</h4>
              <div className="space-y-6 text-white/50">
                <div>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">WhatsApp</p>
                  <p className="text-white font-bold">0821-1601-0376</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">Email</p>
                  <p className="text-xs">warunggunung58@gmail.com</p>
                </div>
                <div className="pt-4">
                  <p className="text-[10px] text-white/30 leading-relaxed uppercase">Jl. Raya Tugu No.58, Cisarua, Bandung Barat</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>&copy; 2026 Warung Gunung 58. Melestarikan Budaya Melalui Rasa.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
