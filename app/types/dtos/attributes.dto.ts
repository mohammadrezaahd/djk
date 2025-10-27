import type { ICategoryAttr } from "../interfaces/attributes.interface";

export interface  IPostAttr {
  title: string;
  description?: string;
  category_id: number;
  data_json: ICategoryAttr;
  images: number[];
  source: "app";
  tag?: string;
}
