import { authorizedGet, authorizedPost, authorizedPut, authorizedDelete } from '../utils/authorizeReq';
import type { GalleryResponse, UpdateFileData, GetGalleryOptions } from '../types/interfaces/gallery.interface';

const API_URL = 'http://localhost:8000/api';

export const getGallery = (options: GetGalleryOptions): Promise<GalleryResponse> => {
  const queryParams = new URLSearchParams({
    skip: options.skip.toString(),
    limit: options.limit.toString(),
    search: options.search || '',
  });
  return authorizedGet<GalleryResponse>(`${API_URL}/gallery?${queryParams}`);
};

export const getImage = (id: number): Promise<any> => {
    return authorizedGet<any>(`${API_URL}/gallery/${id}`);
};

export const getImagesByIds = (ids: number[]): Promise<GalleryResponse> => {
    const queryParams = new URLSearchParams({
        ids: ids.join(','),
    });
    return authorizedGet<GalleryResponse>(`${API_URL}/gallery/by-ids?${queryParams}`);
};

export const uploadFile = (file: File, data?: UpdateFileData): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    if (data) {
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value.toString());
        });
    }
    return authorizedPost(`${API_URL}/gallery/upload`, formData);
};

export const updateFile = (id: number, data: UpdateFileData): Promise<any> => {
    return authorizedPut(`${API_URL}/gallery/${id}`, data);
};

export const deleteFile = (id: number): Promise<any> => {
    return authorizedDelete(`${API_URL}/gallery/${id}`);
};