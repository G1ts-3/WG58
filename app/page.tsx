"use client";

import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InfoCards from "@/components/InfoCards";
import AboutSection from "@/components/AboutSection";
import MenuSection from "@/components/MenuSection";
import ReservationSection from "@/components/ReservationSection";
import Footer from "@/components/Footer";
import { ScrollToTop, WhatsAppFloat } from "@/components/FloatingButtons";

export default function Home() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <HeroSection />
        <InfoCards />
        <AboutSection />
        <MenuSection />
        <ReservationSection />
      </main>
      <Footer />
      <ScrollToTop />
      <WhatsAppFloat />
    </CartProvider>
  );
}
