import { Expose } from 'class-transformer';
import { Many } from 'src/common/model/many.model';
import { Paginated } from 'src/common/model/paginated.model';
import { EnumOrgRole } from 'src/permission/model/org-role.model';

export class User {
  /**
   * @format uuid
   * @example "86f0f545-75e8-44e0-9b12-2c217416dc55"
   */
  @Expose() id: string;

  /**
   * @example "John Doe"
   */
  @Expose() name: string | null;

  /**
   * @format email
   * @example "john@alpha.org"
   */
  @Expose() email: string;

  constructor(data: User) {
    Object.assign(this, data);
  }
}

export class ManyUsers extends Many(User) {}

export class PaginatedUsers extends Paginated(User) {}

export class LoggedInUser extends User {
  /**
   * @format uuid
   * @example "86f0f545-75e8-44e0-9b12-2c217416dc55"
   */
  @Expose() orgId: string | null;

  //TODO: docs
  @Expose() orgRole: EnumOrgRole;

  constructor(data: LoggedInUser) {
    super(data);
    Object.assign(this, data);
  }
}
