import type { ITemplateBase } from "./templates.interface";

export interface ICategoryDetails {
  bind: IDetailsBind;
  errors?: any;
  isValid: boolean;
  isFake: boolean;
  // Static form fields (not in IPostTemplateBase)
  is_fake_product?: boolean;
  brand?: string;
  status?: string;
  platform?: string;
  product_class?: string;
  category_product_type?: string;
  fake_reason?: string;
  theme?: string;
  id_type?: "general" | "custom";
  general_mefa_id?: string;
  custom_id?: string;
}

export interface IDetailsBind {
  brands: IBindBrand[];
  divisions: any[];
  allow_fake: boolean;
  show_colors: boolean;
  general_mefa: { [key: string]: IBindGM };
  brand_other_id: number;
  category_product_types: IBindCPT[];
  brand_model: IStringField;
  statuses?: IBindStatus[];
  platforms?: IBindPlatforms[];
  product_classes?: IBindProductClass[];
  fake_reasons?: IBindFakeReason[];
  category_mefa_type?: any;
}

export interface IBindBrand {
  id: string;
  text: string;
  logo_id: string;
  title_en: string;
  title_fa: string;
  selected: boolean;
}

export interface IBindStatus {
  text: string;
  value: string;
  selected: boolean;
}

export interface IBindGL {
  media: IGLMedia;
  attributes: { items: IGLAttrs[] };
  product_info: { items: IGLProductInfo[] };
  category_selection: IGLCategorySelection;
}

export interface IBindPlatforms {
  text: string;
  value: string;
  selected: boolean;
}

export interface IBindFakeReason {
  text: number;
  value: string;
}

export interface IBindGM {
  text: string;
  value: number;
  general_id: string;
}

export interface IBindCatData {
  themes: ICDThemes[];
  categoryTheme: string;
  categoryTitle: string;
  categoryThemeTranslated: string;
}

export interface IBindProductClass {
  text: string;
  value: string;
}

export interface IBindCPT {
  text: string;
  value: string;
}

// Guide Line
export interface IGLCategorySelection {
  video: any;
  short_description: string;
}

export interface IGLProductInfo {
  title: string;
  content: string;
}

export interface IGLMedia {
  items: IGLMediaItems[];
  video?: any;
  short_description: string;
}

export interface IGLAttrs extends IGLProductInfo {}
export interface IGLMediaItems extends IGLProductInfo {}

// Category Data

export interface ICDThemes {
  id: number;
  labeel: string;
  active: boolean;
  themeType: "colored";
}

export interface IGetDetailTemplate extends ITemplateBase {
  data_json: ICategoryDetails;
}

// Fields

export enum FieldType {
  String = "string",
  Number = "number",
  List = "list",
}

export interface IStringField {
  type: FieldType.String;
  require: boolean;
  value?: string;
}

export interface INumberField {
  type: FieldType.Number;
  require: boolean;
  value?: number;
}

export interface IListField {
  type: FieldType.List;
  require: boolean;
  value?: string[];
}
