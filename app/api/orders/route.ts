import { createReservationOrder, jsonError, jsonResponse } from "@/lib/reservationStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = createReservationOrder(data);

    if (result.error || !result.order) {
      return jsonError(result.error || "Data reservasi tidak valid.");
    }

    return jsonResponse(
      { success: true, order_id: result.order.order_id, order: result.order },
      { status: 201 }
    );
  } catch {
    return jsonError("Payload JSON tidak valid.");
  }
}
