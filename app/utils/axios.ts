import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { API_URL } from "~/constants";

const getToken = (): string | null => {
  // Check if running in a browser environment before accessing localStorage
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config): AxiosRequestConfig => {
    const token = getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance as axios };
