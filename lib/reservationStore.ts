import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type TableStatus = "tersedia" | "tidak tersedia";
export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export type RestaurantTable = {
  table_id: string;
  table_number: number;
  capacity: number;
  booking_price: number;
  status: TableStatus;
};

export type ReservationOrder = {
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
  midtrans_transaction_id: string | null;
  midtrans_order_id: string;
  created_at: string;
  updated_at: string;
};

export type ReservationInput = {
  table_id?: string;
  customer_name?: string;
  customer_phone?: string;
  reservation_date?: string;
  reservation_time?: string;
  guest_count?: number | string;
};

export type MidtransNotification = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
  transaction_status?: string;
  fraud_status?: string;
  transaction_id?: string;
};

const ordersFile = path.join(process.cwd(), "data", "orders.json");

export const tables: RestaurantTable[] = [
  { table_id: "table-1", table_number: 1, capacity: 2, booking_price: 25000, status: "tersedia" },
  { table_id: "table-2", table_number: 2, capacity: 2, booking_price: 25000, status: "tersedia" },
  { table_id: "table-3", table_number: 3, capacity: 4, booking_price: 40000, status: "tersedia" },
  { table_id: "table-4", table_number: 4, capacity: 4, booking_price: 40000, status: "tersedia" },
  { table_id: "table-5", table_number: 5, capacity: 6, booking_price: 60000, status: "tersedia" },
  { table_id: "table-6", table_number: 6, capacity: 6, booking_price: 60000, status: "tidak tersedia" },
];

export function jsonResponse(payload: unknown, init?: ResponseInit) {
  return Response.json(payload, init);
}

export function jsonError(message: string, status = 400) {
  return jsonResponse({ success: false, message }, { status });
}

export function ensureOrdersFile() {
  const dir = path.dirname(ordersFile);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, "[]\n");
}

export function readOrders(): ReservationOrder[] {
  ensureOrdersFile();
  const content = fs.readFileSync(ordersFile, "utf8").trim();
  if (!content) return [];
  return JSON.parse(content) as ReservationOrder[];
}

export function writeOrders(orders: ReservationOrder[]) {
  ensureOrdersFile();
  fs.writeFileSync(ordersFile, `${JSON.stringify(orders, null, 2)}\n`);
}

export function getTable(tableId?: string) {
  return tables.find((table) => table.table_id === tableId);
}

export function getTablesWithStatus() {
  const paidTableIds = new Set(
    readOrders()
      .filter((order) => order.payment_status === "paid")
      .map((order) => order.table_id)
  );

  return tables.map((table) => ({
    ...table,
    status: table.status === "tidak tersedia" || paidTableIds.has(table.table_id) ? "tidak tersedia" : "tersedia",
  }));
}

export function isTableAvailable(tableId: string) {
  return getTablesWithStatus().find((table) => table.table_id === tableId)?.status === "tersedia";
}

export function validateReservationInput(data: ReservationInput, table: RestaurantTable | undefined) {
  if (!data.table_id) return "Meja wajib dipilih.";
  if (!table) return "Meja tidak ditemukan.";
  if (!isTableAvailable(data.table_id)) return "Meja sudah tidak tersedia.";
  if (!String(data.customer_name || "").trim()) return "Nama pemesan wajib diisi.";
  if (!String(data.customer_phone || "").trim()) return "Nomor WhatsApp wajib diisi.";
  if (!String(data.reservation_date || "").trim()) return "Tanggal reservasi wajib diisi.";
  if (!String(data.reservation_time || "").trim()) return "Jam reservasi wajib diisi.";

  const guestCount = Number(data.guest_count);
  if (!Number.isInteger(guestCount) || guestCount < 1) return "Jumlah orang wajib diisi.";
  if (guestCount > table.capacity) return "Jumlah orang tidak boleh lebih dari kapasitas meja.";
  return "";
}

export function createReservationOrder(data: ReservationInput) {
  const table = getTable(data.table_id);
  const validationError = validateReservationInput(data, table);
  if (validationError || !table || !data.table_id) {
    return { error: validationError || "Data reservasi tidak valid." };
  }

  const timestamp = new Date().toISOString();
  const orderId = `WG58-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const order: ReservationOrder = {
    order_id: orderId,
    table_id: table.table_id,
    table_number: table.table_number,
    customer_name: String(data.customer_name).trim(),
    customer_phone: String(data.customer_phone).trim(),
    reservation_date: String(data.reservation_date).trim(),
    reservation_time: String(data.reservation_time).trim(),
    guest_count: Number(data.guest_count),
    total_price: table.booking_price,
    payment_status: "pending",
    midtrans_transaction_id: null,
    midtrans_order_id: orderId,
    created_at: timestamp,
    updated_at: timestamp,
  };

  const orders = readOrders();
  orders.push(order);
  writeOrders(orders);

  return { order };
}

export function isMidtransProduction() {
  return String(process.env.MIDTRANS_IS_PRODUCTION).toLowerCase() === "true";
}

export function getMidtransSnapEndpoint() {
  return isMidtransProduction()
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
}

export function getMidtransApiBaseUrl() {
  return isMidtransProduction()
    ? "https://api.midtrans.com"
    : "https://api.sandbox.midtrans.com";
}

export function assertMidtransConfigured() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
  if (!serverKey) return "Midtrans key belum dikonfigurasi.";
  return "";
}

export function getAppUrl(request: Request) {
  const fromEnv = process.env.APP_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return new URL(request.url).origin;
}

export function verifyMidtransSignature(notification: MidtransNotification) {
  if (!notification.signature_key) return false;
  const raw = `${notification.order_id || ""}${notification.status_code || ""}${notification.gross_amount || ""}${process.env.MIDTRANS_SERVER_KEY || ""}`;
  const expected = crypto.createHash("sha512").update(raw).digest("hex");
  return expected === notification.signature_key;
}

export function mapPaymentStatus(transactionStatus?: string, fraudStatus?: string): PaymentStatus {
  if (fraudStatus === "deny") return "failed";
  if (transactionStatus === "capture" || transactionStatus === "settlement") return "paid";
  if (transactionStatus === "pending") return "pending";
  if (transactionStatus === "expire") return "expired";
  if (["deny", "cancel", "failure", "refund", "partial_refund", "chargeback", "partial_chargeback"].includes(transactionStatus || "")) {
    return "failed";
  }
  return "pending";
}

export async function syncOrderWithMidtrans(order: ReservationOrder) {
  const configError = assertMidtransConfigured();
  if (configError || order.payment_status !== "pending") return order;

  const response = await fetch(
    `${getMidtransApiBaseUrl()}/v2/${encodeURIComponent(order.midtrans_order_id)}/status`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status_code === "404") return order;

  const grossAmount = Math.round(Number(data.gross_amount));
  if (Number.isFinite(grossAmount) && grossAmount !== order.total_price) return order;

  order.payment_status = mapPaymentStatus(data.transaction_status, data.fraud_status);
  order.midtrans_transaction_id = data.transaction_id || order.midtrans_transaction_id;
  order.updated_at = new Date().toISOString();

  const orders = readOrders();
  const index = orders.findIndex((item) => item.order_id === order.order_id);
  if (index !== -1) {
    orders[index] = order;
    writeOrders(orders);
  }

  return order;
}
