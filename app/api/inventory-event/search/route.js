import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/mysql";

//
// ⚠️ IMPORTANT DESIGN NOTE:
// This endpoint MUST return the same data structure as `/api/inventory-event`.
//
// The frontend assumes every event includes an `items[]` array.
// Even though this is a search endpoint, we still JOIN + GROUP results
// so that each event contains its full items list.
//
// Why this matters:
// - UI functions like `formatEvent()` rely on `event.items[0]`
// - If `items` is missing, the frontend will crash at runtime
// - Keeping a unified schema prevents fragile conditional logic in React
//
// Rule:
// All event-related APIs (normal, search, filtered) must return:
// {
//   id,
//   action,
//   mode,
//   company,
//   created_at,
//   items: [...]
// }
//

export async function GET(req) {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    const { searchParams } = new URL(req.url);
    const model = searchParams.get("model");

    if (!model) {
      return NextResponse.json([]);
    }

    const [rows] = await conn.query(
      `
      SELECT 
        e.id,
        e.action,
        e.mode,
        e.company,
        e.remark,
        e.created_at,
        e.deleted_at,
        i.id AS item_row_id,
        i.item_type,
        i.item_id,
        i.quantity
      FROM inventory_event e
      JOIN inventory_event_item i ON e.id = i.event_id
      JOIN valve_body v ON v.id = i.item_id
      WHERE i.item_type = 'valve_body'
        AND v.model_number_active LIKE ?
      ORDER BY e.created_at DESC
      `,
      [`%${model}%`]
    );

    // group into same structure as main API
    const map = new Map();

    for (const row of rows) {
      if (!map.has(row.id)) {
        map.set(row.id, {
          id: row.id,
          action: row.action,
          mode: row.mode,
          company: row.company,
          remark: row.remark,
          created_at: row.created_at,
          deleted_at: row.deleted_at,
          items: []
        });
      }

      map.get(row.id).items.push({
        id: row.item_row_id,
        event_id: row.id,
        item_type: row.item_type,
        item_id: row.item_id,
        quantity: row.quantity
      });
    }

    return NextResponse.json([...map.values()]);

  } finally {
    conn.release();
  }
}
