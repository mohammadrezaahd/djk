import { apiUtils } from "./apiUtils.api";
import type { IPostDetail } from "~/types/dtos/details.dto";
import {
  authorizedDelete,
  authorizedGet,
  authorizedPost,
  authorizedPut,
} from "~/utils/authorizeReq";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ITemplateList } from "~/types/interfaces/templates.interface";
import type { IGetDetailTemplate } from "~/types/interfaces/details.interface";

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
  searchTerm = "",
  categoryId,
}: {
  skip?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: number;
}) => {
  return apiUtils<{ list: ITemplateList[] }>(async () => {
    let url = `/v1/details/list?skip=${skip}&limit=${limit}`;
    if (searchTerm && searchTerm.trim().length > 0) {
      url += `&search_title=${encodeURIComponent(searchTerm)}`;
    }
    if (categoryId !== undefined) {
      url += `&category_id=${categoryId}`;
    }
    const response = await authorizedPost(url);
    return response.data;
  });
};

const removeDetail = async (id: number) => {
  return apiUtils<{ status: string }>(async () => {
    const response = await authorizedDelete(`/v1/details/remove/${id}`);
    return response.data;
  });
};

const getDetail = async (id: number) => {
  return apiUtils<IGetDetailTemplate>(async () => {
    const response = await authorizedGet(`/v1/details/get/${id}`);
    return response.data;
  });
};

const editDetail = async ({ id, data }: { id: number; data: IPostDetail }) => {
  return apiUtils<{ status: string }>(async () => {
    const response = await authorizedPut(`/v1/details/edit/${id}`, data);
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

export const useDetail = (id: number) => {
  return useQuery({
    queryKey: ["detailes", id],
    queryFn: () => getDetail(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const useEditDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details modify"] });
      // console.log("✅ Attribute added successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error modifying attribute:", error);
    },
  });
};

export const detailsApi = {
  addNewDetail,
  getDetailsList,
  removeDetail,
  getDetail,
  editDetail,
};
