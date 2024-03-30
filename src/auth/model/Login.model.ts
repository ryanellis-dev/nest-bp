import { Expose } from 'class-transformer';

export class Login {
  @Expose() access_token: string;

  constructor(data: Login) {
    Object.assign(this, data);
  }
}
