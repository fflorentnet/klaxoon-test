import { BaseInformation } from '../dtos/BaseInformation';

export interface fetchBaseInformation {
  (url: string): Promise<BaseInformation>;
}

declare module 'fastify' {
  interface FastifyInstance {
    fetchBaseInformation: fetchBaseInformation;
  }
}
