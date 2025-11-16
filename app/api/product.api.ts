import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addProduct,
  editProduct,
  getProducts,
  getProduct,
  removeProduct,
  publishProduct,
  getSubProducts,
} from "../services/product.service";
import type {
  AddProductData,
  Product,
  ProductListResponse,
  GetProductsOptions,
} from "../types/interfaces/product.interface";
import { ApiStatus } from "../types";

// Custom hook to get a list of products
export function useProducts(options: GetProductsOptions) {
  return useQuery<ProductListResponse, Error>({
    queryKey: ["products", options],
    queryFn: () => getProducts(options),
  });
}

// Custom hook to get a single product by ID
export function useProduct(id: number, enabled = true) {
  return useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
    enabled: !!id && enabled,
  });
}

export function useSubProducts(id: number, enabled = true) {
    return useQuery({
        queryKey: ["sub-products", id],
        queryFn: () => getSubProducts(id),
        enabled: !!id && enabled,
    });
}

// Custom hook to add a new product
export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddProductData) => addProduct(data),
    onSuccess: (data) => {
      if (data.status === "true") {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
    },
    onError: (error: Error) => {
      //
    },
  });
}

// Custom hook to remove a product by ID
export function useRemoveProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: Error) => {
      //
    },
  });
}

// Custom hook to edit an existing product
export function useEditProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; data: AddProductData }) =>
      editProduct(vars.id, vars.data),
    onSuccess: (data, vars) => {
      if (data.status === "true") {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["product", vars.id] });
      }
    },
    onError: (error: Error, vars) => {
      //
    },
  });
}

// Custom hook to publish a product by ID
export function usePublishProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publishProduct(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error: Error) => {
      //
    },
  });
}