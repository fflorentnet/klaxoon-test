import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { BaseInformation } from '../dtos/BaseInformation';
import { LinkAdapter } from './LinkAdapter';

export class LinkAdapterRegistry {
  private static __instance: LinkAdapterRegistry;
  private adapters: Map<string, LinkAdapter<BaseInformation>>;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    this.adapters = new Map();
  }

  public static getInstance(): LinkAdapterRegistry {
    if (!LinkAdapterRegistry.__instance) {
      LinkAdapterRegistry.__instance = new LinkAdapterRegistry();
    }
    return LinkAdapterRegistry.__instance;
  }

  public findPageInformation(url: string): Promise<BaseInformation> {
    const domain = this.extractDomain(url);
    const adapter = this.adapters.get(domain);
    if (!adapter) {
      throw new Error('This domain is not supported!');
    }
    return adapter.generatePromiseForUrl(url);
  }

  public registerAdapter(adapter: LinkAdapter<BaseInformation>) {
    if (this.adapters.has(adapter.supportedHost())) {
      throw new Error('An adapter for this host has already been declared.');
    }
    this.adapters.set(adapter.supportedHost(), adapter);
  }

  private extractDomain(url: string): string {
    let result = '';
    let match;
    if (
      (match = url.match(
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im,
      ))
    ) {
      result = match[1];
      if ((match = result.match(/^[^\.]+\.(.+\..+)$/))) {
        result = match[1];
      }
    }
    return result;
  }
}

const adapterFactoryPlugin: FastifyPluginCallback = (
  instance,
  _options,
  done,
) => {
  instance.decorate('fetchBaseInformation', (url: string) =>
    LinkAdapterRegistry.getInstance().findPageInformation(url),
  );
  done();
};

export const oEmbedFetchPlugin = fp(adapterFactoryPlugin);
