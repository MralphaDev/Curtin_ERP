import { getDB } from "@/lib/db/mysql";
import { buildStockMap } from "./stockEngine";
/*
// STANDARD JOIN
export async function getStandardStock(key) {
  const db = getDB();

  const [rows] = await db.query(`
    SELECT 
      vb.model_number_active,
      vb.category,
      vb.manufacturer AS valve_manufacturer,
      vb.inner_diameter_mm,
      vb.temp_min_c,
      vb.temp_max_c,
      vb.pressure_min_bar,
      vb.pressure_max_bar,

      cs.voltage,
      cs.manufacturer AS coil_manufacturer,

      IFNULL(SUM(iei.quantity), 0) as stock

    FROM valve_body vb
    LEFT JOIN coil_standard cs 
      ON cs.unique_key_active = vb.model_number_active

    LEFT JOIN inventory_event_item iei 
      ON iei.item_id = vb.id AND iei.item_type = 'valve_body'

    WHERE vb.model_number_active = ?
    GROUP BY vb.id
  `, [key]);

  return rows;
}

// INDEPENDENT
export async function getIndependentStock(key) {
  const db = getDB();

  const [rows] = await db.query(`
    SELECT 
      ci.unique_key_active,
      ci.voltage,
      ci.manufacturer,
      IFNULL(SUM(iei.quantity), 0) as stock

    FROM coil_independent ci
    LEFT JOIN inventory_event_item iei 
      ON iei.item_id = ci.id AND iei.item_type = 'coil_independent'

    WHERE ci.unique_key_active = ?
    GROUP BY ci.id
  `, [key]);

  return rows;
}*/

// STANDARD (valve + coil)
export async function getStandardStock(key) {
  const db = getDB();

  // 1. valve body
  const [valves] = await db.query(`
    SELECT 
      id,
      model_number_active,
      category,
      manufacturer,
      inner_diameter_mm,
      temp_min_c,
      temp_max_c,
      pressure_min_bar,
      pressure_max_bar
    FROM valve_body
    WHERE model_number_active = ?
      AND deleted_at IS NULL
    LIMIT 1
  `, [key]);

  if (!valves.length) return [];

  const valve = valves[0];

  // 2. coil standard (match by model)
  const [coils] = await db.query(`
    SELECT 
      id,
      coil_model,
      voltage,
      manufacturer
    FROM coil_standard
    WHERE coil_model = ?
      AND deleted_at IS NULL
    LIMIT 1
  `, [key]);

  const coil = coils[0] || null;

  // 3. stock map
  const stockMap = await buildStockMap(db);

  return [
    {
      type: "valve_body",
      id: valve.id,
      model: valve.model_number_active,
      category: valve.category,
      manufacturer: valve.manufacturer,
      stock: stockMap.get(`valve_body_${valve.id}`) || 0
    },
    {
      type: "coil_standard",
      id: coil?.id || null,
      model: coil?.coil_model || null,
      manufacturer: coil?.manufacturer || null,
      stock: coil ? stockMap.get(`coil_standard_${coil.id}`) || 0 : 0
    }
  ];
}

export async function getIndependentStock(key) {
  const db = getDB();

  const [rows] = await db.query(`
    SELECT 
      id,
      coil_idp_model,
      voltage,
      manufacturer
    FROM coil_independent
    WHERE coil_idp_model = ?
      AND deleted_at IS NULL
    LIMIT 1
  `, [key]);

  if (!rows.length) return [];

  const coil = rows[0];
  const stockMap = await buildStockMap(db);

  return [
    {
      type: "coil_independent",
      id: coil.id,
      model: coil.coil_idp_model,
      manufacturer: coil.manufacturer,
      stock: stockMap.get(`coil_independent_${coil.id}`) || 0
    }
  ];
}

export async function getTopProducts(n) {
  const db = getDB();

  const [rows] = await db.query(`
    SELECT 
      vb.model_number_active AS name,
      SUM(iei.quantity) AS value

    FROM inventory_event ie
    JOIN inventory_event_item iei ON ie.id = iei.event_id
    JOIN valve_body vb ON vb.id = iei.item_id

    WHERE ie.action = 'OUT'
      AND iei.item_type = 'valve_body'

    GROUP BY vb.id
    ORDER BY value DESC
    LIMIT ?
  `, [n]);

  return rows;
}

export async function getTopCompanies(n) {
  const db = getDB();

  const [rows] = await db.query(`
    SELECT 
    COALESCE(NULLIF(TRIM(ie.company), ''), 'Unknown') AS name,
    SUM(iei.quantity) AS value

  FROM inventory_event ie
  JOIN inventory_event_item iei ON ie.id = iei.event_id

  WHERE ie.action = 'OUT'
    AND iei.item_type = 'valve_body'
    AND ie.deleted_at IS NULL

  GROUP BY COALESCE(NULLIF(TRIM(ie.company), ''), 'Unknown')
  ORDER BY value DESC
  LIMIT ?
  `, [n]);

  return rows;
}

