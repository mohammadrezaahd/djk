// API Status enum that maps string values to boolean meanings
export enum ApiStatus {
  TRUE = "true", // Maps to boolean true
  FALSE = "false", // Maps to boolean false
}

export interface ApiResponse<T = any> {
  status: ApiStatus;
  code: 200 | 201 | 400 | 401 | 403 | 404 | 500;
  message?: string;
  error?: string;
  data?: T;
  meta_data?: IMetaData;
}

// Define pagination info for list responses
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ListApiResponse<T = any> {
  status: ApiStatus | "true" | "false";
  code: 200 | 201 | 400 | 401 | 403 | 404 | 500;
  message?: string;
  error?: string;
  data?: T[];
  meta_data?: string | PaginationMeta;
}
export interface IMetaData {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
