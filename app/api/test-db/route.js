import { NextResponse } from "next/server";
import { getDB } from "@/lib/db/mysql";

export async function GET() {
  const db = getDB();

  const [rows] = await db.query("SELECT 1 + 1 AS result");

  return NextResponse.json(rows[0]);
}