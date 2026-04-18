import { NextResponse } from "next/server";
import {
  createValveBody,
  getValvesWithStock,
} from "@/lib/services/productService";
import { deleteProduct } from "@/lib/services/productService";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await createValveBody(body);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const data = await getValvesWithStock();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}



export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const result = await deleteProduct(Number(id));

    return NextResponse.json(result);

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}