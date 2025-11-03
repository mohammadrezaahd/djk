import type { ICategoryAttr } from "./../interfaces/attributes.interface";
import type { ICategoryDetails } from "../interfaces/details.interface";
import type { TemplateSource } from "./templates.dto";

export interface IPostProduct {
  title: string;
  description?: string;
  category_id: number;
  details: { list: ICategoryDetails[] };
  attributes: { list: ICategoryAttr[] };
  variant_data: { [key: string]: any };
  images: string[];
  source: TemplateSource;
  tag: string;
}
