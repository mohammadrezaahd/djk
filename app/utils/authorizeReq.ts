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

// تابع کمکی برای File Upload با Query Parameters
const authorizedPostFileWithQuery = async <T = any>(
  endpoint: string,
  file: File,
  queryParams: Record<string, string | boolean>,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const token = getToken();
  
  // Create FormData for file
  const formData = new FormData();
  formData.append('file', file);
  
  // Create query string from parameters
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  
  const urlWithQuery = `${apiUrl}${endpoint}?${queryString}`;
  
  const authConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData - let browser set it with boundary
      ...config?.headers,
    },
  };
  
  return axios.post(urlWithQuery, formData, authConfig);
};

// تابع کمکی برای Multiple File Upload با Query Parameters
const authorizedPostMultipleFilesWithQuery = async <T = any>(
  endpoint: string,
  files: File[],
  queryParams: Record<string, string | boolean>,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const token = getToken();
  
  // Create FormData for multiple files
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('files', file); // Use 'files' as field name for multiple files
  });
  
  // Create query string from parameters
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  
  const urlWithQuery = `${apiUrl}${endpoint}?${queryString}`;
  
  const authConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Don't set Content-Type for FormData - let browser set it with boundary
      ...config?.headers,
    },
  };
  
  return axios.post(urlWithQuery, formData, authConfig);
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
  authorizedPostFileWithQuery,
  authorizedPostMultipleFilesWithQuery,
  authorizedGet,
  authorizedPut,
  authorizedDelete,
  authorizedPatch,
};
