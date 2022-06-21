import { BaseInformation } from '../dtos/BaseInformation';

export abstract class LinkAdapter<T extends BaseInformation> {
  public abstract supportedHost(): string;
  public abstract generatePromiseForUrl(url: string): Promise<T>;
}
