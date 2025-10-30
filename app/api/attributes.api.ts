import type { IPostAttr } from "~/types/dtos/attributes.dto";
import { apiUtils } from "./apiUtils.api";
import { authorizedDelete, authorizedPost } from "~/utils/authorizeReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ITemplateList } from "~/types/interfaces/templates.interface";

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
}: {
  skip?: number;
  limit?: number;
}) => {
  return apiUtils<{ list: ITemplateList[] }>(async () => {
    const response = await authorizedPost(
      `/v1/attributes/list?skip=${skip}&limit=${limit}`
    );
    return response.data;
  });
};

const removeAttr = async (id: number) => {
  return apiUtils<{ status: string }>(async () => {
    const response = await authorizedDelete(`/v1/attributes/remove/${id}`);
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
      queryClient.invalidateQueries({ queryKey: ["attributes list"] });
      queryClient.invalidateQueries({ queryKey: ["attributes remove"] });
    },
    onError: (error) => {
      console.error("❌ Error removing attribute:", error);
    },
  });
};

export const attrsApi = { addNewAttr, getAttrList, removeAttr };
