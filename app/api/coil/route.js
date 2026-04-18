// /app/api/coil/route.js
import { NextResponse } from "next/server";
import {
  createStandardCoil,
  createIndependentCoil,
  getStandardCoilsWithStock,
  getIndependentCoilsWithStock 
} from "@/lib/services/coilService";

import {
  deleteCoilStandard,
  deleteCoilIndependent
} from "@/lib/services/coilService";

import { ITEM_TYPES } from "@/lib/constants/itemTypes";

// ✅ handler 映射（关键）
const handlers = {
  [ITEM_TYPES.COIL_STANDARD]: createStandardCoil,
  [ITEM_TYPES.COIL_INDEPENDENT]: createIndependentCoil,
};




export async function POST(req) {
  try {
    const body = await req.json();

    console.log("incoming body:", body); // ✅ 调试神器

    const { type, data } = body;

    // ✅ 校验
    if (!type || !data) {
      return NextResponse.json(
        { success: false, message: "Missing type or data" },
        { status: 400 }
      );
    }

    const handler = handlers[type];

    if (!handler) {
      return NextResponse.json(
        { success: false, message: "Invalid coil type" },
        { status: 400 }
      );
    }

    const result = await handler(data);

    return NextResponse.json({
      success: true,
      type,
      data: result,
    });

  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}

/**
 * 🔵 NEW: GET ALL COILS
 * - combine standard + independent
 * - frontend only calls ONE endpoint
 */
export async function GET() {
  try {
    const standard = await getStandardCoilsWithStock();
    const independent = await getIndependentCoilsWithStock();

    return NextResponse.json({
      standard,
      independent,
    });

  } catch (err) {
    console.error("GET /api/coil error:", err);

    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}


export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const type = searchParams.get("type"); 
    // "standard" | "independent"

    if (!id || !type) {
      return NextResponse.json(
        { error: "Missing id or type" },
        { status: 400 }
      );
    }

    if (type === ITEM_TYPES.COIL_STANDARD) {
      return NextResponse.json(await deleteCoilStandard(Number(id)));
    }

    if (type === ITEM_TYPES.COIL_INDEPENDENT) {
      return NextResponse.json(await deleteCoilIndependent(Number(id)));
    }

    return NextResponse.json(
      { error: "Invalid type" },
      { status: 400 }
    );

  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}