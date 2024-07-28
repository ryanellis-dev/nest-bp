import { Expose } from 'class-transformer';
import { Many } from 'src/common/model/many.model';

export class Domain {
  /**
   * @format FQDN
   * @example "www.example.com"
   */
  @Expose()
  name: string;

  @Expose() createdAt: Date;

  constructor(data: Partial<Domain>) {
    Object.assign(this, data);
  }
}

export class ManyDomains extends Many(Domain) {}
