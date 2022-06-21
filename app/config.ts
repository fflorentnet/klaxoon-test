import { DatabaseType } from 'typeorm';

const schema = {
  type: 'object',
  required: ['PORT', 'DB_TYPE', 'DB_NAME'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
    DB_TYPE: {
      type: 'string',
      default: 'mysql',
    },
    DB_HOST: {
      type: 'string',
    },
    DB_PORT: {
      type: 'number',
    },
    DB_USER: {
      type: 'string',
    },
    DB_PASS: {
      type: 'string',
    },
    DB_NAME: {
      type: 'string',
    },
  },
};

export interface DbConfig {
  DB_TYPE: DatabaseType;
  DB_HOST: string;
  DB_NAME?: string;
  DB_PORT?: number;
  DB_USER?: string;
  DB_PASS?: string;
}

export interface AppConfig {
  PORT: number;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: AppConfig & DbConfig;
  }
}

export const options = {
  dotenv: true,
  schema,
};
