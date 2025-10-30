import type { TemplateSource } from "../dtos/templates.dto";

export interface ITemplateList {
  id: number;
  title: string;
  category_id: number;
  source: TemplateSource;
}
