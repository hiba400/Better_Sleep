import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")

    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Decode token to get user data (in production, verify with actual token)
    const token = auth.replace("Bearer ", "")
    const userData = JSON.parse(Buffer.from(token, "base64").toString())

    return NextResponse.json({
      id: userData.id,
      email: userData.email,
      username: userData.username,
      role: userData.role,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")

    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // In production, update database
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
