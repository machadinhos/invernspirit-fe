import type { ExtendedAddress } from './checkout';

type UserBaseInfo = {
  email: string;
};

export type UserPersonalInformation = {
  firstName: string;
  lastName: string;
};

export type User = UserPersonalInformation & UserBaseInfo;

type UserDetails = { address?: ExtendedAddress; isValidated: boolean } & User;
