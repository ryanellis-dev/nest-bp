import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  /**
   * @example "John Doe"
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * @format email
   * @example "john@alpha.org"
   */
  @IsEmail()
  email: string;
}
