import { INVENTORY_MODES } from "@/lib/constants/inventoryModes";
import { validateInventoryEvent } from "@/lib/domain/inventoryValidator";
import { calculateInventory } from "@/lib/domain/inventoryCalculator";
import { getDB } from "@/lib/db/mysql";

/**
 * =========================
 * CREATE INVENTORY EVENT
 * =========================
 */

export async function createEvent(event) {
  validateInventoryEvent(event);

  const db = getDB();
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    console.log("📥 [CREATE EVENT] payload:", event);

    // =========================
    // 🧠 STEP 1: BUILD FINAL ITEMS (IMPORTANT)
    // =========================
    const finalItems = [];

    for (const item of event.items) {
      finalItems.push(item);

      // 🔗 auto coil logic (INCLUDE IN VALIDATION)
      if (
        event.mode === INVENTORY_MODES.VALVE_PLUS_STANDARD &&
        item.item_type === "valve_body"
      ) {
        // 1️⃣ get active valve body key
        const [vbRows] = await conn.query(
          `
          SELECT model_number_active
          FROM valve_body
          WHERE id = ?
            AND deleted_at IS NULL
          `,
          [item.item_id]
        );

        if (!vbRows.length) {
          throw new Error(`Valve body not found: ${item.item_id}`);
        }

        const key = vbRows[0].model_number_active;

        // 2️⃣ find coil by unique key (NEW LOGIC)
        const [coilRows] = await conn.query(
          `
          SELECT id
          FROM coil_standard
          WHERE unique_key_active = ?
            AND deleted_at IS NULL
          LIMIT 1
          `,
          [key]
        );

  if (!coilRows.length) {
    throw new Error(
      `Missing coil_standard for valve_body key=${key}`
    );
  }

  finalItems.push({
    item_type: "coil_standard",
    item_id: coilRows[0].id,
    quantity: item.quantity,
  });
}
    }

    console.log("📦 finalItems:", finalItems);

    // =========================
    // 🚨 STEP 2: STOCK VALIDATION 
    // =========================
    if (event.action === "OUT") {
      const currentStock = await getInventoryStock();

      // 🔥 aggregate required quantities (avoid double check bug)
      const requiredMap = new Map();

      for (const item of finalItems) {
        const key = `${item.item_type}_${item.item_id}`;

        if (!requiredMap.has(key)) {
          requiredMap.set(key, 0);
        }

        requiredMap.set(key, requiredMap.get(key) + item.quantity);
      }

      for (const [key, requiredQty] of requiredMap.entries()) {
        const stockItem = currentStock.find(
          s => `${s.item_type}_${s.item_id}` === key
        );

        const available = stockItem?.stock || 0;

        if (available < requiredQty) {
          throw new Error(
            `❌ Not enough stock for ${key}. Available: ${available}, requested: ${requiredQty}`
          );
        }
      }
    }

    // =========================
    // 📝 STEP 3: INSERT EVENT
    // =========================
    const [result] = await conn.query(
      `INSERT INTO inventory_event (action, mode, company, remark)
       VALUES (?, ?, ?, ?)`,
      [event.action, event.mode, event.company, event.remark]
    );

    const eventId = result.insertId;
    console.log("🆔 eventId:", eventId);

    // =========================
    // 🧩 STEP 4: INSERT ITEMS (use finalItems)
    // =========================
    for (const item of finalItems) {
      let table = null;

      if (item.item_type === "valve_body") table = "valve_body";
      if (item.item_type === "coil_standard") table = "coil_standard";
      if (item.item_type === "coil_independent") table = "coil_independent";

      if (!table) throw new Error("Invalid item_type: " + item.item_type);

      const [rows] = await conn.query(
        `SELECT id FROM ${table} WHERE id = ?`,
        [item.item_id]
      );

      if (!rows.length) {
        throw new Error(`${item.item_type} not found: ${item.item_id}`);
      }

      await conn.query(
        `INSERT INTO inventory_event_item
         (event_id, item_type, item_id, quantity)
         VALUES (?, ?, ?, ?)`,
        [eventId, item.item_type, item.item_id, item.quantity]
      );
    }

    await conn.commit();

    return { success: true, eventId };

  } catch (err) {
    await conn.rollback();
    console.error("❌ CREATE EVENT ERROR:", err);
    throw err;

  } finally {
    conn.release();
  }
}

/*
export async function createEvent(event) {
  validateInventoryEvent(event);

  const db = getDB();
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

  
    console.log("📥 [CREATE EVENT] payload:", event);

    // 🔥 BEFORE inserting anything
    if (event.action === "OUT") {
      const currentStock = await getInventoryStock(); // reuse your existing logic

      for (const item of event.items) {
        const key = `${item.item_type}_${item.item_id}`;

        const stockItem = currentStock.find(
          s => `${s.item_type}_${s.item_id}` === key
        );

        const available = stockItem?.stock || 0;

        if (available < item.quantity) {
          throw new Error(
            `Not enough stock for ${key}. Available: ${available}, requested: ${item.quantity}`
          );
        }
      }
    }

    // 1. insert event header
    const [result] = await conn.query(
      `INSERT INTO inventory_event (action, mode, company, remark)
       VALUES (?, ?, ?, ?)`,
      [event.action, event.mode, event.company, event.remark]
    );

    const eventId = result.insertId;
    console.log("🆔 [CREATE EVENT] eventId:", eventId);

    // 2. insert items
    for (const item of event.items) {
      let table = null;

      if (item.item_type === "valve_body") table = "valve_body";
      if (item.item_type === "coil_standard") table = "coil_standard";
      if (item.item_type === "coil_independent") table = "coil_independent";

      if (!table) throw new Error("Invalid item_type: " + item.item_type);

      const [rows] = await conn.query(
        `SELECT id FROM ${table} WHERE id = ?`,
        [item.item_id]
      );

      if (!rows.length) {
        throw new Error(`${item.item_type} not found: ${item.item_id}`);
      }

      await conn.query(
        `INSERT INTO inventory_event_item
         (event_id, item_type, item_id, quantity)
         VALUES (?, ?, ?, ?)`,
        [eventId, item.item_type, item.item_id, item.quantity]
      );

      console.log("➕ item inserted:", item);

      // auto coil logic
      if (
        event.mode === INVENTORY_MODES.VALVE_PLUS_STANDARD &&
        item.item_type === "valve_body"
      ) {
        const [coilRows] = await conn.query(
          `SELECT id FROM coil_standard WHERE valve_body_id = ?`,
          [item.item_id]
        );

        if (!coilRows.length) {
          throw new Error(
            `Missing coil_standard for valve_body_id=${item.item_id}`
          );
        }

        await conn.query(
          `INSERT INTO inventory_event_item
           (event_id, item_type, item_id, quantity)
           VALUES (?, ?, ?, ?)`,
          [
            eventId,
            "coil_standard",
            coilRows[0].id,
            item.quantity,
          ]
        );

        console.log("🔗 auto coil inserted");
      }
    }

    await conn.commit();

    return { success: true, eventId };

  } catch (err) {
    await conn.rollback();
    console.error("❌ CREATE EVENT ERROR:", err);
    throw err;

  } finally {
    conn.release();
  }
}*/

/**
 * =========================
 * GET INVENTORY STOCK (FIXED CORE BUG HERE)
 * =========================
 */
export async function getInventoryStock() {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    console.log("🔄 [STOCK] recalculating...");

    // 1. only active events
    const [events] = await conn.query(`
      SELECT id, action, mode, company
      FROM inventory_event
      WHERE deleted_at IS NULL
    `);

    console.log("📦 active events:", events.length);

    // 2. only items from active events (STRICT JOIN FIX)
    const [items] = await conn.query(`
      SELECT i.*
      FROM inventory_event_item i
      INNER JOIN inventory_event e
        ON e.id = i.event_id
      WHERE e.deleted_at IS NULL
    `);

    console.log("📦 active items:", items.length);

    // 3. rebuild event structure safely (IMPORTANT FIX)
    const eventMap = new Map();

    for (const e of events) {
      eventMap.set(e.id, { ...e, items: [] });
    }

    for (const item of items) {
      const event = eventMap.get(item.event_id);
      if (event) {
        event.items.push(item);
      }
    }

    const grouped = Array.from(eventMap.values());

    console.log("📊 grouped events:", grouped.length);

    // 4. FINAL CALCULATION
    const stock = calculateInventory(grouped);

    //console.log("✅ STOCK RESULT:", stock);

    return stock;

  } catch (err) {
    //console.error("❌ STOCK ERROR:", err);
    throw err;

  } finally {
    conn.release();
  }
}

/**
 * =========================
 * GET EVENTS (HISTORY)
 * =========================
 */
export async function getInventoryEvents() {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    const [events] = await conn.query(`
      SELECT *
      FROM inventory_event
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `);

    const [items] = await conn.query(`
      SELECT *
      FROM inventory_event_item
    `);

    return events.map(e => ({
      ...e,
      items: items.filter(i => i.event_id === e.id),
    }));

  } finally {
    conn.release();
  }
}

/**
 * =========================
 * DELETE EVENT (SOFT DELETE ONLY)
 * =========================
 */
export async function deleteInventoryEvent(eventId) {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    console.log("🗑️ deleting event:", eventId);

    const [result] = await conn.query(
      `UPDATE inventory_event
       SET deleted_at = NOW()
       WHERE id = ?`,
      [eventId]
    );

    console.log("✅ deleted rows:", result.affectedRows);

    await conn.commit();



    return { success: true };

  } catch (err) {
    await conn.rollback();
    console.error("❌ DELETE ERROR:", err);
    throw err;

  } finally {
    conn.release();
  }
}