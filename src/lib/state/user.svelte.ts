import type { UserDetails as UserType } from '$types';

class User {
  value: UserType | undefined = $state();

  get isLoggedIn(): boolean {
    return this.value !== undefined;
  }
}

export const user = new User();
