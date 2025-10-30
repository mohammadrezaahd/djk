import type { IPostAttr } from "~/types/dtos/attributes.dto";
import { apiUtils } from "./apiUtils.api";
import type { IPostDetail } from "~/types/dtos/details.dto";
import { authorizedDelete, authorizedPost } from "~/utils/authorizeReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ITemplateList } from "~/types/interfaces/templates.interface";

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

const getDetailsList = async ({
  skip = 0,
  limit = 100,
}: {
  skip?: number;
  limit?: number;
}) => {
  return apiUtils<{ list: ITemplateList[] }>(async () => {
    const response = await authorizedPost(
      `/v1/details/list?skip=${skip}&limit=${limit}`
    );
    return response.data;
  });
};

const removeDetail = async (id: number) => {
  return apiUtils<{ status: string }>(async () => {
    const response = await authorizedDelete(`/v1/details/remove/${id}`);
    return response.data;
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

export const useDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getDetailsList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details list"] });
    },
    onError: (error) => {
      console.error("❌ Error fetching details list:", error);
    },
  });
};

export const useRemoveDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details list"] });
      queryClient.invalidateQueries({ queryKey: ["detail remove"] });
    },
    onError: (error) => {
      console.error("❌ Error removing detail:", error);
    },
  });
};

export const detailsApi = { addNewDetail, getDetailsList };
