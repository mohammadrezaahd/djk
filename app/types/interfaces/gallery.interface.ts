import type { TemplateSource } from "../dtos/templates.dto";

export interface IGallery {
  id: number;
  title: string;
  image_url: string;
  source: TemplateSource;
  dimensions: string;
  size: string;
  packaging?: boolean;
  product?: boolean;
}
