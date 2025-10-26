/* eslint-disable @typescript-eslint/no-explicit-any */
import { Repository, EntityTarget, ObjectLiteral } from "typeorm";
import { getDataSource } from "@/lib/db/config";

export abstract class BaseService<T extends ObjectLiteral> {
  protected repository: Repository<T> | null = null;
  protected entity: EntityTarget<T>;

  constructor(entity: EntityTarget<T>) {
    this.entity = entity;
  }

  protected async initRepository(): Promise<void> {
    if (!this.repository) {
      const dataSource = await getDataSource();
      this.repository = dataSource.getRepository(this.entity);
    }
  }

  async findOne(where: Partial<T>): Promise<T | null> {
    await this.initRepository();
    return this.repository!.findOne({ where });
  }

  async findMany(where?: Partial<T>): Promise<T[]> {
    await this.initRepository();
    return this.repository!.find(where ? { where } : {});
  }

  async create(data: Partial<T>): Promise<T> {
    await this.initRepository();
    const entity = this.repository!.create(data as any);
    const saved = await this.repository!.save(entity);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    await this.initRepository();
    await this.repository!.update(id, data as any);
    return this.findOne({ id: id } as unknown as Partial<T>);
  }

  async delete(id: number): Promise<boolean> {
    await this.initRepository();
    const result = await this.repository!.delete(id);
    return result.affected !== 0;
  }
}

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
    } catch (error: unknown) {
      console.error("❌ Error waiting for database:", error);
      console.log(
        `⏳ Attempt ${i + 1}/${maxRetries} - Database not ready yet...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("❌ Database connection timeout - max retries exceeded");
}
