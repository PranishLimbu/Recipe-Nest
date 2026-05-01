    import { API_ROUTS } from "./api";
    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import{ useNavigate} from "react-router-dom";
    import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, TokenService } from "../utils/tokenServices";
    import { httpClient } from "../lib/axios";
    export const authTokenKey = 'authToken';

    const initLogin = async (loginData) => {
    return await httpClient.post(API_ROUTS.LOGIN, loginData);
    };

    export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: initLogin,
        onSuccess: (response) => {
        TokenService.setToken({
            key: ACCESS_TOKEN_KEY,
            value: response.data.token,
        });
        TokenService.setToken({
            key: REFRESH_TOKEN_KEY,
            value: response.data.refreshToken ?? "",
        });
        // For Partial Matching
        // queryClient.setQueryData([authTokenKey], () => true);
        queryClient.setQueriesData({ queryKey: [authTokenKey] }, () => true);
        navigate('/');
        },
        onError: ({ response }) => {
        alert(response?.data?.error ?? response?.data?.message ?? 'Login failed');
        },
    });
    };
