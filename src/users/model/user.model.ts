import { Expose } from 'class-transformer';
import { Many } from 'src/common/model/many.model';

export class User {
  @Expose() id: string;
  @Expose() name: string | null;
  @Expose() email: string;

  constructor(data: User) {
    Object.assign(this, data);
  }
}

export class ManyUsers extends Many(User) {}

export class LoggedInUser extends User {
  @Expose() orgId: string | null;
}
