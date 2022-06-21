import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { VideoInformationMock } from '../tests/mock/BookmarkMockData';
import VimeoAdapter from './VimeoAdapter';
import VimeoResponse from '../tests/mock/VimeoResponse.json';

describe('VimeoAdapter', () => {
  let mock: MockAdapter;
  const adapter = new VimeoAdapter();
  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  it('should correctly reach vimeo.com/api/oembed', async () => {
    const url = 'https://vimeo.com/565486457';
    const generatedPath = `https://vimeo.com/api/oembed.json?url=${url.replace(
      ':',
      '%3A',
    )}`;
    mock.onGet(generatedPath).reply(200, VimeoResponse);

    const videoInfo = await adapter.generatePromiseForUrl(url);
    expect(mock.history.get[0].url).toStrictEqual(generatedPath);
    expect(videoInfo).toStrictEqual(VideoInformationMock());
  });
});
