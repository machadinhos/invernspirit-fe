import type { Address } from '$lib/types/checkout';

type UserBaseInfo = {
  email: string;
};

export type User = {
  firstName: string;
  lastName: string;
} & UserBaseInfo;

type UserDetails = { address?: Address } & User;
