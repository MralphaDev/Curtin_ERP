import { getDB } from "../db/mysql";

export async function getValveBodyReport(n) {
  const db = getDB();

  const [rows] = await db.query(
    `
    SELECT 
      vb.model_number AS model_number,
      vb.category AS category,
      vb.manufacturer AS manufacturer,
      ie.company AS company,
      ie.created_at AS date,
      SUM(iei.quantity) AS qty

    FROM inventory_event ie
    JOIN inventory_event_item iei ON ie.id = iei.event_id
    JOIN valve_body vb ON vb.id = iei.item_id

    WHERE ie.action = 'OUT'
      AND iei.item_type = 'valve_body'
      AND ie.deleted_at IS NULL

    GROUP BY vb.id, ie.company, ie.created_at
    ORDER BY vb.manufacturer, vb.model_number
    `
  );

  return rows;
}


export function buildManufacturerReport(rows) {
  const map = new Map();

  for (const r of rows) {
    const manufacturer = r.manufacturer; // ✅ REAL VALUE NOW

    if (!map.has(manufacturer)) {
      map.set(manufacturer, {
        manufacturer,
        products: new Map(),
      });
    }

    const m = map.get(manufacturer);

    const key = r.model_number;

    if (!m.products.has(key)) {
      m.products.set(key, {
        model_number: r.model_number,
        category: r.category,
        total_sales: 0,
        companies: {},
      });
    }

    const p = m.products.get(key);

    p.total_sales += Number(r.qty);

    if (!p.companies[r.company]) {
      p.companies[r.company] = {
        company: r.company,
        qty: 0,
        dates: [],
      };
    }

    p.companies[r.company].qty += Number(r.qty);
    p.companies[r.company].dates.push(r.date);
  }

  return Array.from(map.values()).map((m) => ({
    manufacturer: m.manufacturer,
    products: Array.from(m.products.values()).map((p, i) => ({
      id: i + 1,
      ...p,
      companies: Object.values(p.companies),
    })),
  }));
}