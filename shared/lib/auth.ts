const RETURN_URL_KEY = 'clerk_return_url';

export const saveReturnUrl = () =>
  sessionStorage.setItem(RETURN_URL_KEY, window.location.href);

export const consumeReturnUrl = (): string | null => {
  const url = sessionStorage.getItem(RETURN_URL_KEY);
  if (url) sessionStorage.removeItem(RETURN_URL_KEY);
  return url;
};
