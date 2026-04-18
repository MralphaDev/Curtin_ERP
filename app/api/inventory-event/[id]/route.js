import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/mysql";


export async function GET(req, { params }) {
  const db = getDB();
  const conn = await db.getConnection();

  try {
    const { id } = await params;

    const [events] = await conn.query(
      "SELECT * FROM inventory_event WHERE id = ?",
      [id]
    );

    const [items] = await conn.query(
      "SELECT * FROM inventory_event_item WHERE event_id = ?",
      [id]
    );

    return NextResponse.json({
      event: events[0],
      items
    });

  } finally {
    conn.release();
  }
}

