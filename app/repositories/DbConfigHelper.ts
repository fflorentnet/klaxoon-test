import { DataSource, DataSourceOptions } from 'typeorm';
import { BaseDataSourceOptions } from 'typeorm/data-source/BaseDataSourceOptions';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { DbConfig } from '../config';

export class DbConfigHelper {
  private static instance: DbConfigHelper;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  public static getInstance(): DbConfigHelper {
    if (!this.instance) {
      this.instance = new DbConfigHelper();
    }
    return this.instance;
  }

  public getDatabaseConnectionOptions(config: DbConfig): DataSourceOptions {
    return {
      type: 'mysql',
      host: config.DB_HOST,
      port: config.DB_PORT,
      database: config.DB_NAME,
      username: config.DB_USER,
      password: config.DB_PASS,
      logging: 'all',
    } as MysqlConnectionOptions;
  }

  public generateDatasource(
    config: DbConfig,
    opts: Partial<BaseDataSourceOptions>,
  ) {
    return new DataSource(
      Object.assign(this.getDatabaseConnectionOptions(config), opts),
    );
  }
}
