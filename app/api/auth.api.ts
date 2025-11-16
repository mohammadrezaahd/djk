import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { login as loginService, logout as logoutService } from "../services/auth.service";
import type { LoginCredentials, LoginResponse } from "../types/interfaces/auth.interface";
import { ApiStatus } from "../types";
import { isClient, safeLocalStorage } from "../utils/storage";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => loginService(credentials),
    onSuccess: (data) => {
      if (data.status === "true") {
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
    onError: (error: Error) => {
      //
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutService(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      //
    },
  });
}

export function useAuthStatus() {
    return useQuery({
        queryKey: ['authStatus'],
        queryFn: async () => {
            if (isClient()) {
                const token = safeLocalStorage.getItem("token");
                return !!token;
            }
            return false;
        }
    });
}