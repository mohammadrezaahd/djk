import type { IPostProduct } from "~/types/dtos/product.dto";
import { apiUtils } from "./apiUtils.api";
import {
  authorizedPost,
  authorizedDelete,
  authorizedGet,
  authorizedPut,
} from "~/utils/authorizeReq";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  IGetProduct,
  IProductList,
  ProductStatus,
} from "~/types/interfaces/products.interface";

const addNewProduct = async (data: IPostProduct) => {
  return apiUtils<{ data: { id: number } }>(async () => {
    const response = await authorizedPost("/v1/cp_products/save", data);

    return {
      status: "true" as any,
      code: response.status as any,
      data: response.data.data,
    };
  });
};

const updateProduct = async (id: number, data: IPostProduct) => {
  return apiUtils<{ data: { id: number } }>(async () => {
    const response = await authorizedPost(`/v1/cp_products/update/${id}`, data);

    return {
      status: "true" as any,
      code: response.status as any,
      data: response.data.data,
    };
  });
};

const getProductsList = async ({
  skip = 0,
  limit = 100,
  searchTerm = "",
  categoryId,
  status,
}: {
  skip?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: number;
  status?: ProductStatus;
}) => {
  return apiUtils<{ list: IProductList[] }>(async () => {
    let url = `/v1/cp_products/list?skip=${skip}&limit=${limit}`;
    if (searchTerm && searchTerm.trim().length > 0) {
      url += `&search_title=${encodeURIComponent(searchTerm)}`;
    }
    if (categoryId !== undefined) {
      url += `&category_id=${categoryId}`;
    }
    const response = await authorizedPost(url);
    return response.data;
  });
};

const getProduct = async (id: number) => {
  return apiUtils<IGetProduct>(async () => {
    const response = await authorizedGet(`/v1/cp_products/get/${id}`);
    return response.data;
  });
};

const removeProduct = async (id: number) => {
  return apiUtils(async () => {
    const response = await authorizedDelete(`/v1/cp_products/remove/${id}`);
    return response.data;
  });
};

const publishProduct = async (id: number) => {
  return apiUtils(async () => {
    const response = await authorizedPost(`/v1/cp_products/publish/${id}`);
    return response.data;
  });
};

const editProduct = async ({
  id,
  data,
}: {
  id: number;
  data: IPostProduct;
}) => {
  return apiUtils<{ status: string }>(async () => {
    const response = await authorizedPut(`/v1/cp_products/edit/${id}`, data);
    return response.data;
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewProduct,
    onSuccess: (data) => {
      // Invalidate related queries after successful creation
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("❌ Error adding product:", error);
    },
  });
};

export const useProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getProductsList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products list"] });
    },
    onError: (error) => {
      console.error("❌ Error fetching products list:", error);
    },
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const useRemoveProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products list"] });
    },
    onError: (error) => {
      console.error("❌ Error removing product:", error);
    },
  });
};

export const usePublishProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products list"] });
    },
    onError: (error) => {
      console.error("❌ Error publishing product:", error);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IPostProduct }) =>
      updateProduct(id, data),
    onSuccess: (data, variables) => {
      // Invalidate related queries after successful update
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["products list"] });
    },
    onError: (error) => {
      console.error("❌ Error updating product:", error);
    },
  });
};

export const useEditProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products modify"] });
    },
    onError: (error) => {
      console.error("❌ Error modifying product:", error);
    },
  });
};
