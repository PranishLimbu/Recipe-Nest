
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { TokenService, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/tokenServices';


const THREE_MINUTES = 3 * 60 * 1000;

// Refresh token implmentation afer API from BE (Returns response token)
const refreshAuthToken = async (token) => {
  return Promise.resolve(token);
};

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_API ?? '',

});



const refreshAuth = async (failedRequest) => {
  const refreshToken = TokenService.getToken(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    TokenService.logout();
    return Promise.reject(new Error('No refresh Token'));
  }

  try {
    // get response access token
    const token = await refreshAuthToken('TOKEN');
    TokenService.setToken({
      key: ACCESS_TOKEN_KEY,
      value: token,
    });
    if (failedRequest.response.config.headers) {
      failedRequest.response.config.headers['Authorization'] =
        `Bearer ${token}`;
    }
    return Promise.resolve();
  } catch (error) {
    TokenService.logout();
    return Promise.reject(error);
  }
};

createAuthRefreshInterceptor(httpClient, refreshAuth);

httpClient.interceptors.request.use(
  (config) => {
    const accessToken = TokenService.getToken(ACCESS_TOKEN_KEY);
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export { httpClient };
