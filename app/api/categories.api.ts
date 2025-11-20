import { apiUtils } from "./apiUtils.api";
import { authorizedGet } from "~/utils/authorizeReq";
import type {
  ICategory,
  ICategoryList,
} from "~/types/interfaces/categories.interface";
import { useQuery } from "@tanstack/react-query";
// Options for what to include in getCategories response
export interface GetCategoriesOptions {
  attributes?: boolean;
  details?: boolean;
}

const getCategoriesList = async (
  search: string,
  page: number,
  limit: number
) => {
  return apiUtils<{ items: ICategoryList[], suugest: ICategoryList[] }>(
    async () => {
      const response = await authorizedGet(
        `/v1/categories/list?search=${search}&page=${page}&limit=${limit}&just_children=true`
      );
      return response.data;
    }
  );
};

const getCategories = async (
  categoryId: number,
  include: GetCategoriesOptions = { attributes: true, details: true }
) => {
  return apiUtils<{ item: ICategory }>(async () => {
    const { attributes = true, details = true } = include;
    const response = await authorizedGet(
      `/v1/categories/get?category_id=${categoryId}&attributes=${attributes}&details=${details}`
    );
    return response.data;
  });
};

export const categoriesApi = { getCategories, getCategoriesList };

export const useCategoriesList = (
  search: string,
  page: number,
  limit: number
) => {
  return useQuery({
    queryKey: ["categories list", search, page, limit],
    queryFn: () => getCategoriesList(search, page, limit),
    enabled: true,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
  });
};

// Hook برای دریافت جزئیات یک category خاص
export const useCategory = (
  categoryId: number,
  include: GetCategoriesOptions = { attributes: true, details: true },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["category", categoryId, include],
    queryFn: () => getCategories(categoryId, include),
    enabled: enabled && !!categoryId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};
