import type { TemplateSource } from "./templates.dto";

export interface IPostImage {
  title: string;
  packaging: boolean;
  product: boolean;
  source: TemplateSource;
  tag: string;
  file: File;
}
