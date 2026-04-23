import { chatCore } from "@/lib/chatbi/core";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("CHATBI REQUEST:", body);

    const result = await chatCore(body);

    return Response.json(result);
  } catch (err) {
    console.error(err);

    return Response.json(
      { answer: "Server error occurred." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(
    { message: "Use POST" },
    { status: 405 }
  );
}