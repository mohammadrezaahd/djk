// API Status enum that maps string values to boolean meanings
export enum ApiStatus {
  SUCCEEDED = "true", // Maps to boolean true
  FAILED = "false", // Maps to boolean false
}

export interface ApiResponseData<T = any> {
  status: ApiStatus;
  code: 200 | 201 | 400 | 401 | 403 | 404 | 500;
  message?: string;
  error?: string;
  data?: T;
  meta_data?: IMetaData;
}

export type ApiResponse<T = any> = Promise<ApiResponseData<T>>;

export interface IMetaData {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
