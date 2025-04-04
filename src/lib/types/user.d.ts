import type { Address } from '$lib/types/checkout';

type UserBaseInfo = {
  email: string;
};

export type User = {
  firstName: string;
  lastName: string;
} & UserBaseInfo;

export type LogInUser = {
  password: string;
  remember: boolean;
} & UserBaseInfo;

export type SignUpUser = LogInUser & User & { captchaToken: string };

// TODO
type UserDetails = { address?: Address } & User;
