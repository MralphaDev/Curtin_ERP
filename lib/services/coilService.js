import { getDB } from "@/lib/db/mysql";


// ======================================================
// 🟢 CREATE: STANDARD COIL
// ======================================================
/*
export async function createStandardCoil(data) {
  const db = getDB();

  // 1️⃣ Find the exact valve body id in valve_body by model number of this coil (we dont know if this valve body has any coil yet)
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

  // 2️⃣ 🔥 ADD THIS CHECK (IMPORTANT): find out the id of the non deleted standard coil that has a valve body id reference 

  //we go to coil_standard table, and see if the coil has a matching v.b.(ie v.b. and coil share the same model number) and also check if the coil is not deleted (ie deleted_at is null)
const [existing] = await db.query(
  `
  SELECT id 
  FROM coil_standard
  WHERE coil_model = ?
    AND deleted_at IS NULL
  LIMIT 1
  `,
  [product.model_number]
);

if (existing.length > 0) {
  throw new Error("Active coil already exists for this valve body");
}

  // 2️⃣ Insert standard coil linked to valve body
  const [result] = await db.query(
    `
    INSERT INTO coil_standard 
      ( coil_model, voltage, manufacturer)
    VALUES (?, ?, ?)
    `,
    [
      product.model_number,
      data.voltage,
      data.manufacturer,
    ]
  );

  return { id: result.insertId };
}*/
export async function createStandardCoil(data) {
  const db = getDB();

  const [rows] = await db.query(
    `
    SELECT id, model_number_active 
    FROM valve_body 
    WHERE model_number_active = ? 
      AND deleted_at IS NULL
    `,
    [data.model_number]
  );

  const product = rows[0];

  if (!product) {
    throw new Error("Valve body not found");
  }

  const [existing] = await db.query(
    `
    SELECT id 
    FROM coil_standard
    WHERE unique_key_active = ?
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [product.model_number_active]
  );

  if (existing.length > 0) {
    throw new Error("Active coil already exists for this valve body");
  }

  const [result] = await db.query(
    `
    INSERT INTO coil_standard 
      (coil_model, voltage, manufacturer)
    VALUES (?, ?, ?)
    `,
    [
      product.model_number_active,
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
  //const conn = await db.getConnection();

  try {
    // -------------------------------
    // 1️⃣ FETCH ACTIVE STANDARD COILS
    // FIXED: added deleted_at filter (BUG FIX #1)
    // -------------------------------
    const [coils] = await db.query(`
  SELECT 
    cs.id,
    cs.unique_key_active,
    cs.voltage,
    cs.manufacturer,
    vb.model_number_active AS valve_model
  FROM coil_standard cs
  LEFT JOIN valve_body vb
    ON cs.unique_key_active = vb.model_number_active
  WHERE cs.deleted_at IS NULL
  ORDER BY cs.id DESC
`);

    // -------------------------------
    // 2️⃣ FETCH INVENTORY MOVEMENTS
    // -------------------------------
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
      //VERY IMPORTANT TO FILTER OUT DELETED EVENTS with "WHERE e.deleted_at IS NULL  "
      // OTHERWISE THE STOCK CALCULATION WILL BE WRONG, AS DELETED EVENTS SHOULD NOT AFFECT STOCK

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
    //conn.release();
  }
}


// ======================================================
// 🔵 GET: INDEPENDENT COILS + STOCK (FIXED)
// ======================================================
export async function getIndependentCoilsWithStock() {
  const db = getDB();
  //const conn = await db.getConnection();

  try {
    // -------------------------------
    // 1️⃣ FETCH ACTIVE INDEPENDENT COILS
    // FIXED: corrected alias + ensured soft delete filter
    // -------------------------------
    const [coils] = await db.query(`
      SELECT 
        id,
        unique_key_active,
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
    //VERY IMPORTANT TO FILTER OUT DELETED EVENTS with "WHERE e.deleted_at IS NULL  " 
    // OTHERWISE THE STOCK CALCULATION WILL BE WRONG, AS DELETED EVENTS SHOULD NOT AFFECT STOCK


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
    //conn.release();
  }
}


// ======================================================
// 🔴 SOFT DELETE: STANDARD COIL
// ======================================================
export async function deleteCoilStandard(id) {
  const db = getDB();
  //const conn = await db.getConnection();

  try {
    await db.query(
      `
      UPDATE coil_standard 
      SET deleted_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    return { success: true };
  } finally {
   // conn.release();
  }
}


// ======================================================
// 🔴 SOFT DELETE: INDEPENDENT COIL
// ======================================================
export async function deleteCoilIndependent(id) {
  const db = getDB();
  //const conn = await db.getConnection();

  try {
    await db.query(
      `
      UPDATE coil_independent 
      SET deleted_at = NOW()
      WHERE id = ?
      `,
      [id]
    );

    return { success: true };
  } finally {
    //conn.release();
  }
}