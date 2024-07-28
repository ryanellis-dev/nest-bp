import { Expose } from 'class-transformer';
import { Many } from 'src/common/model/many.model';

export class Site {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;

  constructor(data: Partial<Site>) {
    Object.assign(this, data);
  }
}

export class ManySites extends Many(Site) {}
