import { getDB } from "@/lib/db/mysql";


// ======================================================
// 🟢 CREATE: STANDARD COIL
// ======================================================
export async function createStandardCoil(data) {
  const db = getDB();

  // 1️⃣ Find valve body by model number
  const [rows] = await db.query(
    `
    SELECT id, model_number 
    FROM valve_body 
    WHERE model_number = ? 
      AND deleted_at IS NULL
    `,
    [data.model_number]
  );

  const product = rows[0];

  if (!product) {
    throw new Error("Valve body not found");
  }

  // 2️⃣ 🔥 ADD THIS CHECK (IMPORTANT): check if there are any non deleted coil to avoid dup inserting since i drop unique on db
  const [existing] = await db.query(
  `
  SELECT id 
  FROM coil_standard
  WHERE valve_body_id = ?
    AND deleted_at IS NULL
  `,
  [product.id]
);

if (existing.length > 0) {
  throw new Error("Active coil already exists for this valve body");
}

  // 2️⃣ Insert standard coil linked to valve body
  const [result] = await db.query(
    `
    INSERT INTO coil_standard 
      (valve_body_id, coil_model, voltage, manufacturer)
    VALUES (?, ?, ?, ?)
    `,
    [
      product.id,
      product.model_number,
      data.voltage,
      data.manufacturer,
    ]
  );

  return { id: result.insertId };
}


// ======================================================
// 🟢 CREATE: INDEPENDENT COIL
// ======================================================
export async function createIndependentCoil(data) {
  const db = getDB();

  const [result] = await db.query(
    `
    INSERT INTO coil_independent 
      (coil_idp_model, voltage, manufacturer)
    VALUES (?, ?, ?)
    `,
    [
      data.coil_idp_model,
      data.voltage,
      data.manufacturer,
    ]
  );

  return { id: result.insertId };
}


// ======================================================
// 🔵 GET: STANDARD COILS + STOCK (FIXED)
// ======================================================
export async function getStandardCoilsWithStock() {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    // -------------------------------
    // 1️⃣ FETCH ACTIVE STANDARD COILS
    // FIXED: added deleted_at filter (BUG FIX #1)
    // -------------------------------
    const [coils] = await conn.query(`
      SELECT 
        cs.id,
        cs.coil_model,
        cs.voltage,
        cs.manufacturer,
        vb.model_number AS valve_model
      FROM coil_standard cs
      LEFT JOIN valve_body vb
        ON cs.valve_body_id = vb.id
      WHERE cs.deleted_at IS NULL
      ORDER BY cs.id DESC
    `);


    // -------------------------------
    // 2️⃣ FETCH INVENTORY MOVEMENTS
    // -------------------------------
    const [items] = await conn.query(`
      SELECT 
        i.item_type,
        i.item_id,
        i.quantity,
        e.action
      FROM inventory_event_item i
      JOIN inventory_event e ON e.id = i.event_id
      WHERE e.deleted_at IS NULL
    `);


    // -------------------------------
    // 3️⃣ BUILD STOCK MAP
    // -------------------------------
    const stockMap = new Map();

    for (const item of items) {
      const sign = item.action === "IN" ? 1 : -1;
      const key = `${item.item_type}_${item.item_id}`;

      const current = stockMap.get(key) || 0;
      stockMap.set(key, current + sign * item.quantity);
    }


    // -------------------------------
    // 4️⃣ MERGE STOCK INTO COILS
    // -------------------------------
    return coils.map((c) => ({
      ...c,
      stock: stockMap.get(`coil_standard_${c.id}`) ?? 0,
    }));

  } finally {
    conn.release();
  }
}


// ======================================================
// 🔵 GET: INDEPENDENT COILS + STOCK (FIXED)
// ======================================================
export async function getIndependentCoilsWithStock() {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    // -------------------------------
    // 1️⃣ FETCH ACTIVE INDEPENDENT COILS
    // FIXED: corrected alias + ensured soft delete filter
    // -------------------------------
    const [coils] = await conn.query(`
      SELECT 
        id,
        coil_idp_model,
        voltage,
        manufacturer,
        created_at
      FROM coil_independent
      WHERE deleted_at IS NULL
      ORDER BY id DESC
    `);


    // -------------------------------
    // 2️⃣ FETCH INVENTORY MOVEMENTS
    // -------------------------------
    const [items] = await conn.query(`
      SELECT 
        i.item_type,
        i.item_id,
        i.quantity,
        e.action
      FROM inventory_event_item i
      JOIN inventory_event e ON e.id = i.event_id
    `);


    // -------------------------------
    // 3️⃣ BUILD STOCK MAP
    // -------------------------------
    const stockMap = new Map();

    for (const item of items) {
      const sign = item.action === "IN" ? 1 : -1;
      const key = `${item.item_type}_${item.item_id}`;

      const current = stockMap.get(key) || 0;
      stockMap.set(key, current + sign * item.quantity);
    }


    // -------------------------------
    // 4️⃣ MERGE STOCK INTO COILS
    // -------------------------------
    return coils.map((c) => ({
      ...c,
      stock: stockMap.get(`coil_independent_${c.id}`) ?? 0,
    }));

  } finally {
    conn.release();
  }
}


// ======================================================
// 🔴 SOFT DELETE: STANDARD COIL
// ======================================================
export async function deleteCoilStandard(id) {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    await conn.query(
      `
      UPDATE coil_standard 
      SET deleted_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    return { success: true };
  } finally {
    conn.release();
  }
}


// ======================================================
// 🔴 SOFT DELETE: INDEPENDENT COIL
// ======================================================
export async function deleteCoilIndependent(id) {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    await conn.query(
      `
      UPDATE coil_independent 
      SET deleted_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    return { success: true };
  } finally {
    conn.release();
  }
}