import { Exclude, Expose } from 'class-transformer';
import { BaseInformation } from './BaseInformation';

@Exclude()
export class PhotoInformation extends BaseInformation {
  constructor(obj?: Partial<PhotoInformation>) {
    super(obj);
    Object.assign(this, obj);
  }
  @Expose()
  width: number;
  @Expose()
  height: number;
}
