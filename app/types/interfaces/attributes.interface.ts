import type { ITemplateBase } from "./templates.interface";

export interface ICategoryAttr {
  has_height: boolean;
  weight_attribute: boolean;
  attribute_dimensions?: string;
  dimensions_attribute: boolean;
  weight_attribute_hint: string;
  old_attribute_dimensions?: string;
  weight_attribute_postfix?: string;
  weight_attribute_reasons: boolean;
  category_group_attributes: ICategoryGroupAttr;
  dimensions_attribute_hint: string;
  weight_attribute_required: boolean;
  weight_attribute_multiplier?: number;
  dimensions_attribute_postfix?: string;
  dimensions_attribute_required: boolean;
  dimension_attribute_multiplier: number;
}

export interface IAttr {
  id: number;
  code?: string;
  hint: string;
  type: AttributeType;
  unit?: string;
  title: string;
  value?:
    | string
    | number
    | { text_lines?: string[]; original_text?: string }
    | { [valueId: string]: IAttributeValue };
  values: {
    [valueId: string]: IAttributeValue;
  };
  postfix?: string;
  required: boolean;
  in_title: boolean;
  suggest_values:
    | {
        [valueId: string]: IAttributeValue;
      }
    | string;
  Ai: boolean;
}

interface ICategoryAttributesMap {
  [attributeId: string]: IAttr;
}

interface ICategoryData {
  attributes: ICategoryAttributesMap;
  group_title: string;
}

export enum StaticCategoryIds {
  // Packaging Dimensions
  PackageWidth = "package_width",
  PackageHeight = "package_height",
  PackageLength = "package_length",
  PackageWeight = "package_weight",

  // Product Details
  Advantage = "advantage",
  Disadvantages = "disadvantages",
  Description = "description",

  // Categories
  Divisions = "divisions",
  CategoryProductType = "category_product_type",
}

interface ICategoryGroupAttr {
  [categoryId: string]: ICategoryData;
}

export interface IAttributeValue {
  code?: string;
  text: string;
  selected: boolean;
}

export enum AttributeType {
  Input = "input",
  Select = "select",
  Checkbox = "checkbox",
  Text = "text",
  MultiText = "multi_text",
}

export interface IGetAttrTemplate extends ITemplateBase {
  data_json: ICategoryAttr;
}
