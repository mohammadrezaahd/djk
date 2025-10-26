import axios from "axios";
import { apiUtils } from "./apiUtils.api";
import type { ApiResponse } from "~/types";

const apiUrl = import.meta.env.VITE_API_URL;

// Request and Response Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id: string | number;
    username: string;
    email?: string;
    name?: string;
  };
  expires_at?: string;
  refresh_token?: string;
}

/**
 * Login API call
 * @param credentials - Username and password
 * @returns Promise with login response
 */

export const loginApi = async (
  credentials: LoginRequest
): ApiResponse<LoginResponse> => {
  return apiUtils(async () => {
    const response = await axios.post(`${apiUrl}/v1/auth/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  });
};
