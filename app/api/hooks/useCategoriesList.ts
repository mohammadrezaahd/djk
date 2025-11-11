import { useQuery } from "@tanstack/react-query";
import { axios } from "~/axios";
import { API_URL } from "~/constants";

export const useCategoriesList = (
  search: string,
  page: number,
  limit: number
) => {
  return useQuery({
    queryKey: ["categories", search, page, limit],
    queryFn: async () => {
      const response = await axios.get(`/categories`, {
        params: { search, page, limit },
      });
      return response.data;
    },
  });
};
