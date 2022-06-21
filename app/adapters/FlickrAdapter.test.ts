import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { PhotoInformationMock } from '../tests/mock/BookmarkMockData';
import FlickrResponse from '../tests/mock/FlickrResponse.json';
import FlickrAdapter from './FlickrAdapter';

describe('FlickrAdapter', () => {
  let mock: MockAdapter;
  const adapter = new FlickrAdapter();
  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should correctly reach flickr.com/services/oembed', async () => {
    const url = 'https://www.flickr.com/photos/feuilllu/45771361701/';
    const generatedPath = `http://www.flickr.com/services/oembed/?url=https%3A//www.flickr.com/photos/feuilllu/45771361701/`;
    mock.onGet(generatedPath).reply(200, FlickrResponse);

    const photoInfo = await adapter.generatePromiseForUrl(url);
    expect(mock.history.get[0].url).toStrictEqual(generatedPath);
    expect(photoInfo).toStrictEqual(PhotoInformationMock());
  });
});
