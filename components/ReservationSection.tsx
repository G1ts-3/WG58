"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type TableStatus = "tersedia" | "tidak tersedia";
type PaymentStatus = "pending" | "paid" | "failed" | "expired";

type TableItem = {
  table_id: string;
  table_number: number;
  capacity: number;
  booking_price: number;
  status: TableStatus;
};

type FormState = {
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: string;
};

type Order = {
  order_id: string;
  table_id: string;
  table_number: number;
  customer_name: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guest_count: number;
  total_price: number;
  payment_status: PaymentStatus;
};

const initialForm: FormState = {
  customer_name: "",
  customer_phone: "",
  reservation_date: "",
  reservation_time: "",
  guest_count: "",
};

const paymentLabels: Record<PaymentStatus, string> = {
  pending: "Pembayaran masih pending.",
  paid: "Pembayaran berhasil. Meja sudah ditandai tidak tersedia.",
  failed: "Pembayaran gagal. Meja tetap tersedia bila belum dibayar order lain.",
  expired: "Pembayaran expired. Meja tetap tersedia bila belum dibayar order lain.",
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan. Silakan coba lagi.");
  }

  return data as T;
}

export default function ReservationSection() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [summary, setSummary] = useState<FormState | null>(null);
  const [formError, setFormError] = useState("");
  const [tableMessage, setTableMessage] = useState("Memuat daftar meja...");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const loadTables = useCallback(async () => {
    setTableMessage("Memuat daftar meja...");
    try {
      const data = await apiFetch<{ tables: TableItem[] }>("/api/tables", { cache: "no-store" });
      setTables(data.tables);
      setSelectedTable((current) => data.tables.find((table) => table.table_id === current?.table_id) || null);
      setTableMessage("");
    } catch (error) {
      setTableMessage(error instanceof Error ? error.message : "Gagal memuat meja.");
    }
  }, []);

  const loadOrderStatus = useCallback(async (orderId: string) => {
    try {
      const data = await apiFetch<{ order: Order }>(`/api/orders/${encodeURIComponent(orderId)}`, {
        cache: "no-store",
      });
      setStatusOrder(data.order);
      await loadTables();
    } catch (error) {
      setPaymentMessage(error instanceof Error ? error.message : "Gagal memuat status pembayaran.");
    }
  }, [loadTables]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadTables();

      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("order_id");
      if (orderId) loadOrderStatus(orderId);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadOrderStatus, loadTables]);

  const validateForm = () => {
    if (!selectedTable) return "Meja wajib dipilih.";
    if (!form.customer_name.trim()) return "Nama pemesan wajib diisi.";
    if (!form.customer_phone.trim()) return "Nomor WhatsApp wajib diisi.";
    if (!form.reservation_date) return "Tanggal reservasi wajib diisi.";
    if (!form.reservation_time) return "Jam reservasi wajib diisi.";

    const guestCount = Number(form.guest_count);
    if (!Number.isInteger(guestCount) || guestCount < 1) return "Jumlah orang wajib diisi.";
    if (guestCount > selectedTable.capacity) return "Jumlah orang tidak boleh lebih dari kapasitas meja.";
    return "";
  };

  const handleContinue = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const error = validateForm();

    if (error) {
      setFormError(error);
      setSummary(null);
      return;
    }

    setFormError("");
    setPaymentMessage("");
    setSummary(form);
  };

  const handlePay = async () => {
    if (!selectedTable || !summary) return;

    setIsPaying(true);
    setPaymentMessage("Membuat order reservasi...");

    try {
      const orderResponse = await apiFetch<{ order_id: string; order: Order }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          table_id: selectedTable.table_id,
          customer_name: summary.customer_name,
          customer_phone: summary.customer_phone,
          reservation_date: summary.reservation_date,
          reservation_time: summary.reservation_time,
          guest_count: Number(summary.guest_count),
        }),
      });

      setPaymentMessage("Menghubungkan ke Midtrans Production...");

      const paymentResponse = await apiFetch<{ redirect_url?: string; snap_token?: string }>(
        "/api/payments/midtrans",
        {
          method: "POST",
          body: JSON.stringify({ order_id: orderResponse.order_id }),
        }
      );

      if (paymentResponse.redirect_url) {
        window.location.href = paymentResponse.redirect_url;
        return;
      }

      throw new Error("Respons pembayaran tidak memiliki redirect_url.");
    } catch (error) {
      setPaymentMessage(error instanceof Error ? error.message : "Gagal membuat pembayaran.");
      setIsPaying(false);
    }
  };

  const resetSelection = () => {
    setSelectedTable(null);
    setSummary(null);
    setForm(initialForm);
    setFormError("");
    setPaymentMessage("");
  };

  const summaryRows = [
    ["Nomor Meja", selectedTable ? `Meja ${selectedTable.table_number}` : "-"],
    ["Kapasitas Meja", selectedTable ? `${selectedTable.capacity} orang` : "-"],
    ["Nama Pemesan", summary?.customer_name || "-"],
    ["Nomor WhatsApp", summary?.customer_phone || "-"],
    ["Tanggal Reservasi", summary?.reservation_date || "-"],
    ["Jam Reservasi", summary?.reservation_time || "-"],
    ["Jumlah Orang", summary?.guest_count ? `${summary.guest_count} orang` : "-"],
    ["Total Bayar", selectedTable ? formatRupiah(selectedTable.booking_price) : "Rp 0"],
  ];

  return (
    <section id="reservasi" className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] bg-[url('/assets/atmosphere.png')] bg-cover bg-center" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-3xl text-white mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
            Reservasi Online
          </span>
          <h2
            className="text-4xl lg:text-6xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Pesan Meja
          </h2>
          <p className="text-white/65 text-sm lg:text-base leading-relaxed">
            Pilih satu meja yang tersedia, lengkapi data reservasi, cek ringkasan, lalu bayar
            booking meja melalui Midtrans.
          </p>
        </motion.div>

        {statusOrder && (
          <div className="mb-8 bg-white border border-parchment-dark rounded-lg p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-warm-gray mb-1">
                  Status Pembayaran
                </p>
                <h3 className="font-bold text-primary text-xl">Order {statusOrder.order_id}</h3>
                <p className="text-sm text-warm-gray mt-1">{paymentLabels[statusOrder.payment_status]}</p>
              </div>
              <button
                type="button"
                onClick={() => loadOrderStatus(statusOrder.order_id)}
                className="h-11 px-5 rounded-lg bg-parchment text-primary font-bold hover:bg-parchment-dark transition-colors"
              >
                Refresh Status
              </button>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="bg-white border border-parchment-dark rounded-lg p-5 md:p-7 shadow-xl">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Langkah 1</p>
                <h3 className="text-2xl font-bold text-primary">Pilih Meja</h3>
              </div>
              <button
                type="button"
                onClick={loadTables}
                className="w-11 h-11 rounded-lg bg-parchment text-primary hover:bg-parchment-dark transition-colors"
                aria-label="Refresh daftar meja"
                title="Refresh daftar meja"
              >
                <i className="fas fa-rotate-right" />
              </button>
            </div>

            {tableMessage && <p className="mb-4 text-sm font-semibold text-warm-gray">{tableMessage}</p>}

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {tables.map((table) => {
                const selected = selectedTable?.table_id === table.table_id;
                const available = table.status === "tersedia";

                return (
                  <button
                    key={table.table_id}
                    type="button"
                    disabled={!available}
                    aria-pressed={selected}
                    onClick={() => {
                      setSelectedTable(table);
                      setSummary(null);
                      setTableMessage(`Meja ${table.table_number} dipilih.`);
                    }}
                    className={`min-h-[158px] rounded-lg border-2 p-4 text-left transition-all ${
                      selected
                        ? "bg-primary text-white border-accent shadow-lg"
                        : available
                          ? "bg-parchment border-transparent hover:border-accent hover:-translate-y-1"
                          : "bg-parchment-dark border-transparent opacity-55 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-6">
                      <span className="text-xl font-extrabold">Meja {table.table_number}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          selected
                            ? "bg-white/15 text-white"
                            : available
                              ? "bg-primary/10 text-primary"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selected ? "dipilih" : table.status}
                      </span>
                    </div>
                    <div className={`grid gap-2 text-sm ${selected ? "text-white/75" : "text-warm-gray"}`}>
                      <span>Kapasitas {table.capacity} orang</span>
                      <span>Harga booking {formatRupiah(table.booking_price)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 content-start">
            <div className="bg-white border border-parchment-dark rounded-lg p-5 md:p-7 shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Langkah 2</p>
              <h3 className="text-2xl font-bold text-primary mb-5">Data Reservasi</h3>

              <form onSubmit={handleContinue} className="grid gap-4">
                <input
                  className="w-full h-12 rounded-lg bg-parchment px-4 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nama pemesan"
                  value={form.customer_name}
                  onChange={(event) => setForm({ ...form, customer_name: event.target.value })}
                />
                <input
                  className="w-full h-12 rounded-lg bg-parchment px-4 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nomor WhatsApp"
                  value={form.customer_phone}
                  onChange={(event) => setForm({ ...form, customer_phone: event.target.value })}
                />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="date"
                    min={today}
                    className="w-full h-12 rounded-lg bg-parchment px-4 outline-none focus:ring-2 focus:ring-primary"
                    value={form.reservation_date}
                    onChange={(event) => setForm({ ...form, reservation_date: event.target.value })}
                  />
                  <input
                    type="time"
                    className="w-full h-12 rounded-lg bg-parchment px-4 outline-none focus:ring-2 focus:ring-primary"
                    value={form.reservation_time}
                    onChange={(event) => setForm({ ...form, reservation_time: event.target.value })}
                  />
                </div>
                <input
                  type="number"
                  min={1}
                  step={1}
                  className="w-full h-12 rounded-lg bg-parchment px-4 outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Jumlah orang"
                  value={form.guest_count}
                  onChange={(event) => setForm({ ...form, guest_count: event.target.value })}
                />

                {formError && <p className="text-sm font-semibold text-red-600">{formError}</p>}

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetSelection}
                    className="h-12 rounded-lg bg-parchment text-primary font-bold hover:bg-parchment-dark transition-colors"
                  >
                    Reset Pilihan
                  </button>
                  <button
                    type="submit"
                    className="h-12 rounded-lg bg-primary text-white font-bold hover:bg-accent transition-colors"
                  >
                    Lanjutkan
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white border border-parchment-dark rounded-lg p-5 md:p-7 shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-1">Langkah 3</p>
              <h3 className="text-2xl font-bold text-primary mb-5">Ringkasan Pesanan</h3>

              <dl className="grid gap-3 mb-5">
                {summaryRows.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[0.9fr_1.1fr] gap-3 border-b border-parchment-dark pb-3">
                    <dt className="text-xs font-bold uppercase text-warm-gray">{label}</dt>
                    <dd className="m-0 text-sm font-bold text-charcoal break-words">{value}</dd>
                  </div>
                ))}
              </dl>

              {paymentMessage && (
                <p className={`mb-4 text-sm font-semibold ${paymentMessage.includes("berhasil") ? "text-primary" : "text-warm-gray"}`}>
                  {paymentMessage}
                </p>
              )}

              <button
                type="button"
                disabled={!selectedTable || !summary || isPaying}
                onClick={handlePay}
                className="w-full h-12 rounded-lg bg-accent text-white font-bold shadow-lg hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPaying ? "Memproses..." : "Bayar Sekarang"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
