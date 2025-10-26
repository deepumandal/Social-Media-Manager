import { spawn } from "child_process";
import { createConnection } from "mysql2/promise";

async function runMigrations() {
  const connection = await createConnection({
    host: process.env.DB_HOST,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  try {
    console.log("🔄 Running database migrations...");

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`name\` varchar(255) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)
      ) ENGINE=InnoDB
    `);

    // Create posts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`posts\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`content\` text NOT NULL,
        \`postId\` text NOT NULL,
        \`platform\` enum('linkedin', 'twitter', 'facebook', 'instagram') NOT NULL,
        \`scheduledAt\` datetime NOT NULL,
        \`status\` enum('draft', 'scheduled', 'published', 'failed') NOT NULL DEFAULT 'draft',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function startup() {
  try {
    console.log("🚀 Starting application...");

    // Wait for database to be ready
    console.log("🔄 Waiting for database to be ready...");
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Simple wait

    // Run migrations
    await runMigrations();

    console.log("🎉 Database migration completed successfully");
    console.log("🚀 Starting Next.js server...");

    // Start the server.js process
    const serverProcess = spawn("node", ["server.js"], {
      stdio: "inherit",
      cwd: process.cwd(),
    });

    // Handle server process events
    serverProcess.on("error", (error) => {
      console.error("💥 Server process error:", error);
      process.exit(1);
    });

    serverProcess.on("exit", (code) => {
      console.log(`🔄 Server process exited with code ${code}`);
      process.exit(code);
    });
  } catch (error) {
    console.error("💥 Application startup failed:", error);
    process.exit(1);
  }
}

startup();
