// lib/db/config.ts
import { DataSource } from "typeorm";
import { Post } from "@/lib/entity/Post";
import { User } from "@/lib/entity/User";

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "social_media_manager",
  entities: [User, Post],
  synchronize: true, // Disable synchronize in production, use migrations instead
  logging: true, //process.env.NODE_ENV === "development",
  // migrations: ["src/lib/migrations/*.ts"],
  // migrationsRun: false, // We'll run migrations manually in startup script
});

let initialized = false;

export async function getDataSource() {
  if (!initialized) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ TypeORM initialized");
    }
    initialized = true;
  }
  return AppDataSource;
}
