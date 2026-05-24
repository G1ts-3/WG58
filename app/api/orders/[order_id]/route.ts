import { jsonError, jsonResponse, readOrders, syncOrderWithMidtrans } from "@/lib/reservationStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const { order_id } = await params;
  const order = readOrders().find((item) => item.order_id === order_id);

  if (!order) {
    return jsonError("Order tidak ditemukan.", 404);
  }

  const syncedOrder = await syncOrderWithMidtrans(order);

  return jsonResponse({ success: true, order: syncedOrder });
}
