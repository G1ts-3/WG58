import { getTablesWithStatus, jsonResponse } from "@/lib/reservationStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return jsonResponse({ success: true, tables: getTablesWithStatus() });
}
