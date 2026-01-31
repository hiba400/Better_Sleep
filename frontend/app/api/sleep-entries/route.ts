import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")

    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    if (!body.date || !body.heureCoucher || !body.heureReveil) {
      return NextResponse.json({ error: "Date, bedtime, and wake time are required" }, { status: 400 })
    }

    // In production, save to database
    const sleepEntry = {
      id: "entry-" + Date.now(),
      ...body,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Sleep entry logged successfully",
      data: sleepEntry,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to log sleep entry" }, { status: 500 })
  }
}
