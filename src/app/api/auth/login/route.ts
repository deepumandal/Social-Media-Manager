import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/authService";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Try to login with provided credentials
    let loginResult = await authService.login({ email, password });

    // If no user found, create admin user if credentials match env vars
    if (!loginResult) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (email === adminEmail && password === adminPassword) {
        const adminUser = await authService.createUser({
          email,
          password,
          name: "Admin",
        });
        const token = authService.generateToken(adminUser);
        loginResult = { user: adminUser, token };
      }
    }

    if (!loginResult) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const response = NextResponse.json(
      {
        user: {
          id: loginResult.user.id,
          email: loginResult.user.email,
          name: loginResult.user.name,
        },
        message: "Login successful",
      },
      { status: 200 },
    );

    // Set HTTP-only cookie for session
    response.cookies.set("auth-token", loginResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
