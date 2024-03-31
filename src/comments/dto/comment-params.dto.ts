import { IsUUID } from 'class-validator';
import { PostParamsDto } from 'src/posts/dto/post-params.dto';

export class CommentParamsDto extends PostParamsDto {
  /**
   * @format uuid
   * @example "86f0f545-75e8-44e0-9b12-2c217416dc55"
   */
  @IsUUID()
  commentId: string;
}
