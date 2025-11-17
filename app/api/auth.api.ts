import { authorizedGet, authorizedPost } from "~/utils/authorizeReq";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  IRegister,
  ICheckNumber,
  ISendOtp,
  IVerifyOtp,
  ILoginWithPassword,
} from "~/types/dtos/auth.dto";
import type {
  ICheckNumberResponse,
  ISendOtpResponse,
  IVerifyOtpResponse,
  IRegisterResponse,
  ILoginWithPasswordResponse,
} from "~/types/interfaces/auth.interface";
import { isClient, safeLocalStorage } from "~/utils/storage";
import { useProfile } from "./profile.api";

// API Functions
const checkNumber = async (
  data: ICheckNumber
): Promise<ICheckNumberResponse> => {
  const response = await authorizedPost("/v1/auth/check_number", {
    phone: data.phone,
  });
  return response.data;
};

const sendOtp = async (data: ISendOtp): Promise<ISendOtpResponse> => {
  const response = await authorizedPost("/v1/auth/send_otp", {
    phone: data.phone,
  });
  return response.data;
};

const verifyOtp = async (data: IVerifyOtp): Promise<IVerifyOtpResponse> => {
  const response = await authorizedPost(
    `/v1/auth/verify_otp?phone=${data.phone}&code=${data.code}`
  );

  // ذخیره توکن در localStorage
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
  }

  return response.data;
};

const register = async (data: IRegister): Promise<IRegisterResponse> => {
  // بررسی وجود توکن OTP قبل از ارسال
  const otpToken = localStorage.getItem("access_token");
  console.log(
    "🔐 Register - OTP Token:",
    otpToken ? "موجود است" : "موجود نیست"
  );

  // اگر API شما از query string استفاده می‌کند:
  // const response = await authorizedPost(
  //   `/v1/auth/register?first_name=${data.first_name}&last_name=${data.last_name}&email=${data.email}&password=${data.password}`
  // );

  // اگر API شما از body استفاده می‌کند (معمول‌تر است):
  const response = await authorizedPost("/v1/auth/register", {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    password: data.password,
  });

  console.log("✅ Register Response:", response.data);

  // ذخیره توکن نهایی (پس از register) در localStorage
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
  }

  return response.data;
};

const loginWithPassword = async (
  data: ILoginWithPassword
): Promise<ILoginWithPasswordResponse> => {
  // ایجاد FormData برای ارسال به صورت form fields
  const formData = new FormData();
  formData.append("username", data.phone);
  formData.append("password", data.password);

  const response = await authorizedPost("/v1/auth/verify_password", formData);

  // ذخیره توکن در localStorage
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
  }

  return response.data;
};

const logOut = async (phoneNumber: string): Promise<void> => {
  const response = await authorizedPost("/v1/auth/logout", {
    phone: phoneNumber,
  });

  // پاک کردن توکن از localStorage فقط پس از موفقیت آمیز بودن API
  localStorage.removeItem("access_token");

  return response.data;
};

// Custom Hooks
export const useCheckNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkNumber,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["checkNumber"] });
      console.log("✅ Number checked successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error checking number:", error);
    },
  });
};

export const useSendOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendOtp,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["sendOtp"] });
      console.log("✅ OTP sent successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error sending OTP:", error);
    },
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["verifyOtp"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      console.log("✅ OTP verified successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error verifying OTP:", error);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["register"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      console.log("✅ Registered successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error registering:", error);
    },
  });
};

export const useLoginWithPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithPassword,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["loginWithPassword"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      console.log("✅ Logged in successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error logging in:", error);
    },
  });
};

// حذف شد - از useProfile استفاده می‌کنیم

export const useAuthStatus = () => {
  const token = isClient() ? safeLocalStorage.getItem("access_token") : null;
  const { data, isLoading, isError, error } = useProfile();

  const isAuthenticated = !!(token && data && !isError);

  return {
    isAuthenticated,
    isLoading: token ? isLoading : false,
    isError,
    error,
    token,
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { data: profileData } = useProfile();

  return useMutation({
    mutationFn: () => {
      const phoneNumber = profileData?.data?.phone || "";
      return logOut(phoneNumber);
    },
    onSuccess: () => {
      // پاک کردن تمام cache ها
      queryClient.clear();
      console.log("✅ Logged out successfully");
    },
    onError: (error) => {
      console.error("❌ Error logging out:", error);
    },
  });
};
