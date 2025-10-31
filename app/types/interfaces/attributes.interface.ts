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
  value?: { [valueId: string]: IAttributeValue };
  values: {
    [valueId: string]: IAttributeValue;
  };
  postfix?: string;
  required: boolean;
}

interface ICategoryAttributesMap {
  [attributeId: string]: IAttr;
}

interface ICategoryData {
  attributes: ICategoryAttributesMap;
  group_title: string;
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
}

export interface IGetAttrTemplate extends ITemplateBase {
  data_json: ICategoryAttr;
}
