import { getDataSource } from "@/lib/db/config";

export async function initializeDatabase() {
  try {
    console.log("🔄 Starting database initialization...");
    
    const dataSource = await getDataSource();
    
    // Run migrations to create/update tables
    await dataSource.runMigrations();
    
    console.log("✅ Database initialization completed successfully");
    return true;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

export async function waitForDatabase(maxRetries = 30, delay = 2000) {
  console.log("🔄 Waiting for database to be ready...");
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const dataSource = await getDataSource();
      if (dataSource.isInitialized) {
        console.log("✅ Database connection established");
        return true;
      }
    } catch (error) {
      console.log(`⏳ Attempt ${i + 1}/${maxRetries} - Database not ready yet...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error("❌ Database connection timeout - max retries exceeded");
}