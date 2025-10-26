import type { ICategoryAttr } from "./attributes.interface";
import type { ICategoryDetails } from "./details.interface";

export interface ICategoryList {
  id: number;
  title: string;
  parent_id: number;
}

export interface ICategory {
  attributes: ICategoryAttr;
  details: ICategoryDetails;
}
