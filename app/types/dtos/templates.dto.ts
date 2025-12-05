export interface IPostTemplateBase {
  title: string;
  description?: string;
  category_id: number;
  data_json: unknown;
  images: number[];
  source: TemplateSource;
  tag?: string;
}

export enum TemplateSource {
  App = "bulk",
  Quick = "quick",
  Transfer = "transfer",
}
