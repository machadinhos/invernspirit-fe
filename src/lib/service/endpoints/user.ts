import type { Cart, LogInUser, SignUpUser, User, UserDetails } from '$types';
import { Client } from '../client';
import type { Endpoint } from './endpoint';

const PATH = 'user';

export const prepareGetLoggedInUser: Endpoint<User> = (context) => {
  return (countryCode) => {
    return Client.create<User>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}`)
      .withMethod('GET')
      .call();
  };
};

export const prepareDeleteLoggedInUser: Endpoint<void> = (context) => {
  return (countryCode) => {
    return Client.create<never>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}`)
      .withMethod('DELETE')
      .call();
  };
};

export const prepareUpdateLoggedInUser: Endpoint<UserDetails, [Partial<UserDetails>]> = (context) => {
  return (countryCode, updatedUser) => {
    return Client.create<UserDetails, Partial<UserDetails>>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}`)
      .withMethod('PUT')
      .withBody(updatedUser)
      .call();
  };
};

type LogInAndSignUpUserResponse = {
  user: User;
  cart: Cart;
};

export const prepareSignUp: Endpoint<LogInAndSignUpUserResponse, [SignUpUser]> = (context) => {
  return (countryCode, user) => {
    return Client.create<LogInAndSignUpUserResponse, SignUpUser>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/signup`)
      .withMethod('POST')
      .withBody(user)
      .call();
  };
};

export const prepareLogin: Endpoint<LogInAndSignUpUserResponse, [LogInUser]> = (context) => {
  return (countryCode, user) => {
    return Client.create<LogInAndSignUpUserResponse, LogInUser>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/login`)
      .withMethod('POST')
      .withBody(user)
      .call();
  };
};

type LogoutResponse = {
  cart: Cart;
};

export const prepareLogout: Endpoint<LogoutResponse> = (context) => {
  return (countryCode) => {
    return Client.create<LogoutResponse, Record<never, never>>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/logout`)
      .withMethod('POST')
      .withBody({})
      .call();
  };
};

export const prepareForgotPasswordSubmitEmail: Endpoint<void, [string]> = (context) => {
  return (countryCode, email) => {
    return Client.create<never, { email: string }>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/forgot-password/submit-email`)
      .withMethod('POST')
      .withBody({ email })
      .call();
  };
};

export const prepareForgotPasswordValidateCode: Endpoint<void, [string, string]> = (context) => {
  return (countryCode, email, code) => {
    return Client.create<never, { email: string; code: string }>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/forgot-password/validate-code`)
      .withMethod('POST')
      .withBody({ email, code })
      .call();
  };
};

export const prepareForgotPasswordResetPassword: Endpoint<void, [string, string, string]> = (context) => {
  return (countryCode, email, code, newPassword) => {
    return Client.create<never, { email: string; code: string; password: string }>()
      .withHostContext(context)
      .withEndpoint(`/${countryCode}/${PATH}/forgot-password/reset`)
      .withMethod('POST')
      .withBody({ email, code, password: newPassword })
      .call();
  };
};
