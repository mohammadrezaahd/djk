import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { IPostAttr } from "~/types/dtos/attributes.dto";
import { TemplateSource } from "~/types/dtos/templates.dto";

interface AttributesState {
  currentCategoryId: number | null;
  attributesData: ICategoryAttr | null;
  formData: { [key: string]: any };
  title: string;
  description: string;
  images: number[];
}

const initialState: AttributesState = {
  currentCategoryId: null,
  attributesData: null,
  formData: {},
  title: "",
  description: "",
  images: [],
};

const attributesSlice = createSlice({
  name: "attributes",
  initialState,
  reducers: {
    setAttributesData: (
      state,
      action: PayloadAction<{ categoryId: number; data: ICategoryAttr }>
    ) => {
      const { categoryId, data } = action.payload;

      // Clear form on category change
      if (state.currentCategoryId !== categoryId) {
        state.formData = {};
        state.currentCategoryId = categoryId;
      }

      state.attributesData = data;

      if (Object.keys(state.formData).length === 0) {
        const initialFormData: { [key: string]: any } = {};

        if (data.category_group_attributes) {
          Object.values(data.category_group_attributes).forEach(
            (categoryData) => {
              Object.values(categoryData.attributes).forEach((attr) => {
                const selectedValues = Object.entries(attr.values)
                  .filter(([_, valueData]) => valueData.selected)
                  .map(([valueId, _]) => valueId);

                if (selectedValues.length > 0) {
                  if (attr.type === "select") {
                    initialFormData[attr.id] = selectedValues[0];
                  } else if (attr.type === "checkbox") {
                    initialFormData[attr.id] = selectedValues;
                  }
                }
              });
            }
          );
        }

        state.formData = initialFormData;
      }
    },

    updateFormField: (
      state,
      action: PayloadAction<{ fieldId: string; value: any }>
    ) => {
      const { fieldId, value } = action.payload;
      state.formData[fieldId] = value;
    },

    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },

    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },

    setImages: (state, action: PayloadAction<number[]>) => {
      state.images = action.payload;
    },

    resetAttributes: (state) => {
      state.currentCategoryId = null;
      state.attributesData = null;
      state.formData = {};
      state.title = "";
      state.description = "";
      state.images = [];
    },

    loadTemplateData: (
      state,
      action: PayloadAction<{
        templateData: any;
        title: string;
        description?: string;
        images?: number[];
      }>
    ) => {
      const { templateData, title, description, images } = action.payload;
      
      // Set basic template info
      state.title = title;
      state.description = description || "";
      state.images = images || [];

      // Extract form data from template
      const formData: { [key: string]: any } = {};
      
      if (templateData?.category_group_attributes) {
        Object.values(templateData.category_group_attributes).forEach(
          (categoryData: any) => {
            Object.values(categoryData.attributes).forEach((attr: any) => {
              if (attr.value !== undefined && attr.value !== null && attr.value !== "") {
                // برای text fields
                if (attr.type === 'text') {
                  if (typeof attr.value === 'object' && attr.value.text_lines) {
                    // اگر به صورت آرایه ذخیره شده
                    formData[attr.id] = attr.value.text_lines.join('\n');
                  } else if (typeof attr.value === 'object' && attr.value.original_text) {
                    // اگر متن اصلی ذخیره شده
                    formData[attr.id] = attr.value.original_text;
                  } else if (typeof attr.value === 'string') {
                    // اگر به صورت متن ساده ذخیره شده
                    formData[attr.id] = attr.value;
                  }
                }
                // برای input fields
                else if (attr.type === 'input') {
                  formData[attr.id] = attr.value;
                }
                // برای select fields
                else if (attr.type === 'select') {
                  const selectedValues = Object.entries(attr.values)
                    .filter(([_, valueData]: [string, any]) => valueData.selected)
                    .map(([valueId, _]) => valueId);
                  if (selectedValues.length > 0) {
                    formData[attr.id] = selectedValues[0];
                  }
                }
                // برای checkbox fields
                else if (attr.type === 'checkbox') {
                  const selectedValues = Object.entries(attr.values)
                    .filter(([_, valueData]: [string, any]) => valueData.selected)
                    .map(([valueId, _]) => valueId);
                  if (selectedValues.length > 0) {
                    formData[attr.id] = selectedValues;
                  }
                }
              }
            });
          }
        );
      }
      
      state.formData = formData;
    },
  },
});

export const {
  setAttributesData,
  updateFormField,
  setTitle,
  setDescription,
  setImages,
  resetAttributes,
  loadTemplateData,
} = attributesSlice.actions;

export const getFinalAttributesObject = (state: {
  attributes: AttributesState;
}): IPostAttr | null => {
  if (!state.attributes.attributesData || !state.attributes.currentCategoryId) return null;

  const finalData = JSON.parse(JSON.stringify(state.attributes.attributesData));

  if (finalData.category_group_attributes) {
    Object.keys(finalData.category_group_attributes).forEach((categoryId) => {
      const categoryData = finalData.category_group_attributes[categoryId];

      Object.keys(categoryData.attributes).forEach((attributeId) => {
        const attr = categoryData.attributes[attributeId];
        const formValue = state.attributes.formData[attr.id];

        if (formValue !== undefined && formValue !== null && formValue !== "") {
          switch (attr.type) {
            case "input":
              attr.value = formValue.toString();
              break;

            case "text":
              // ذخیره متن به صورت ساختاریافته برای نمایش بهتر
              const lines = formValue.toString().split('\n').filter((line: string) => line.trim() !== '');
              attr.value = {
                text_lines: lines,
                original_text: formValue.toString()
              };
              break;

            case "select":
              // Reset all selected states first
              Object.keys(attr.values).forEach((valueId) => {
                attr.values[valueId].selected = false;
              });
              
              // Set the selected value
              if (formValue && attr.values[formValue]) {
                attr.values[formValue].selected = true;
              }
              break;

            case "checkbox":
              // Reset all selected states first
              Object.keys(attr.values).forEach((valueId) => {
                attr.values[valueId].selected = false;
              });
              
              // Set selected values
              if (Array.isArray(formValue) && formValue.length > 0) {
                formValue.forEach((valueId: string) => {
                  if (attr.values[valueId]) {
                    attr.values[valueId].selected = true;
                  }
                });
              }
              break;
          }
        } else {
          // Reset selection state for select/checkbox when no value is set
          if (attr.type === "select" || attr.type === "checkbox") {
            Object.keys(attr.values).forEach((valueId) => {
              attr.values[valueId].selected = false;
            });
          } else if (attr.type === "input" || attr.type === "text") {
            attr.value = "";
          }
        }
      });
    });
  }

  // Return IPostAttr object
  return {
    title: state.attributes.title.trim(),
    description: state.attributes.description?.trim() || undefined,
    category_id: state.attributes.currentCategoryId,
    data_json: finalData,
    images: state.attributes.images,
    source: TemplateSource.App,
  };
};

export default attributesSlice.reducer;
