import type { ICategoryAttr } from "../interfaces/attributes.interface";
import type { IPostTemplateBase } from "./templates.dto";

export interface IPostAttr extends IPostTemplateBase {
  data_json: ICategoryAttr;
}
