import type { User as UserType } from '$types';

class User {
  value: UserType | undefined = $state();
}

export const user = new User();
