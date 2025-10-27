import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token?: string;
  token_type?: string;
}

export const loginApi = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", credentials.username);
  formData.append("password", credentials.password);
  formData.append("scope", "");
  formData.append("client_id", "string");
  // formData.append("client_secret", "********");

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
  console.log(response);
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
  }

  return response.data;
};
