// Netlify Serverless Function — Sends WhatsApp via Fonnte API
// This runs server-side so the API token is never exposed to the browser.

export default async (req) => {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { nama, whatsapp, email, tanggal, waktu, jumlahTamu } = await req.json();

    // Validate required fields
    if (!nama || !whatsapp || !tanggal || !waktu || !jumlahTamu) {
      return new Response(JSON.stringify({ success: false, message: "Data tidak lengkap" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Format the WhatsApp message
    const message = `📋 *RESERVASI BARU - WARUNG GUNUNG 58*

━━━━━━━━━━━━━━━━━━━━━
👤 *Nama:* ${nama}
📱 *WhatsApp:* ${whatsapp}
📧 *Email:* ${email || "-"}
━━━━━━━━━━━━━━━━━━━━━
📅 *Tanggal:* ${tanggal}
🕐 *Waktu:* ${waktu}
👥 *Jumlah Tamu:* ${jumlahTamu}
━━━━━━━━━━━━━━━━━━━━━

_Pesan ini dikirim otomatis dari website WG58._
_Segera hubungi pelanggan untuk konfirmasi & instruksi DP._`;

    // Send via Fonnte API
    const formData = new URLSearchParams();
    formData.append("target", "081381222576");
    formData.append("message", message);
    formData.append("countryCode", "62");

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: process.env.FONNTE_TOKEN,
      },
      body: formData,
    });

    const result = await response.json();

    if (result.status) {
      return new Response(JSON.stringify({ success: true, message: "Pesan WhatsApp terkirim!" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: result.reason || "Gagal mengirim" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/send-wa",
};
