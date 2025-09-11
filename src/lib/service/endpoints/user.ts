import type { Cart, User, UserBaseInfo, UserDetails, UserPersonalInformation } from '$types';
import { Client } from '../client';
import type { Endpoint } from './endpoint';

const PATH = 'user';

export const getLoggedInUser: Endpoint<UserDetails> = (context, countryCode) => {
  return Client.create<UserDetails>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}`)
    .withMethod('GET')
    .call();
};

export const deleteLoggedInUser: Endpoint<never> = (context, countryCode) => {
  return Client.create<never>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}`)
    .withMethod('DELETE')
    .call();
};

export const updateLoggedInUserPersonalInformation: Endpoint<UserDetails, [Partial<UserPersonalInformation>]> = (
  context,
  countryCode,
  updatedUser,
) => {
  return Client.create<UserDetails, Partial<UserPersonalInformation>>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/update/personal-information`)
    .withMethod('POST')
    .withBody(updatedUser)
    .call();
};

export const updateLoggedInUserEmailSubmitEmail: Endpoint<never, [string]> = (context, countryCode, newEmail) => {
  return Client.create<never, { email: string }>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/update/email/submit`)
    .withMethod('POST')
    .withBody({ email: newEmail })
    .call();
};

export const updateLoggedInUserEmailValidateCode: Endpoint<never, [string]> = (context, countryCode, code) => {
  return Client.create<never, { code: string }>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/update/email/validate-code`)
    .withMethod('POST')
    .withBody({ code })
    .call();
};

type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const updateLoggedInUserPassword: Endpoint<never, [UpdatePasswordPayload]> = (context, countryCode, payload) => {
  return Client.create<never, UpdatePasswordPayload>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/update/password`)
    .withMethod('POST')
    .withBody(payload)
    .call();
};

type LogInAndSignUpUserResponse = {
  user: UserDetails;
  cart: Cart;
};

type BaseAuthUserPayload = {
  password: string;
  remember: boolean;
} & UserBaseInfo;

type CaptchaToken = {
  captchaToken: string;
};

type LogInPayload = BaseAuthUserPayload & CaptchaToken;

export const login: Endpoint<LogInAndSignUpUserResponse, [LogInPayload]> = (context, countryCode, user) => {
  return Client.create<LogInAndSignUpUserResponse, LogInPayload>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/login`)
    .withMethod('POST')
    .withBody(user)
    .call();
};

type SignUpPayload = BaseAuthUserPayload & User & CaptchaToken;

export const signUp: Endpoint<never, [SignUpPayload]> = (context, countryCode, user) => {
  return Client.create<never, SignUpPayload>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/signup`)
    .withMethod('POST')
    .withBody(user)
    .call();
};

type VerifyEmailPayload = {
  email: string;
  code: string;
};

export const verifyEmail: Endpoint<LogInAndSignUpUserResponse, [VerifyEmailPayload]> = (
  context,
  countryCode,
  payload,
) => {
  return Client.create<LogInAndSignUpUserResponse, VerifyEmailPayload>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/signup/verify-email`)
    .withMethod('POST')
    .withBody(payload)
    .call();
};

export const resendEmail: Endpoint<never, [string]> = (context, countryCode, email) => {
  return Client.create<never, UserBaseInfo>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/signup/resend-email`)
    .withMethod('POST')
    .withBody({ email })
    .call();
};

type LogoutResponse = {
  cart: Cart;
};

export const logout: Endpoint<LogoutResponse> = (context, countryCode) => {
  return Client.create<LogoutResponse, Record<never, never>>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/logout`)
    .withMethod('POST')
    .withBody({})
    .call();
};

type ForgotPasswordSubmitEmailPayload = {
  email: string;
  captchaToken: string;
};

export const forgotPasswordSubmitEmail: Endpoint<never, [ForgotPasswordSubmitEmailPayload]> = (
  context,
  countryCode,
  payload,
) => {
  return Client.create<never, ForgotPasswordSubmitEmailPayload>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/forgot-password/submit-email`)
    .withMethod('POST')
    .withBody(payload)
    .call();
};

export const forgotPasswordValidateCode: Endpoint<never, [string, string]> = (context, countryCode, email, code) => {
  return Client.create<never, { email: string; code: string }>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/forgot-password/validate-code`)
    .withMethod('POST')
    .withBody({ email, code })
    .call();
};

export const forgotPasswordResetPassword: Endpoint<never, [string, string, string]> = (
  context,
  countryCode,
  email,
  code,
  newPassword,
) => {
  return Client.create<never, { email: string; code: string; password: string }>()
    .withHostContext(context)
    .withEndpoint(`/${countryCode}/${PATH}/forgot-password/reset`)
    .withMethod('POST')
    .withBody({ email, code, password: newPassword })
    .call();
};
