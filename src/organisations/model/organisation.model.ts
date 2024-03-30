import { Expose } from 'class-transformer';

export class Organisation {
  @Expose() id: string;
  @Expose() name: string;
}
