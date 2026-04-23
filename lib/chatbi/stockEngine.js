// lib/reports/stockEngine.js
import { getDB } from "@/lib/db/mysql";

export async function buildStockMap(db) {
  const [items] = await db.query(`
    SELECT 
      i.item_type,
      i.item_id,
      i.quantity,
      e.action
    FROM inventory_event_item i
    JOIN inventory_event e ON e.id = i.event_id
    WHERE e.deleted_at IS NULL
  `);

  const map = new Map();

  for (const item of items) {
    const key = `${item.item_type}_${item.item_id}`;
    const sign = item.action === "IN" ? 1 : -1;

    map.set(key, (map.get(key) || 0) + sign * Number(item.quantity));
  }

  return map;
}