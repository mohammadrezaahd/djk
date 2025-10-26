export interface ICategoryDetails {
  bind: IDetailsBind;
  errors?: any;
  isValid: boolean;
}

export interface IDetailsBind {
  brands: IBindBrand[];
  statuses: IBindStatus[];
  divisions: any[];
  guideline: IBindGL;
  platforms: IBindPlatforms[];
  allow_fake: boolean;
  show_colors: boolean;
  fake_reasons: IBindFakeReason[];
  general_mefa: { [key: string]: IBindGM };
  category_data: any;
  brand_other_id: number;
  dimension_level: "product";
  product_classes: IBindProductClass[];
  dimension_config?: any;
  category_mefa_type: "general";
  category_product_types: IBindCPT[];
}

export interface IBindBrand {
  id: string;
  text: string;
  logo_id: string;
  title_en: string;
  title_fa: string;
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
