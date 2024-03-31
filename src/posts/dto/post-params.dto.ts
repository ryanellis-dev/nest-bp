import { IsUUID } from 'class-validator';

export class PostParamsDto {
  /**
   * @format uuid
   * @example "86f0f545-75e8-44e0-9b12-2c217416dc55"
   */
  @IsUUID()
  postId: string;
}
