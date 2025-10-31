export interface IMediaFile {
  _id: string;
  filename: string;
  filepath: string;
  size: number;
  mimetype: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IMediaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "packaging" | "product" | "none";
}

export interface IMediaUpload {
  title: string;
  packaging: boolean;
  product: boolean;
  file: File;
}

export interface IMediaFilterType {
  value: "packaging" | "product" | "none";
  label: string;
  extensions: string[];
}

export interface IMediaUploadProgress {
  file: string;
  percent: number;
  status: 'waiting' | 'uploading' | 'completed' | 'failed';
}

export interface IMediaUploadResult {
  summary: {
    total: number;
    uploaded: number;
    failed: number;
  };
  failedFiles: Array<{
    filename: string;
    error: string;
  }>;
}