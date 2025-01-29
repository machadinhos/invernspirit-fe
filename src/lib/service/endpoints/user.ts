import type { Cart, LogInUser, SignUpUser, User } from '$types';
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

export const prepareUpdateLoggedInUser: Endpoint<User, [Partial<SignUpUser>]> = (context) => {
  return (countryCode, updatedUser) => {
    return Client.create<User, Partial<SignUpUser>>()
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
