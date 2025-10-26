#!/usr/bin/env node

import { waitForDatabase, initializeDatabase } from "./lib/services/initDB";

async function startup() {
  try {
    console.log("🚀 Starting application...");

    // Wait for database to be ready
    await waitForDatabase();

    // Initialize database (run migrations)
    await initializeDatabase();

    console.log("🎉 Application startup completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("💥 Application startup failed:", error);
    process.exit(1);
  }
}

startup();
