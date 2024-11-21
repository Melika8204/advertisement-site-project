// src/utils/cookie.js
export const setCookie = (name, value, days) => {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`; // Encoding value here
};

export const getCookie = (cookieName) => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find(c => c.startsWith(cookieName + '='));
  if (cookie) {
      return decodeURIComponent(cookie.split('=')[1]); // Decoding value here
  }
  return null;
};

export const removeCookie = (cookieName) => {
  document.cookie = `${cookieName}=; max-age=-1; path=/`;
};
