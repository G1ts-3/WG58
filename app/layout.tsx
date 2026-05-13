import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/* ========================================
   Google Fonts Configuration
   Cormorant Garamond — Premium serif for headings
   Plus Jakarta Sans — Clean sans-serif for body/UI
   ======================================== */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

/* ========================================
   SEO Metadata
   ======================================== */
export const metadata: Metadata = {
  title: "Warung Gunung 58 | Kuliner Autentik Cisarua, Bandung Barat",
  description:
    "Warung Gunung 58 (WG58) menyajikan kehangatan tradisi kuliner Sunda di sejuknya pegunungan Cisarua. Reservasi meja & pesan menu autentik dengan bahan organik pilihan.",
  keywords: [
    "warung gunung 58",
    "WG58",
    "kuliner cisarua",
    "masakan sunda",
    "restoran bandung barat",
    "ayam bakar cisarua",
    "gurame cobek",
    "reservasi restoran",
  ],
  openGraph: {
    title: "Warung Gunung 58 | Kuliner Autentik Cisarua",
    description:
      "Cita rasa gunung autentik. Menyajikan masakan Sunda dengan bahan organik di tengah sejuknya Cisarua, Bandung Barat.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${jakarta.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/logo.jpg" />
        {/* Font Awesome Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
