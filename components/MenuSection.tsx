"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useCart, MenuItem } from "@/context/CartContext";
import { menuItems, categories } from "@/data/menu";

/* Star rating renderer */
function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  return (
    <div className="flex justify-center gap-0.5 text-accent mb-3">
      {[...Array(full)].map((_, i) => (
        <i key={i} className="fas fa-star text-sm"></i>
      ))}
      {half && <i className="fas fa-star-half-alt text-sm"></i>}
    </div>
  );
}

/* Format Rupiah */
function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

/* Detailed Info Modal */
function MenuInfoModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const isInCart = items.some(i => i.id === item.id);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-parchment w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-accent text-charcoal hover:text-white rounded-full flex items-center justify-center z-10 transition-colors">
          <i className="fas fa-times" />
        </button>

        {/* Image side */}
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <span className="bg-accent px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">WG58 Legend</span>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>{item.name}</h2>
          </div>
        </div>

        {/* Content side */}
        <div className="md:w-1/2 p-8 lg:p-12 overflow-y-auto">
          <div className="mb-8">
            <h4 className="text-accent font-bold text-xs uppercase tracking-widest mb-4">Filosofi & Asal Usul</h4>
            <p className="text-charcoal/80 leading-relaxed italic">{item.story || "Resep rahasia keluarga WG58 yang dijaga keasliannya."}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <i className="fas fa-utensils" /> Porsi
              </h4>
              <p className="text-sm text-charcoal/70 font-medium">{item.portion || "Per Porsi"}</p>
            </div>
            <div>
              <h4 className="text-primary font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <i className="fas fa-pepper-hot" /> Profil Rasa
              </h4>
              <p className="text-sm text-charcoal/70 font-medium">{item.taste || "Gurih & Lezat"}</p>
            </div>
          </div>

          <div className="border-t border-parchment-dark pt-8 mt-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs text-warm-gray uppercase tracking-widest mb-1">Estimasi Harga</p>
              <p className="text-3xl font-bold text-primary" style={{ fontFamily: "var(--font-cormorant)" }}>{formatRupiah(item.price)}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16 optimize-gpu"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
            Eksplorasi Rasa
          </span>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 text-primary leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Sajian Istimewa
          </h2>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 min-h-[44px] ${
                  activeCategory === cat.key
                    ? "bg-accent text-white shadow-xl shadow-accent/20"
                    : "bg-parchment text-charcoal-light border border-parchment-dark hover:border-accent hover:text-accent"
                }`}
                aria-label={`Filter by ${cat.label}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Menu Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group premium-card rounded-[2rem] overflow-hidden flex flex-col transition-all duration-500"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-64 lg:h-72">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-white border border-parchment-dark px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider shadow-sm">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 text-center flex-grow flex flex-col">
                  <Stars rating={item.rating} />
                  <h3
                    className="text-2xl lg:text-3xl font-bold mb-3 text-primary"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-warm-gray text-sm mb-8 leading-relaxed line-clamp-2 italic">
                    &quot;{item.description}&quot;
                  </p>

                  <div className="mt-auto pt-6 border-t border-parchment-dark flex flex-col gap-4">
                    <span className="text-primary font-bold text-xl lg:text-2xl" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {formatRupiah(item.price)}
                    </span>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-accent transition-all shadow-md hover:shadow-xl active:scale-95"
                    >
                      Info Selengkapnya
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Detailed Modal */}
        <AnimatePresence>
          {selectedItem && (
            <MenuInfoModal 
              item={selectedItem} 
              onClose={() => setSelectedItem(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
