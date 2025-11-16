import { authorizedGet, authorizedPost, authorizedPut, authorizedDelete } from '../utils/authorizeReq';
import type { AddDetailData, Detail, DetailListResponse, GetDetailsOptions } from '../types/interfaces/details.interface';

const API_URL = import.meta.env.VITE_API_URL;

export const getDetails = (options: GetDetailsOptions): Promise<DetailListResponse> => {
  const queryParams = new URLSearchParams({
    skip: options.skip.toString(),
    limit: options.limit.toString(),
  });
  return authorizedGet<DetailListResponse>(`${API_URL}/details?${queryParams}`);
};

export const getDetail = (id: number): Promise<Detail> => {
  return authorizedGet<Detail>(`${API_URL}/details/${id}`);
};

export const addDetail = (data: AddDetailData): Promise<Detail> => {
  return authorizedPost<Detail>(`${API_URL}/details`, data);
};

export const editDetail = (id: number, data: AddDetailData): Promise<Detail> => {
  return authorizedPut<Detail>(`${API_URL}/details/${id}`, data);
};

export const removeDetail = (id: number): Promise<void> => {
  return authorizedDelete<void>(`${API_URL}/details/${id}`);
};