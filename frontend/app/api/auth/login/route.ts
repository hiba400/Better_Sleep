import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // For now, return a mock response
    // In production, this would query your database and verify credentials
    const mockUser = {
      id: "user-123",
      email,
      username: email.split("@")[0],
      role: "student",
    }

    const token = Buffer.from(JSON.stringify(mockUser)).toString("base64")

    return NextResponse.json({
      token,
      userId: mockUser.id,
      user: mockUser,
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
