import { Exclude, Expose } from 'class-transformer';
import { BaseInformation } from './BaseInformation';

@Exclude()
export class VideoInformation extends BaseInformation {
  constructor(obj?: Partial<VideoInformation>) {
    super(obj);
    Object.assign(this, obj);
  }
  @Expose()
  width: number;
  @Expose()
  height: number;
  @Expose()
  duration: number;
}
