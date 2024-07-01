import { Expose } from 'class-transformer';

export class Organisation {
  /**
   * @format uuid
   * @example "86f0f545-75e8-44e0-9b12-2c217416dc55"
   */
  @Expose() id: string;

  /**
   * @example "Delta"
   */
  @Expose() name: string;
}
