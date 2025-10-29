import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// دریافت توکن از localStorage
const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

// ایجاد headers با Authorization
const createAuthHeaders = (additionalHeaders?: Record<string, string>) => {
  const token = getToken();
  
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...additionalHeaders,
  };
};

// ایجاد config کامل برای درخواست‌های مجاز
const createAuthConfig = (config?: AxiosRequestConfig): AxiosRequestConfig => {
  const token = getToken();
  
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config?.headers,
    },
  };
};

// تابع کمکی برای POST request با Authorization
const authorizedPost = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const authConfig = createAuthConfig(config);
  return axios.post(`${apiUrl}${endpoint}`, data, authConfig);
};

// تابع کمکی برای GET request با Authorization
const authorizedGet = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const authConfig = createAuthConfig(config);
  return axios.get(`${apiUrl}${endpoint}`, authConfig);
};

// تابع کمکی برای PUT request با Authorization
const authorizedPut = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const authConfig = createAuthConfig(config);
  return axios.put(`${apiUrl}${endpoint}`, data, authConfig);
};

// تابع کمکی برای DELETE request با Authorization
const authorizedDelete = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const authConfig = createAuthConfig(config);
  return axios.delete(`${apiUrl}${endpoint}`, authConfig);
};

// تابع کمکی برای PATCH request با Authorization
const authorizedPatch = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const authConfig = createAuthConfig(config);
  return axios.patch(`${apiUrl}${endpoint}`, data, authConfig);
};

export {
  getToken,
  createAuthHeaders,
  createAuthConfig,
  authorizedPost,
  authorizedGet,
  authorizedPut,
  authorizedDelete,
  authorizedPatch,
};
