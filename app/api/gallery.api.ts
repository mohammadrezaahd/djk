import type { IPostImage } from "~/types/dtos/gallery.dto";
import { apiUtils } from "./apiUtils.api";
import {
  authorizedDelete,
  authorizedPost,
  authorizedPostFileWithQuery,
} from "~/utils/authorizeReq";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IGallery } from "~/types/interfaces/gallery.interface";

const addImage = (data: IPostImage) => {
  return apiUtils<{ id: number }>(async () => {
    const { file, ...queryParams } = data;
    const response = await authorizedPostFileWithQuery(
      "/v1/images/save",
      file as File,
      queryParams
    );

    return response.data;
  });
};

const getImages = async ({
  skip = 0,
  limit = 100,
  search_title = "",
  source = "",
}: {
  skip?: number;
  limit?: number;
  search_title?: string;
  source?: string;
}) => {
  return apiUtils<{ list: IGallery[] }>(async () => {
    const response = await authorizedPost(
      `/v1/images/list?skip=${skip}&limit=${limit}&search_title=${search_title}&source=${source}`
    );
    return response.data;
  });
};

const removeImage = async (id: number) => {
  return apiUtils<{ status: string }>(async () => {
    const response = await authorizedDelete(`/v1/images/remove/${id}`);
    return response.data;
  });
};

export const useAddImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images"] });
    },
    onError: (error) => {
      console.error("❌ Error adding image:", error);
    },
  });
};

export const useImages = ({
  skip = 0,
  limit = 100,
  search_title = "",
  source = "",
}: {
  skip?: number;
  limit?: number;
  search_title?: string;
  source?: string;
} = {}) => {
  return useQuery({
    queryKey: ["images", { skip, limit, search_title, source }],
    queryFn: () => getImages({ skip, limit, search_title, source }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRemoveImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images remove"] });
    },
    onError: (error) => {
      console.error("❌ Error removing image:", error);
    },
  });
};
