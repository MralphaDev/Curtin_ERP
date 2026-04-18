import { validateInventoryEvent } from "@/lib/domain/inventoryValidator";
import { calculateInventory } from "@/lib/domain/inventoryCalculator";
import { INVENTORY_MODES } from "@/lib/constants/inventoryModes";
import { getDB } from "@/lib/db/mysql";


export async function createEvent(event) {
  
  validateInventoryEvent(event);

  const db = getDB();
  const conn = await db.getConnection();
  const warnings = [];

  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO inventory_event (action, mode, company, remark) VALUES (?, ?, ?, ?)",
      [event.action, event.mode, event.company, event.remark]
    );

    const eventId = result.insertId;

    for (const item of event.items) {

      // validate existence based on type
      let table = "";

      if (item.item_type === "valve_body") table = "valve_body";
      if (item.item_type === "coil_standard") table = "coil_standard";
      if (item.item_type === "coil_independent") table = "coil_independent";

      const [rows] = await conn.query(
        `SELECT id FROM ${table} WHERE id = ?`,
        [item.item_id]
      );

      if (!rows[0]) {
        throw new Error(`${item.item_type} not found: ${item.item_id}`);
      }

      // insert item
      await conn.query(
        `INSERT INTO inventory_event_item 
        (event_id, item_type, item_id, quantity)
        VALUES (?, ?, ?, ?)`,
        [eventId, item.item_type, item.item_id, item.quantity]
      );

      // 🔥 AUTO ADD coil_standard ONLY
      if (
        event.mode === INVENTORY_MODES.VALVE_PLUS_STANDARD &&
        item.item_type === "valve_body"
      ) {
        const [coilRows] = await conn.query(
          `SELECT id FROM coil_standard WHERE valve_body_id = ?`,
          [item.item_id]
        );

        const coil = coilRows[0];

        if (!coil) {
          throw new Error(
            `VALVE_PLUS_STANDARD invalid: missing coil for valve_body_id=${item.item_id}`
          );
        }

        await conn.query(
          `INSERT INTO inventory_event_item 
          (event_id, item_type, item_id, quantity)
          VALUES (?, ?, ?, ?)`,
          [
            eventId,
            "coil_standard",
            coil.id,
            item.quantity
          ]
        );
      }
    }

    await conn.commit();

    return { 
      success: true, 
      eventId,
      warnings
    };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}


export async function getInventoryStock() {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    const [events] = await conn.query(`SELECT * FROM inventory_event`);

    const [items] = await conn.query(`
      SELECT 
        i.*,
        e.action
      FROM inventory_event_item i
      JOIN inventory_event e ON e.id = i.event_id
    `);

    const grouped = events.map((event) => ({
      ...event,
      items: items.filter((i) => i.event_id === event.id),
    }));

    return calculateInventory(grouped);
  } finally {
    conn.release();
  }
}

export async function getInventoryEvents() {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    const [events] = await conn.query(`
      SELECT * FROM inventory_event
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
    `);

    const [items] = await conn.query(`
      SELECT * FROM inventory_event_item
    `);

    return events.map(event => ({
      ...event,
      items: items.filter(i => i.event_id === event.id),
    }));

  } finally {
    conn.release();
  }
}

export async function deleteInventoryEvent(eventId) {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // soft delete event
    await conn.query(
      `UPDATE inventory_event 
       SET deleted_at = NOW()
       WHERE id = ?`,
      [eventId]
    );

    await conn.commit();

    return { success: true };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}