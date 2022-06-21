import fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import BookmarkController from './routes/BookmarkRoute';
import { oEmbedFetchPlugin } from './adapters/LinkAdapterRegistry';
import { oEmbedFlickrFetchPlugin } from './adapters/FlickrAdapter';
import { oEmbedVimeoFetchPlugin } from './adapters/VimeoAdapter';
import { DbPlugin } from './repositories/db';
import { options } from './config';

const buildApp = (opts = {}) => {
  const instance = fastify({
    ignoreTrailingSlash: true,
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    },
    ...opts,
  });
  instance.register(fastifyEnv, options);
  instance.register(oEmbedFetchPlugin);
  instance.register(oEmbedFlickrFetchPlugin);
  instance.register(oEmbedVimeoFetchPlugin);

  instance.register(DbPlugin);

  instance.register(BookmarkController, {
    prefix: '/api/v1/bookmark',
  });
  return instance;
};

export default buildApp;
export { buildApp };
