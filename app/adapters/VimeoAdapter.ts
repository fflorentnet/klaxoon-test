import { VideoInformation } from '../dtos/VideoInformation';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { LinkAdapter } from './LinkAdapter';
import { FastifyPluginCallback } from 'fastify';
import { LinkAdapterRegistry } from './LinkAdapterRegistry';

export default class VimeoAdapter extends LinkAdapter<VideoInformation> {
  public supportedHost(): string {
    return 'vimeo.com';
  }

  public generatePromiseForUrl(url: string): Promise<VideoInformation> {
    return axios
      .get(`https://vimeo.com/api/oembed.json?url=${url.replace(':', '%3A')}`)
      .then(({ data }) => plainToClass(VideoInformation, data));
  }
}

export const oEmbedVimeoFetchPlugin: FastifyPluginCallback = (
  instance,
  __options,
  done,
) => {
  LinkAdapterRegistry.getInstance().registerAdapter(new VimeoAdapter());
  instance.log.info('Loading Vimeo plugin.');
  done();
};
