import axios from "axios";
import { apiUtils } from "./apiUtils.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authorizedGet } from "~/utils/authorizeReq";

const apiUrl = import.meta.env.VITE_API_URL;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginNumberRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token?: string;
  token_type?: string;
}

const loginApi = async (credentials: LoginRequest) => {
  return apiUtils<LoginResponse>(async () => {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    formData.append("scope", "");
    formData.append("client_id", "string");

    const response = await axios.post<LoginResponse>(
      `${apiUrl}/v1/auth/login`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // ✅ ذخیره JWT در localStorage
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    }

    return {
      status: "true" as any,
      code: response.status as any,
      data: response.data,
    };
  });
};

const loginApiNumber = async (credentials: LoginNumberRequest) => {
  return apiUtils<LoginResponse>(async () => {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);
    formData.append("scope", "");
    formData.append("client_id", "string");

    const response = await axios.post<LoginResponse>(
      `${apiUrl}/v1/auth/verify_password`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // ✅ ذخیره JWT در localStorage
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    }

    return {
      status: "true" as any,
      code: response.status as any,
      data: response.data,
    };
  });
};

const logout = async () => {
  return apiUtils<{ status: string }>(async () => {
    // پاک کردن توکن از localStorage
    localStorage.removeItem("access_token");

    return {
      status: "true" as any,
      code: 200 as any,
      data: { status: "success" },
    };
  });
};

const currentUser = async () => {
  return apiUtils<{ email: string }>(async () => {
    const response = await authorizedGet(`/v1/auth/me`);
    return response.data;
  });
};

// React Query Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      console.log("✅ Login successful:", data);
    },
    onError: (error) => {
      console.error("❌ Login error:", error);
    },
  });
};

export const useLoginNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApiNumber,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
      console.log("✅ Login successful:", data);
    },
    onError: (error) => {
      console.error("❌ Login error:", error);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear(); // پاک کردن تمام cache ها
      console.log("✅ Logout successful");
    },
    onError: (error) => {
      console.error("❌ Logout error:", error);
    },
  });
};

export const useCurrentUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: currentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current user  "] });
    },
    onError: (error) => {
      console.error("❌ Error fetching current user:", error);
    },
  });
};

export const authApi = {
  loginApi,
  loginApiNumber,
  logout,
  currentUser,
};
