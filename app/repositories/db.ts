import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { Bookmark } from '../entities/Bookmark';
import { DbConfigHelper } from './DbConfigHelper';

const setupDb: FastifyPluginCallback = async (instance, __options, done) => {
  const connection = await DbConfigHelper.getInstance()
    .generateDatasource(instance.config, {
      entities: [Bookmark],
      synchronize: true,
    })
    .initialize();

  instance.decorate('db', {
    bookmarks: connection.getRepository(Bookmark),
  });
  done();
};

export const DbPlugin = fp(setupDb);
