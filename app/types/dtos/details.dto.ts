import type { ICategoryDetails } from "../interfaces/details.interface";
import type { IPostTemplateBase } from "./templates.dto";

export interface IPostDetail extends IPostTemplateBase {
  data_json: ICategoryDetails;
  
}
