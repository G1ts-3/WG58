import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { nama, whatsapp, email, tanggal, waktu, jumlahTamu } = await req.json();

    // Validate required fields
    if (!nama || !whatsapp || !tanggal || !waktu || !jumlahTamu) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap" },
        { status: 400 }
      );
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
        Authorization: process.env.FONNTE_TOKEN || "",
      },
      body: formData,
    });

    const result = await response.json();

    if (result.status) {
      return NextResponse.json({ success: true, message: "Pesan WhatsApp terkirim!" });
    } else {
      return NextResponse.json(
        { success: false, message: result.reason || "Gagal mengirim" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("WA API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
