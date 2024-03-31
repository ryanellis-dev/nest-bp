import { IsEmail } from 'class-validator';

export class LoginDto {
  /**
   * @example "alice@alpha.org"
   */
  @IsEmail()
  email: string;
}
