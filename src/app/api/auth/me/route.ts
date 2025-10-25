import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/authService";

const authService = new AuthService();
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 },
      );
    }

    try {
      const decoded = authService.verifyToken(token) as {
        email: string;
        userId: number;
      };

      // Get fresh user data from database
      const user = await authService.findOne({
        email: decoded.email,
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error("Auth check error:", error);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
