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
  ICurrentUserResponse,
} from "~/types/interfaces/auth.interface";
import { isClient, safeLocalStorage } from "~/utils/storage";

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
  const response = await authorizedPost("/v1/auth/verify_password", {
    phone: data.phone,
    password: data.password,
  });

  // ذخیره توکن در localStorage
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
  }

  return response.data;
};

const logOut = async (phonNumber: string): Promise<any> => {
  const response = await authorizedPost("/v1/auth/verify_password", {
    phone: phonNumber,
  });

  // ذخیره توکن در localStorage
  if (response.data.access_token) {
    localStorage.removeItem("access_token");
  }

  return response.data;
};

const currentUser = async (): Promise<ICurrentUserResponse> => {
  const response = await authorizedGet(`/v1/auth/me`);
  return response.data;
};

export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: ["auth", "currentUser"],
    queryFn: currentUser,
    enabled: isClient() && !!safeLocalStorage.getItem("access_token"), // فقط اگر توکن موجود باشد
    retry: false, // عدم تلاش مجدد در صورت خطا
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
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
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
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
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
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
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      console.log("✅ Logged in successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error logging in:", error);
    },
  });
};

export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: currentUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      console.log("✅ Current user fetched:", data);
    },
    onError: (error) => {
      console.error("❌ Error fetching current user:", error);
    },
  });
};

export const useAuthStatus = () => {
  const token = isClient() ? safeLocalStorage.getItem("access_token") : null;
  const { data, isLoading, isError, error } = useCurrentUserQuery();

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

  return useMutation({
    mutationFn: logOut,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["logout"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      console.log("✅ Logged out successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error logging out:", error);
    },
  });
};
