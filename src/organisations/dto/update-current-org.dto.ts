import { IsUUID } from 'class-validator';

export class UpdateCurrentOrgDto {
  @IsUUID()
  id: string;
}
