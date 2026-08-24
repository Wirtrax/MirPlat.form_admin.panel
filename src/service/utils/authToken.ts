export const TOKEN_STORAGE_KEY = 'authToken';

export let authToken: string | null =
  typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;

export const setAuthToken = (token: string | null): void => {
  authToken = token;
  if (typeof localStorage === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const getAuthToken = (): string | null => authToken;
