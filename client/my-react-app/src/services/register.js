import { httpClient } from "../lib/axios";
import { API_ROUTS } from "./api";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, TokenService } from "../utils/tokenServices";
import { authTokenKey } from "./login";

const registerRoutes = {
  user: API_ROUTS.REGISTER,
  chef: API_ROUTS.REGISTER_CHEF,
  admin: API_ROUTS.REGISTER_ADMIN,
};

const register = ({ role = "user", ...reqBody }) => {
  return httpClient.post(registerRoutes[role] ?? API_ROUTS.REGISTER, reqBody);
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      TokenService.setToken({
        key: ACCESS_TOKEN_KEY,
        value: res.data.token,
      });
      TokenService.setToken({
        key: REFRESH_TOKEN_KEY,
        value: res.data.refreshToken ?? "",
      });
      queryClient.setQueriesData({ queryKey: [authTokenKey] }, () => true);
      navigate('/');
    },
    onError: ({ response }) => {
      alert(response?.data?.error ?? response?.data?.message ?? 'Registration failed');
    },
  });
};
