import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { safeLocalStorage } from "./storage";

const apiUrl = import.meta.env.VITE_API_URL;

// دریافت توکن از localStorage
const getToken = (): string | null => {
  return safeLocalStorage.getItem("access_token");
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: apiUrl,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // توکن منقضی شده یا نامعتبر است
      safeLocalStorage.removeItem("access_token");
      // می‌توانید اینجا redirect هم انجام دهید اگر نیاز باشد
    }
    return Promise.reject(error);
  }
);

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
  return axiosInstance.post(endpoint, data, config);
};

// تابع کمکی برای File Upload با Query Parameters
const authorizedPostFileWithQuery = async <T = any>(
  endpoint: string,
  file: File,
  queryParams: Record<string, string | boolean>,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  // Create FormData for file
  const formData = new FormData();
  formData.append('file', file);
  
  // Create query string from parameters
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  
  const urlWithQuery = `${endpoint}?${queryString}`;
  
  const uploadConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      // Don't set Content-Type for FormData - let browser set it with boundary
      ...config?.headers,
    },
  };
  
  return axiosInstance.post(urlWithQuery, formData, uploadConfig);
};

// تابع کمکی برای Multiple File Upload با Query Parameters
const authorizedPostMultipleFilesWithQuery = async <T = any>(
  endpoint: string,
  files: File[],
  queryParams: Record<string, string | boolean>,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  // Create FormData for multiple files
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append('files', file); // Use 'files' as field name for multiple files
  });
  
  // Create query string from parameters
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  
  const urlWithQuery = `${endpoint}?${queryString}`;
  
  const uploadConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      // Don't set Content-Type for FormData - let browser set it with boundary
      ...config?.headers,
    },
  };
  
  return axiosInstance.post(urlWithQuery, formData, uploadConfig);
};

// تابع کمکی برای GET request با Authorization
const authorizedGet = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.get(endpoint, config);
};

// تابع کمکی برای PUT request با Authorization
const authorizedPut = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.put(endpoint, data, config);
};

// تابع کمکی برای DELETE request با Authorization
const authorizedDelete = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.delete(endpoint, config);
};

// تابع کمکی برای PATCH request با Authorization
const authorizedPatch = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  return axiosInstance.patch(endpoint, data, config);
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
  axiosInstance,
};
