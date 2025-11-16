import { useQuery } from "@tanstack/react-query";
import { authorizedGet } from "../utils/authorizeReq";
import type {
  CategoryListResponse,
  CategoryResponse,
  GetCategoriesOptions,
} from "../types/interfaces/categories.interface";

const API_URL = "http://localhost:8000/api";

// Fetch a list of categories
export const getCategories = async (
  options: GetCategoriesOptions
): Promise<CategoryListResponse> => {
  const { search, page, limit, attributes, details } = options;
  const queryParams = new URLSearchParams({
    search: search || "",
    page: page?.toString() || "1",
    limit: limit?.toString() || "10",
    attributes: attributes ? "true" : "false",
    details: details ? "true" : "false",
  });
  return authorizedGet<CategoryListResponse>(
    `${API_URL}/categories?${queryParams}`
  );
};

// Fetch a single category by ID
export const getCategory = async (
  id: number,
  options: { attributes?: boolean; details?: boolean }
): Promise<CategoryResponse> => {
  const queryParams = new URLSearchParams({
    attributes: options.attributes ? "true" : "false",
    details: options.details ? "true" : "false",
  });
  return authorizedGet<CategoryResponse>(
    `${API_URL}/categories/${id}?${queryParams}`
  );
};

// Custom hook to get a list of categories
export function useCategoriesList(
  search?: string,
  page?: number,
  limit?: number
) {
  return useQuery<CategoryListResponse, Error>({
    queryKey: ["categories", { search, page, limit }],
    queryFn: () => getCategories({ search, page, limit }),
  });
}

// Custom hook to get a single category by ID
export function useCategory(
  id: number,
  options: { attributes?: boolean; details?: boolean },
  enabled = true
) {
  return useQuery<CategoryResponse, Error>({
    queryKey: ["category", id, options],
    queryFn: () => getCategory(id, options),
    enabled: !!id && enabled,
  });
}