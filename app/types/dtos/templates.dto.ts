export interface IPostTemplateBase {
  title: string;
  description?: string;
  category_id: number;
  data_json: unknown;
  images: number[];
  source: "app";
  tag?: string;
}
