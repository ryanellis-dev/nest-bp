import { Expose } from 'class-transformer';

export class User {
  @Expose() id: string;
  @Expose() name: string | null;
  @Expose() email: string;

  constructor(data: User) {
    Object.assign(this, data);
  }
}

export class ManyUsers {
  users: User[];
}

export class LoggedInUser extends User {}
