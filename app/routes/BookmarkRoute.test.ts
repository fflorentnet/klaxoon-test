import { FastifyInstance } from 'fastify';
import buildApp from '../app';
import {
  BookmarksMock,
  PhotoBookmarkMock,
  PhotoInformationMock,
  VideoBookmarkMock,
} from '../tests/mock/BookmarkMockData';
import { TestHelper } from '../tests/TestHelper';
import { LinkAdapterRegistry } from '../adapters/LinkAdapterRegistry';

let fastify: FastifyInstance;
beforeAll(async () => {
  await TestHelper.getInstance().setupTestDB();
  fastify = await buildApp();
  jest.clearAllMocks();
});

afterAll(() => {
  TestHelper.getInstance().teardownTestDB();
});

describe('GET /', () => {
  it('should return 200 with no bookmark', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/v1/bookmark',
    });
    expect(response.statusCode).toEqual(200);
    const payload = response.json();
    expect(payload).toStrictEqual([]);
  });

  it('should return 200 with existing bookmarks', async () => {
    await fastify.db.bookmarks.insert(BookmarksMock);

    const response = await fastify.inject({
      method: 'GET',
      url: '/api/v1/bookmark',
    });
    expect(response.statusCode).toEqual(200);
    const payload = response.json();
    expect(payload).toHaveLength(2);
  });
});

describe('GET /:id', () => {
  it('should return 200 with an existing bookmark', async () => {
    const { id } = await fastify.db.bookmarks.save(
      PhotoBookmarkMock({ id: 50 }),
    );
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/v1/bookmark/' + id,
    });
    expect(response.statusCode).toEqual(200);
    const payload = response.json();
    expect(payload).not.toBeNull();
  });

  it('should return 404 if the bookmark does not exist', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/api/v1/bookmark/404',
    });
    expect(response.statusCode).toEqual(404);
  });
});

describe('POST /', () => {
  it('should return 400 when the link is malformed', async () => {
    const response = await fastify
      .inject()
      .body({
        link: '',
      })
      .post('/api/v1/bookmark');
    expect(response.statusCode).toEqual(400);
  });

  it('should return the bookmark when link has been analyzed', async () => {
    const findPageInformationMock = jest
      .spyOn(LinkAdapterRegistry.prototype, 'findPageInformation')
      .mockImplementation(() => {
        return Promise.resolve(PhotoInformationMock());
      });

    const link = 'https://www.flickr.com/photos/feuilllu/45771361701/';

    const response = await fastify
      .inject()
      .body({
        link,
      })
      .post('/api/v1/bookmark');
    expect(response.statusCode).toEqual(200);
    const deserializedPayload = response.json();
    expect(deserializedPayload.link).toStrictEqual(link);
    expect(deserializedPayload.id).not.toBeNull();
    expect(deserializedPayload.createdAt).not.toBeNull();
    expect(deserializedPayload.updatedAt).not.toBeNull();
    expect(findPageInformationMock).toHaveBeenCalledWith(link);
  });
});

describe('DELETE /:id', () => {
  it('should return 404 when the bookmark does not exist', async () => {
    const response = await fastify.inject().delete('/api/v1/bookmark/404');
    expect(response.statusCode).toStrictEqual(404);
  });

  it('should return 204 when a bookmark has been deleted', async () => {
    const { id } = await fastify.db.bookmarks.save(
      PhotoBookmarkMock({ id: 100 }),
    );

    const response = await fastify.inject().delete('/api/v1/bookmark/' + id);
    expect(response.statusCode).toEqual(204);
  });
});

describe('PUT /:id', () => {
  it('should return 400 when the link is malformed', async () => {
    const { id } = await fastify.db.bookmarks.save(
      PhotoBookmarkMock({ id: 200 }),
    );
    const response = await fastify
      .inject()
      .body({
        link: '',
      })
      .put(`/api/v1/bookmark/${id}`);
    expect(response.statusCode).toEqual(400);
  });

  it('should return the bookmark when link has been updated', async () => {
    const { id } = await fastify.db.bookmarks.save(
      VideoBookmarkMock({ id: 250 }),
    );
    const findPageInformationMock = jest
      .spyOn(LinkAdapterRegistry.prototype, 'findPageInformation')
      .mockImplementation(() => {
        return Promise.resolve(PhotoInformationMock());
      });

    const link = 'https://www.flickr.com/photos/feuilllu/45771361701/';

    const response = await fastify
      .inject()
      .body({
        link,
      })
      .put(`/api/v1/bookmark/${id}`);
    expect(response.statusCode).toEqual(200);
    const deserializedPayload = response.json();
    expect(deserializedPayload.link).toStrictEqual(link);
    expect(deserializedPayload.id).toStrictEqual(id);
    expect(deserializedPayload.createdAt).not.toBeNull();
    expect(deserializedPayload.updatedAt).not.toBeNull();
    expect(findPageInformationMock).toHaveBeenCalledWith(link);
  });
});
