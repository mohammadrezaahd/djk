import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axios } from "~/axios";
import { API_URL } from "~/constants";

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: any) => {
      const response = await axios.post(`/products`, productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
