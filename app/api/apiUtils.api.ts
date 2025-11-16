import { ApiStatus, type ApiResponseData } from "../types";

export const handleApiResponse = async <T>(
  response: Response
): Promise<ApiResponseData<T>> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  const data = await response.json();
  if (data.status !== ApiStatus.SUCCEEDED) {
    throw new Error(data.message || "API request failed");
  }

  return data;
};