import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSiteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;
}
