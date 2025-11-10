import type { IPostProduct } from "../dtos/product.dto";
import type { TemplateSource } from "../dtos/templates.dto";

export interface IProductList {
  id: number;
  title: string;
  category_id: number;
  user_status: ProductStatus;
  user_status_text: string;
  source: TemplateSource;
}

export interface IGetProduct extends IPostProduct {
  id: number;
  user_status: ProductStatus;
  user_status_text: string;
}

export enum ProductStatus {
  PENDING = 0,
  WAITING_FOR_APPROVAL = 1,
  QUEUED = 2,
  PROCESSING = 3,
  COMPLETED = 4,
}
// export enum ProductStatusText {
//   PENDING = "در انتظار انتشار",
//   WAITING_FOR_APPROVAL = "در انتظار تایید",
//   QUEUED = "در صف",
//   PROCESSING = "در حال پردازش",
//   COMPLETED = "تکمیل شده",
// }
