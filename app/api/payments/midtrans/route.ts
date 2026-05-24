import {
  assertMidtransConfigured,
  getAppUrl,
  getMidtransSnapEndpoint,
  isTableAvailable,
  jsonError,
  jsonResponse,
  readOrders,
  writeOrders,
} from "@/lib/reservationStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const configError = assertMidtransConfigured();
  if (configError) return jsonError(configError, 500);

  let data: { order_id?: string };
  try {
    data = await request.json();
  } catch {
    return jsonError("Payload JSON tidak valid.");
  }

  const orders = readOrders();
  const order = orders.find((item) => item.order_id === data.order_id);

  if (!order) return jsonError("Order tidak ditemukan.", 404);
  if (order.payment_status !== "pending") return jsonError("Order tidak dalam status pending.");
  if (!isTableAvailable(order.table_id)) return jsonError("Meja sudah tidak tersedia.", 409);

  const appUrl = getAppUrl(request);
  const returnUrl = `${appUrl}/?order_id=${encodeURIComponent(order.order_id)}#reservasi`;
  const payload = {
    transaction_details: {
      order_id: order.midtrans_order_id,
      gross_amount: order.total_price,
    },
    enabled_payments: [
      "bank_transfer",
      "gopay",
      "shopeepay",
      "credit_card",
      "cstore",
      "akulaku",
    ],
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: order.customer_name,
      phone: order.customer_phone,
    },
    item_details: [
      {
        id: order.table_id,
        price: order.total_price,
        quantity: 1,
        name: `Booking Meja ${order.table_number}`,
      },
    ],
    callbacks: {
      finish: returnUrl,
      error: returnUrl,
      pending: returnUrl,
    },
    notification_url: `${appUrl}/api/payments/notification`,
    custom_field1: order.table_id,
    custom_field2: order.reservation_date,
    custom_field3: order.reservation_time,
  };

  const midtransResponse = await fetch(getMidtransSnapEndpoint(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString("base64")}`,
    },
    body: JSON.stringify(payload),
  });

  const midtransData = await midtransResponse.json().catch(() => ({}));
  if (!midtransResponse.ok) {
    const message =
      midtransData.error_messages?.join(" ") ||
      midtransData.status_message ||
      "Gagal membuat transaksi Midtrans.";
    return jsonError(message, midtransResponse.status);
  }

  order.updated_at = new Date().toISOString();
  writeOrders(orders);

  return jsonResponse({
    success: true,
    order_id: order.order_id,
    snap_token: midtransData.token,
    redirect_url: midtransData.redirect_url,
  });
}
