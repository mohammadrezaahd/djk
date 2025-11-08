import type { IPostImage } from "~/types/dtos/gallery.dto";
import { apiUtils } from "./apiUtils.api";
import {
  authorizedDelete,
  authorizedGet,
  authorizedPost,
  authorizedPostFileWithQuery,
  authorizedPostMultipleFilesWithQuery,
  authorizedPut,
} from "~/utils/authorizeReq";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { IGallery } from "~/types/interfaces/gallery.interface";

const addImage = (data: IPostImage) => {
  return apiUtils<{ id: number } | { ids: number[] }>(async () => {
    const { file, multipleUpload, ...queryParams } = data;

    if (multipleUpload && Array.isArray(file)) {
      // Multiple file upload
      const response = await authorizedPostMultipleFilesWithQuery(
        "/v1/images/save-multiple",
        file as File[],
        queryParams
      );
      return response.data;
    } else {
      // Single file upload (existing logic)
      const response = await authorizedPostFileWithQuery(
        "/v1/images/save",
        file as File,
        queryParams
      );
      return response.data;
    }
  });
};

const getImages = async ({
  skip = 0,
  limit = 100,
  search_title = "",
  source = "app",
  packaging = true,
  product = true,
}: {
  skip?: number;
  limit?: number;
  search_title?: string;
  source?: string;
  packaging?: boolean;
  product?: boolean;
}) => {
  return apiUtils<{ list: IGallery[] }>(async () => {
    const response = await authorizedPost(
      `/v1/images/list?skip=${skip}&limit=${limit}&search_title=${search_title}&source=${source}&packaging=${packaging}&product=${product}`
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

const getImage = async (id: number) => {
  return apiUtils<IGallery>(async () => {
    const response = await authorizedGet(`/v1/images/get/${id}`);
    return response.data;
  });
};

const editImage = async ({ id, data }: { id: number; data: IPostImage }) => {
  return apiUtils<{ status: string }>(async () => {
    const response = await authorizedPut(`/v1/images/edit/${id}`, data);
    return response.data;
  });
};

const getSelectedImages = async (data: number[]) => {
  return apiUtils<{ list: IGallery[] }>(async () => {
    const response = await authorizedPost(`/v1/images/get/multi`, data);
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
  packaging = true,
  product = true,
}: {
  skip?: number;
  limit?: number;
  search_title?: string;
  source?: string;
  packaging?: boolean;
  product?: boolean;
} = {}) => {
  return useQuery({
    queryKey: ["images", { skip, limit, search_title, source, packaging, product }],
    queryFn: () => getImages({ skip, limit, search_title, source, packaging, product }),
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

export const useImage = (id: number) => {
  return useQuery({
    queryKey: ["detailes", id],
    queryFn: () => getImage(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const useEditImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image modify"] });
      // console.log("✅ Attribute added successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error modifying image:", error);
    },
  });
};

export const useSelectedImages = (data: number[]) => {
  return useQuery({
    queryKey: ["images", data],
    queryFn: () => getSelectedImages(data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
