import Database from 'better-sqlite3';
import { BetterSqlite3ConnectionOptions } from 'typeorm/driver/better-sqlite3/BetterSqlite3ConnectionOptions';
import { DbConfigHelper } from '../repositories/DbConfigHelper';

export class TestHelper {
  private static _instance: TestHelper;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() { }

  public static getInstance(): TestHelper {
    if (!this._instance) this._instance = new TestHelper();

    return this._instance;
  }

  private testdb!: any;

  async setupTestDB() {
    const dbName = ':memory:';
    this.testdb = new Database(dbName, { verbose: console.log });
    jest
      .spyOn(DbConfigHelper.prototype, 'getDatabaseConnectionOptions')
      .mockImplementation(() => {
        return {
          type: 'better-sqlite3',
          database: dbName,
          synchronize: true,
        } as BetterSqlite3ConnectionOptions;
      });
  }

  teardownTestDB() {
    this.testdb.close();
  }
}
