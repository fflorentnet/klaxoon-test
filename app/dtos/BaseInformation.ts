import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class BaseInformation {
  constructor(obj?: Partial<BaseInformation>) {
    Object.assign(this, obj);
  }
  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose({ name: 'author_name' })
  author: string;

  @Expose({ name: 'thumbnail_url' })
  thumbnail: string;

  @Expose({ name: 'upload_date' })
  @Type(() => Date)
  uploadDate: Date;

  @Expose()
  type: string;
}
