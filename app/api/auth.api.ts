import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginService, logout as logoutService } from "../services/auth.service";
import type { LoginCredentials, LoginResponse } from "../types/interfaces/auth.interface";
import { ApiStatus } from "../types";

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => loginService(credentials),
    onSuccess: (data) => {
      if (data.status === "true") {
        // You might want to invalidate queries that depend on authentication status
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