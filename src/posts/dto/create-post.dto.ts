import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  /**
   * @example "A Brief History of Time"
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  title: string;

  /**
   * @example "Stephen Hawking provides a concise overview of the universe's origins, black holes, and the quest for a unified theory of physics."
   */
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  body: string;

  /**
   * @example false
   */
  @IsBoolean()
  @IsOptional()
  public?: boolean;
}
