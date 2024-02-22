const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

export const setAccessToken = (accessToken: string) => {
  return localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}
