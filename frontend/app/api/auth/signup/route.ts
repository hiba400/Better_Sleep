import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json()

    // Validate input
    if (!email || !password || !username) {
      return NextResponse.json({ error: "Email, password, and username are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // For now, return a mock response
    // In production, this would create a new user in your database
    const mockUser = {
      id: "user-" + Date.now(),
      email,
      username,
      role: "student",
    }

    const token = Buffer.from(JSON.stringify(mockUser)).toString("base64")

    return NextResponse.json({
      token,
      userId: mockUser.id,
      user: mockUser,
    })
  } catch (error) {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 })
  }
}
