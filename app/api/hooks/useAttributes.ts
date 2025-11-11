import { useMutation } from "@tanstack/react-query";
import { axios } from "~/axios";
import { API_URL } from "~/constants";
import { useQuery } from "@tanstack/react-query";

export const useAttrs = () => {
  return useMutation({
    mutationFn: async (params: {
      categoryId: number;
      skip: number;
      limit: number;
    }) => {
      const response = await axios.get(`/attributes`, { params });
      return response.data;
    },
  });
};

export const useAttr = (id: number) => {
  return useQuery({
    queryKey: ["attribute", id],
    queryFn: async () => {
      const response = await axios.get(`/attributes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
