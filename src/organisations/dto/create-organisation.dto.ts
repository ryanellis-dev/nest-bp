import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateOrganisationDto {
  /**
   * @example "Delta"
   */
  @IsNotEmpty()
  @MaxLength(10)
  name: string;
}
