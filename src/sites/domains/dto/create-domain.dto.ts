import { IsFQDN } from 'class-validator';

export class CreateDomainDto {
  /**
   * @format FQDN
   * @example "www.example.com"
   */
  @IsFQDN()
  name: string;
}
