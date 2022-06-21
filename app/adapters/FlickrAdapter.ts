import { PhotoInformation } from '../dtos/PhotoInformation';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { LinkAdapter } from './LinkAdapter';
import { LinkAdapterRegistry } from './LinkAdapterRegistry';
import { FastifyPluginCallback } from 'fastify';

export default class FlickrAdapter extends LinkAdapter<PhotoInformation> {
  public supportedHost(): string {
    return 'flickr.com';
  }

  public generatePromiseForUrl(url: string): Promise<PhotoInformation> {
    return axios
      .get(
        `http://www.flickr.com/services/oembed/?url=${url.replace(':', '%3A')}`,
        {
          params: {
            format: 'json',
          },
        },
      )
      .then(({ data }) => plainToClass(PhotoInformation, data));
  }
}

export const oEmbedFlickrFetchPlugin: FastifyPluginCallback = (
  instance,
  __options,
  done,
) => {
  LinkAdapterRegistry.getInstance().registerAdapter(new FlickrAdapter());
  instance.log.info('Loading Flickr plugin.');
  done();
};
