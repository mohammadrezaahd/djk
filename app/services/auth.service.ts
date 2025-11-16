import { authorizedPost } from '../utils/authorizeReq';
import type { LoginCredentials, LoginResponse } from '../types/interfaces/auth.interface';

const API_URL = import.meta.env.VITE_API_URL;

export const login = (credentials: LoginCredentials): Promise<LoginResponse> => {
  return authorizedPost<LoginResponse>(`${API_URL}/auth/login`, credentials);
};

export const logout = (): Promise<void> => {
  return authorizedPost<void>(`${API_URL}/auth/logout`, {});
};