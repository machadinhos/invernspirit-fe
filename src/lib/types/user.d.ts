import type { Address } from '$lib/types/checkout';

type UserBaseInfo = {
  email: string;
};

export type UserPersonalInformation = {
  firstName: string;
  lastName: string;
};

export type User = UserPersonalInformation & UserBaseInfo;

type UserDetails = { address?: Address; isValidated: boolean } & User;
