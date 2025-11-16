import { authorizedGet, authorizedPost, authorizedPut, authorizedDelete } from '../utils/authorizeReq';
import type { AddAttributeData, Attribute, AttributeListResponse, GetAttributesOptions } from '../types/interfaces/attributes.interface';

const API_URL = import.meta.env.VITE_API_URL;

export const getAttributes = (options: GetAttributesOptions): Promise<AttributeListResponse> => {
  const queryParams = new URLSearchParams({
    skip: options.skip.toString(),
    limit: options.limit.toString(),
  });
  return authorizedGet<AttributeListResponse>(`${API_URL}/attributes?${queryParams}`);
};

export const getAttribute = (id: number): Promise<Attribute> => {
  return authorizedGet<Attribute>(`${API_URL}/attributes/${id}`);
};

export const addAttribute = (data: AddAttributeData): Promise<Attribute> => {
  return authorizedPost<Attribute>(`${API_URL}/attributes`, data);
};

export const editAttribute = (id: number, data: AddAttributeData): Promise<Attribute> => {
  return authorizedPut<Attribute>(`${API_URL}/attributes/${id}`, data);
};

export const removeAttr = (id: number): Promise<void> => {
  return authorizedDelete<void>(`${API_URL}/attributes/${id}`);
};