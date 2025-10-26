import { NextResponse } from "next/server";
import { getDataSource } from "@/lib/db/config";

export async function GET() {
  try {
    const dataSource = await getDataSource();

    // Test database connection
    await dataSource.query("SELECT 1");

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
