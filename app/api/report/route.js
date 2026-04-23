import { NextResponse } from "next/server";
import { getValveBodyReport } from "@/lib/reports/buildManufacturerReport";
import { buildManufacturerReport } from "@/lib/reports/buildManufacturerReport";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "month";

    const rows = await getValveBodyReport(range);
    const report = buildManufacturerReport(rows);

    return NextResponse.json(report);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "failed" },
      { status: 500 }
    );
  }
}