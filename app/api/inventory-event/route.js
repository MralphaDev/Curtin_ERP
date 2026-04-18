import { NextResponse } from "next/server";
import { createEvent, getInventoryStock, getInventoryEvents ,deleteInventoryEvent} 
from "@/lib/services/inventoryService";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await createEvent(body);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  const result = await getInventoryEvents();
  return NextResponse.json(result);
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    const result = await deleteInventoryEvent(Number(id));

    return NextResponse.json(result);

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}