/* ========================================
   Menu Data for WG58
   Updated with stories, origins, and drinks
   ======================================== */

import { MenuItem } from "@/context/CartContext";

export const menuItems: MenuItem[] = [
  // MAKANAN
  {
    id: "ayam-bakar-madu",
    name: "Ayam Bakar Madu",
    price: 35000,
    image: "/assets/ayam_bakar.png",
    description: "Ayam bakar bumbu rempah pilihan dengan olesan madu hutan.",
    category: "makanan",
    rating: 5,
    story: "Resep turun temurun dari nenek moyang pendiri WG58. Dinamakan 'Gunung' karena menggunakan madu hutan asli yang diambil langsung dari lereng pegunungan Cisarua, memberikan rasa manis alami yang meresap hingga ke tulang.",
    portion: "1 Ekor Potong 4 / Per Porsi",
    taste: "Manis Gurih dengan aroma Smokey yang kuat"
  },
  {
    id: "gurame-cobek",
    name: "Gurame Cobek",
    price: 75000,
    image: "/assets/gurame.png",
    description: "Gurame goreng renyah disiram sambal cobek dadakan.",
    category: "makanan",
    rating: 5,
    story: "Filosofi 'Cobek' melambangkan kesegaran. Ikan gurame diambil langsung dari kolam saat dipesan, lalu dibumbui di atas cobek batu asli. Sambalnya dibuat 'dadakan' untuk menjaga tekstur renyah ikan dan kesegaran cabai rawit hijau.",
    portion: "500-600 gram (Cukup untuk 2-3 orang)",
    taste: "Sangat Pedas, Segar (Asam Jeruk Limau), dan Gurih"
  },
  {
    id: "nasi-liwet",
    name: "Nasi Liwet Komplit",
    price: 28000,
    image: "/assets/ayam_bakar.png",
    description: "Nasi liwet khas Sunda dengan lauk pauk lengkap.",
    category: "makanan",
    rating: 5,
    story: "Simbol kebersamaan masyarakat Sunda. Cara memasak 'Liwet' (langsung di dalam panci kastrol) menciptakan lapisan nasi kerak (ngahaja) yang sangat diminati. Lauk ikan asin dan petai menjadikannya sajian nostalgia pedesaan.",
    portion: "Per Porsi (Panci Kastrol Kecil)",
    taste: "Wangi Rempah (Sereh & Salam), Gurih Santan, dan Asin"
  },
  {
    id: "tumis-kangkung",
    name: "Tumis Kangkung",
    price: 15000,
    image: "/assets/kangkung.png",
    description: "Kangkung segar pilihan ditumis dengan terasi premium.",
    category: "makanan",
    rating: 5,
    story: "Kangkung ditanam menggunakan metode hidroponik dengan air pegunungan yang jernih. Terasi yang digunakan berasal dari Cirebon pilihan, memberikan aroma khas yang menggugah selera tanpa rasa amis yang berlebihan.",
    portion: "Piring Sedang",
    taste: "Gurih, Crunchy, dan Sedikit Pedas"
  },

  // MINUMAN
  {
    id: "es-kelapa-muda",
    name: "Es Kelapa Muda",
    price: 20000,
    image: "/assets/kangkung.png", // Placeholder, reuse assets or use generic
    description: "Kelapa muda segar dengan serutan daging kelapa lembut.",
    category: "minuman",
    rating: 5,
    story: "Dipetik langsung dari pohon kelapa di pesisir Jawa Barat setiap pagi. Air kelapa murni tanpa tambahan pemanis buatan, sangat cocok untuk meredam rasa pedas sambal cobek kami.",
    portion: "Gelas Besar / Batok Kelapa",
    taste: "Manis Alami dan Sangat Menyegarkan"
  },
  {
    id: "teh-poci-gula-batu",
    name: "Teh Poci Gula Batu",
    price: 15000,
    image: "/assets/ikan_bakar.png",
    description: "Teh melati hangat disajikan dalam poci tanah liat.",
    category: "minuman",
    rating: 4.5,
    story: "Mengusung tradisi 'Moci'. Teh diseduh dalam poci tanah liat yang memberikan aroma 'earthy' unik. Dinikmati dengan gula batu yang mencair perlahan, melambangkan kesabaran dalam menikmati hidup.",
    portion: "1 Poci (Bisa untuk 2 orang)",
    taste: "Wangi Melati, Sepat-sepat Manis"
  },
  {
    id: "jus-alpukat",
    name: "Jus Alpukat Kerok",
    price: 22000,
    image: "/assets/gurame.png",
    description: "Jus alpukat kental dengan topping potongan alpukat segar.",
    category: "minuman",
    rating: 5,
    story: "Menggunakan Alpukat Mentega pilihan dari petani lokal. Teksturnya yang creamy seperti mentega menjadikannya favorit pengunjung sebagai hidangan penutup yang mengenyangkan.",
    portion: "Gelas Tinggi",
    taste: "Creamy, Manis Cokelat, dan Lembut"
  }
];

export const categories = [
  { key: "all", label: "Semua" },
  { key: "makanan", label: "Makanan" },
  { key: "minuman", label: "Minuman" },
];
