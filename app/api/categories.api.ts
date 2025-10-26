import axios from "axios";
import { apiUtils } from "./apiUtils.api";
import type {
  ICategory,
  ICategoryList,
} from "~/types/interfaces/categories.interface";

const apiUrl = import.meta.env.VITE_API_URL;

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
  return apiUtils<{ items: ICategoryList[] }>(async () => {
    const response = await axios.get(
      `${apiUrl}/v1/categories/list?search=${search}&page=${page}&limit=${limit}`
    );
    return response.data;
  });
};

const getCategories = async (
  categoryId: number,
  include: GetCategoriesOptions = { attributes: true, details: true }
) => {
  return apiUtils<{ item: ICategory }>(async () => {
    const { attributes = true, details = true } = include;
    const response = await axios.get(
      `${apiUrl}/v1/categories/get?category_id=${categoryId}&attributes=${attributes}&details=${details}`
    );
    return response.data;
  });
};

export const categoriesApi = { getCategories, getCategoriesList };
