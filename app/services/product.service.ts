import { authorizedGet, authorizedPost, authorizedPut, authorizedDelete } from '../utils/authorizeReq';
import type { AddProductData, Product, ProductListResponse, GetProductsOptions } from '../types/interfaces/product.interface';

const API_URL = 'http://localhost:8000/api';

export const getProducts = (options: GetProductsOptions): Promise<ProductListResponse> => {
  const queryParams = new URLSearchParams({
    skip: options.skip.toString(),
    limit: options.limit.toString(),
  });
  return authorizedGet<ProductListResponse>(`${API_URL}/products?${queryParams}`);
};

export const getProduct = (id: number): Promise<Product> => {
  return authorizedGet<Product>(`${API_URL}/products/${id}`);
};

export const getSubProducts = (id: number): Promise<any> => {
    return authorizedGet<any>(`${API_URL}/products/${id}/sub-products`);
};

export const addProduct = (data: AddProductData): Promise<Product> => {
  return authorizedPost<Product>(`${API_URL}/products`, data);
};

export const editProduct = (id: number, data: AddProductData): Promise<Product> => {
  return authorizedPut<Product>(`${API_URL}/products/${id}`, data);
};

export const removeProduct = (id: number): Promise<void> => {
  return authorizedDelete<void>(`${API_URL}/products/${id}`);
};

export const publishProduct = (id: number): Promise<void> => {
    return authorizedPost<void>(`${API_URL}/products/${id}/publish`, {});
};