import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateOrganisationDto {
  @IsNotEmpty()
  @MaxLength(10)
  name: string;
}
