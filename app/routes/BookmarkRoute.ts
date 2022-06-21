import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from 'fastify';
import fp from 'fastify-plugin';
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { bookmarkCreationSchema } from '../schemas/BookmarkCreation';
import { Bookmark } from '../entities/Bookmark';

const BookmarkRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) => {
  fastify.get(`${opts.prefix}`, async (): Promise<Bookmark[]> => {
    return fastify.db.bookmarks.find();
  });

  fastify.get(
    `${opts.prefix}/:id`,
    async (request, reply): Promise<Bookmark> => {
      const { id } = request.params as any;

      return fastify.db.bookmarks
        .findOneBy({
          id,
        })
        .then((bookmark) =>
          bookmark ? reply.code(200).send(bookmark) : reply.code(404).send(),
        )
        .catch((err) => {
          fastify.log.error(err);
          return reply.code(500).send();
        });
    },
  );

  fastify.delete(
    `${opts.prefix}/:id`,
    async (request, reply): Promise<void> => {
      const { id } = request.params as any;

      return fastify.db.bookmarks
        .delete({
          id,
        })
        .then(({ affected }) =>
          affected ? reply.code(204).send() : reply.code(404).send(),
        )
        .catch((err) => {
          fastify.log.error(err);
          return reply.code(500).send();
        });
    },
  );

  fastify.withTypeProvider<JsonSchemaToTsProvider>().post(
    `${opts.prefix}`,
    {
      schema: {
        body: bookmarkCreationSchema,
      },
    },
    async ({ body: bookmark }, reply) => {
      fastify.log.debug(`Fetched information for ${bookmark.link}`);

      const baseInformation = await fastify.fetchBaseInformation(bookmark.link);
      const savedBookmark = await fastify.db.bookmarks.save(
        new Bookmark({
          link: bookmark.link,
          information: baseInformation,
        }),
      );
      reply.code(200).send(savedBookmark);
    },
  );

  fastify.withTypeProvider<JsonSchemaToTsProvider>().put(
    `${opts.prefix}/:id`,
    {
      schema: {
        body: bookmarkCreationSchema,
      },
    },
    async ({ body: bookmark, params }, reply) => {
      fastify.log.debug(`Fetched information for ${bookmark.link}`);
      const { id } = params;
      const baseInformation = await fastify.fetchBaseInformation(bookmark.link);
      const existingBookmark = await fastify.db.bookmarks.findOneBy({
        id,
      });
      const savedBookmark = await fastify.db.bookmarks.save(
        new Bookmark({
          ...existingBookmark,
          link: bookmark.link,
          information: baseInformation,
        }),
      );
      reply.code(200).send(savedBookmark);
    },
  );
};

export default fp(BookmarkRoute);
