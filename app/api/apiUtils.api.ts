import { AxiosError } from "axios";
import { ApiStatus, type ApiResponseData } from "~/types";

/**
 * Generic API utility function to standardize API responses
 * @param apiCall - The async function that makes the API call
 * @returns Promise with standardized ApiResponse format
 */
export async function apiUtils<T>(
  apiCall: () => Promise<ApiResponseData<T>>
): Promise<ApiResponseData<T>> {
  try {
    const response = await apiCall();

    // Validate response structure
    if (!response || typeof response !== "object") {
      return {
        status: ApiStatus.FAILED,
        code: 500,
        error: "Invalid response format",
      };
    }

    // Ensure status is properly formatted
    if (
      response.status !== ApiStatus.SUCCEEDED &&
      response.status !== ApiStatus.FAILED
    ) {
      response.status =
        response.code >= 200 && response.code < 300
          ? ApiStatus.SUCCEEDED
          : ApiStatus.FAILED;
    }

    return response;
  } catch (error) {
    console.error("API Error:", error);

    // Handle AxiosError specifically
    if (error instanceof AxiosError) {
      const responseData = error.response?.data;

      if (responseData && typeof responseData === "object") {
        return {
          status: ApiStatus.FAILED,
          code: (error.response?.status as any) || 500,
          error: responseData.error || responseData.message || "Request failed",
          message: responseData.message,
        };
      }

      return {
        status: ApiStatus.FAILED,
        code: (error.response?.status as any) || 500,
        error: error.message || "Network error occurred",
      };
    }

    return {
      status: ApiStatus.FAILED,
      code: 500,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Generic API utility function for list endpoints with pagination
 * @param apiCall - The async function that makes the API call
 * @returns Promise with standardized ListApiResponse format
 */
export async function apiListUtils<T>(
  apiCall: () => Promise<ApiResponseData<T>>
): Promise<ApiResponseData<T>> {
  try {
    const response = await apiCall();

    // Validate response structure
    if (!response || typeof response !== "object") {
      return {
        status: ApiStatus.FAILED,
        code: 500,
        error: "Invalid response format",
        data: undefined,
      };
    }

    // Ensure status is properly formatted
    if (
      response.status !== ApiStatus.SUCCEEDED &&
      response.status !== ApiStatus.FAILED
    ) {
      response.status =
        response.code >= 200 && response.code < 300
          ? ApiStatus.SUCCEEDED
          : ApiStatus.FAILED;
    }

    // Ensure data is an array
    if (!Array.isArray(response.data)) {
      response.data = undefined;
    }

    return response;
  } catch (error) {
    console.error("API List Error:", error);

    // Handle AxiosError specifically
    if (error instanceof AxiosError) {
      const responseData = error.response?.data;

      if (responseData && typeof responseData === "object") {
        return {
          status: ApiStatus.FAILED,
          code: (error.response?.status as any) || 500,
          error: responseData.error || responseData.message || "Request failed",
          message: responseData.message,
          data: undefined,
        };
      }

      return {
        status: ApiStatus.FAILED,
        code: (error.response?.status as any) || 500,
        error: error.message || "Network error occurred",
        data: undefined,
      };
    }

    return {
      status: ApiStatus.FAILED,
      code: 500,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: undefined,
    };
  }
}
