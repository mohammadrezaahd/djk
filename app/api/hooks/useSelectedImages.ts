import { useQuery } from "@tanstack/react-query";
import { axios } from "~/axios";
import { API_URL } from "~/constants";

export const useSelectedImages = (imageIds: number[]) => {
  return useQuery({
    queryKey: ["selectedImages", imageIds],
    queryFn: async () => {
      const response = await axios.post(`/gallery/selected-images`, {
        image_ids: imageIds,
      });
      return response.data;
    },
    enabled: imageIds.length > 0,
  });
};
