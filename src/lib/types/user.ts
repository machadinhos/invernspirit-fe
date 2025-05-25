import type { ExtendedAddress } from './checkout';

export type UserBaseInfo = {
  email: string;
};

export type UserPersonalInformation = {
  firstName: string;
  lastName: string;
};

export type User = UserPersonalInformation & UserBaseInfo;

export type UserDetails = { address?: ExtendedAddress; isValidated: boolean } & User;
