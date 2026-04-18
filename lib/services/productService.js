import { getDB } from "@/lib/db/mysql";
import { validateValveBody } from "@/lib/domain/productValidator";

export async function createValveBody(data) {
  validateValveBody(data);

  const db = getDB();

  const [result] = await db.query(
    `INSERT INTO valve_body (model_number, category, manufacturer,inner_diameter_mm, temp_min_c, temp_max_c, pressure_min_bar, pressure_max_bar, connection)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.model_number, data.category, data.manufacturer, data.inner_diameter_mm, data.temp_min_c, data.temp_max_c, data.pressure_min_bar, data.pressure_max_bar, data.connection]
  );

  return { id: result.insertId };
}

export async function getValvesWithStock() {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    // 1. get products
    const [products] = await conn.query(`
      SELECT id, model_number, category, manufacturer, inner_diameter_mm, temp_min_c, temp_max_c, pressure_min_bar, pressure_max_bar, connection
      FROM valve_body
      WHERE deleted_at IS NULL
    `);

    // 2. get inventory movements (with action)
    const [items] = await conn.query(`
      SELECT 
        i.item_type,
        i.item_id,
        i.quantity,
        e.action
      FROM inventory_event_item i
      JOIN inventory_event e ON e.id = i.event_id
    `);

    // 3. build stock map
    const stockMap = new Map();

    for (const item of items) {
      const sign = item.action === "IN" ? 1 : -1;
      const key = `${item.item_type}_${item.item_id}`;

      const current = stockMap.get(key) || 0;
      stockMap.set(key, current + sign * item.quantity);
    }

    // 4. merge stock into products
    return products.map((p) => ({
      ...p,
      stock: stockMap.get(`valve_body_${p.id}`) ?? 0,
    }));
  } finally {
    conn.release();
  }
}

export async function deleteProduct(productId) {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    await conn.query(
      `UPDATE valve_body 
       SET deleted_at = NOW()
       WHERE id = ?`,
      [productId]
    );

    return { success: true };
  } finally {
    conn.release();
  }
}