import type { IPostAttr } from "~/types/dtos/attributes.dto";
import { apiUtils } from "./apiUtils.api";
import {
  authorizedDelete,
  authorizedGet,
  authorizedPost,
  authorizedPut,
} from "~/utils/authorizeReq";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ITemplateList } from "~/types/interfaces/templates.interface";
import type { IGetAttrTemplate } from "~/types/interfaces/attributes.interface";

const addNewAttr = async (data: IPostAttr) => {
  return apiUtils<{ data: { id: number } }>(async () => {
    const response = await authorizedPost("/v1/attributes/save", data);

    return {
      status: "true" as any,
      code: response.status as any,
      data: response.data.data,
    };
  });
};

const getAttrList = async ({
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
    let url = `/v1/attributes/list?skip=${skip}&limit=${limit}`;
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

const removeAttr = async (id: number) => {
  return apiUtils<{ status: string }>(async () => {
    const response = await authorizedDelete(`/v1/attributes/remove/${id}`);
    return response.data;
  });
};

const getAttr = async (id: number) => {
  return apiUtils<IGetAttrTemplate>(async () => {
    const response = await authorizedGet(`/v1/attributes/get/${id}`);
    return response.data;
  });
};

const editAttr = async ({ id, data }: { id: number; data: IPostAttr }) => {
  return apiUtils<{ status: string }>(async () => {
    const response = await authorizedPut(`/v1/attributes/edit/${id}`, data);
    return response.data;
  });
};

export const useAddAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewAttr,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes new"] });
      // console.log("✅ Attribute added successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error adding attribute:", error);
    },
  });
};

export const useAttrs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getAttrList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes list"] });
    },
    onError: (error) => {
      console.error("❌ Error fetching attributes list:", error);
    },
  });
};

export const useRemoveAttr = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeAttr,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes remove"] });
    },
    onError: (error) => {
      console.error("❌ Error removing attribute:", error);
    },
  });
};

export const useAttr = (id: number) => {
  return useQuery({
    queryKey: ["attributes", id],
    queryFn: () => getAttr(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const useEditAttr = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editAttr,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes modify"] });
      // console.log("✅ Attribute added successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error adding attribute:", error);
    },
  });
};

export const attrsApi = {
  addNewAttr,
  getAttrList,
  removeAttr,
  getAttr,
  editAttr,
};
