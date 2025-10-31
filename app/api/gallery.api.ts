import type { IPostImage } from "~/types/dtos/gallery.dto";
import { apiUtils } from "./apiUtils.api";
import { authorizedPostFileWithQuery } from "~/utils/authorizeReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addImage = (data: IPostImage) => {
  return apiUtils<{ id: number }>(async () => {
    const { file, ...queryParams } = data;
    const response = await authorizedPostFileWithQuery("/v1/images/save", file as File, queryParams);

    return response.data;
  });
};

export const useAddImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["images add"] });
    },
    onError: (error) => {
      console.error("❌ Error adding detail:", error);
    },
  });
};
