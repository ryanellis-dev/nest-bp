import { IsFQDN } from 'class-validator';

export class SiteParamsDto {
  /**
   * @format FQDN
   * @example "www.example.com"
   */
  @IsFQDN()
  name: string;
}
