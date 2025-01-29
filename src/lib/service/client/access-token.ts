let globalAccessToken = '';

export const setAccessToken = (accessToken: string): void => {
  globalAccessToken = accessToken;
};

export const getAccessToken = (): string => {
  return globalAccessToken;
};
