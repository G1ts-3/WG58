import {
  assertMidtransConfigured,
  jsonError,
  jsonResponse,
  mapPaymentStatus,
  readOrders,
  verifyMidtransSignature,
  writeOrders,
  type MidtransNotification,
} from "@/lib/reservationStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const configError = assertMidtransConfigured();
  if (configError) return jsonError(configError, 500);

  let notification: MidtransNotification;
  try {
    notification = await request.json();
  } catch {
    return jsonError("Payload JSON tidak valid.");
  }

  if (!verifyMidtransSignature(notification)) {
    return jsonError("Signature Midtrans tidak valid.", 403);
  }

  const orders = readOrders();
  const order = orders.find((item) => item.midtrans_order_id === notification.order_id);

  if (!order) {
    const orderId = notification.order_id || "";
    const looksLikeDashboardTest =
      orderId.toLowerCase().includes("test") || orderId.toLowerCase().includes("notification");

    if (looksLikeDashboardTest) {
      return jsonResponse({
        success: true,
        message: "Tes notifikasi Midtrans diterima.",
      });
    }

    return jsonError("Order tidak ditemukan.", 404);
  }

  const grossAmount = Math.round(Number(notification.gross_amount));
  if (grossAmount !== order.total_price) {
    return jsonError("Gross amount tidak sesuai total order.");
  }

  order.payment_status = mapPaymentStatus(notification.transaction_status, notification.fraud_status);
  order.midtrans_transaction_id = notification.transaction_id || order.midtrans_transaction_id;
  order.updated_at = new Date().toISOString();
  writeOrders(orders);

  return jsonResponse({
    success: true,
    order_id: order.order_id,
    payment_status: order.payment_status,
  });
}
