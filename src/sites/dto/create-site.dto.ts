import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IsSimpleString } from 'src/common/validators/simple-string.validator';

export class CreateSiteDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @IsSimpleString()
  name: string;
}
