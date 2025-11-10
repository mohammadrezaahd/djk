import type { TemplateSource } from "../dtos/templates.dto";

export interface ITemplateList {
  id: number;
  title: string;
  category_id: number;
  category_title: string;
  source: TemplateSource;
}

export interface ITemplateBase {
  id: number;
  title: string;
  description?: string;
  images: number[];
  category_id: number;
}
