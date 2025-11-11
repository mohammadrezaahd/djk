import { useMutation } from "@tanstack/react-query";
import { axios } from "~/axios";
import { API_URL } from "~/constants";
import { useQuery } from "@tanstack/react-query";

export const useDetails = () => {
  return useMutation({
    mutationFn: async (params: {
      categoryId: number;
      skip: number;
      limit: number;
    }) => {
      const response = await axios.get(`/details`, { params });
      return response.data;
    },
  });
};

export const useDetail = (id: number) => {
  return useQuery({
    queryKey: ["detail", id],
    queryFn: async () => {
      const response = await axios.get(`/details/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};
