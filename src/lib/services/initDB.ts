// lib/services/base.service.ts
import {
  Repository,
  EntityTarget,
  EntitySchema,
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
} from "typeorm";
import { getDataSource } from "@/lib/db/config";

export class BaseService<T extends ObjectLiteral> {
  protected repository!: Repository<T>;

  constructor(private entity: EntityTarget<T>) {}

  // Lazy initialization of repository
  protected async initRepository() {
    if (!this.repository) {
      const dataSource = await getDataSource();
      this.repository = dataSource.getRepository(
        this.entity as EntitySchema<T>,
      );
    }
  }

  // Generic CRUD helpers
  public async findAll(): Promise<T[]> {
    await this.initRepository();
    return this.repository.find();
  }

  public async findOne(where: Partial<T>): Promise<T | null> {
    await this.initRepository();
    return this.repository.findOne({ where: where as FindOptionsWhere<T> });
  }

  public async create(data: Partial<T>): Promise<T> {
    await this.initRepository();
    const entity = this.repository.create(data as DeepPartial<T>);
    return this.repository.save(entity);
  }

  public async save(entity: T): Promise<T> {
    await this.initRepository();
    return this.repository.save(entity);
  }

  public async delete(entity: T): Promise<T> {
    await this.initRepository();
    return this.repository.remove(entity);
  }
}
