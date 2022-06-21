import { MySQLConnection } from '@fastify/mysql';
import { Repository } from 'typeorm';
import { Bookmark } from '../entities/Bookmark';

declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLConnection;
    db: {
      bookmarks: Repository<Bookmark>;
    };
  }
}
