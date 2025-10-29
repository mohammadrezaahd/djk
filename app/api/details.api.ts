import type { IPostAttr } from "~/types/dtos/attributes.dto";
import { apiUtils } from "./apiUtils.api";
import type { IPostDetail } from "~/types/dtos/details.dto";
import { authorizedPost } from "~/utils/authorizeReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// افزودن جزئیات جدید با استفاده از authorizedPost
const addNewDetail = async (data: IPostDetail) => {
  return apiUtils<{ data: { id: number } }>(async () => {
    const response = await authorizedPost("/v1/details/save", data);

    return {
      status: "true" as any,
      code: response.status as any,
      data: response.data.data,
    };
  });
};

// React Query mutation hook برای افزودن detail
export const useAddDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewDetail,
    onSuccess: (data) => {
      // Invalidate related queries after successful creation
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("✅ Detail added successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error adding detail:", error);
    },
  });
};

export const detailsApi = { addNewDetail };
