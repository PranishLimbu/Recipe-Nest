import Cookie from 'js-cookie';
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

const getToken = (token_name) => {
  return Cookie.get(token_name);
};

const setToken = ({key, value}) => {
  Cookie.set(key, value);
};

const getTokenDetails = () => {
  try {
    const token = getToken(ACCESS_TOKEN_KEY);
    return token ? JSON.parse(window.atob(token.split(".")[1])) : null;
  } catch (e) {
    console.error("Error parsing token details:", e);
    return null;
  }
};

const logout = () => {
  Cookie.remove(ACCESS_TOKEN_KEY);
  Cookie.remove(REFRESH_TOKEN_KEY);
};

const TokenService = {
  getToken,
  setToken,
  getTokenDetails,
  logout,
};

export { TokenService };
