import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  /**
   * @example "Intelligence is the ability to adapt to change."
   */
  @IsNotEmpty()
  @MaxLength(100)
  body: string;
}
