import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";

interface AttributesState {
  currentCategoryId: number | null;
  attributesData: ICategoryAttr | null;
  formData: { [key: string]: any };
  title: string;
  description: string;
  loading: boolean;
}

const initialState: AttributesState = {
  currentCategoryId: null,
  attributesData: null,
  formData: {},
  title: "",
  description: "",
  loading: false,
};

const attributesSlice = createSlice({
  name: "attributes",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

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

    resetAttributes: (state) => {
      state.currentCategoryId = null;
      state.attributesData = null;
      state.formData = {};
      state.title = "";
      state.description = "";
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setAttributesData,
  updateFormField,
  setTitle,
  setDescription,
  resetAttributes,
} = attributesSlice.actions;

export const getFinalAttributesObject = (state: {
  attributes: AttributesState;
}) => {
  if (!state.attributes.attributesData) return null;

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
            case "text":
              attr.value = formValue.toString();
              break;

            case "select":
              if (formValue && attr.values[formValue]) {
                const selectedValue = attr.values[formValue];
                attr.values = {
                  [formValue]: {
                    ...selectedValue,
                    selected: true,
                  },
                };
              }
              break;

            case "checkbox":
              if (Array.isArray(formValue) && formValue.length > 0) {
                const newValues: any = {};
                formValue.forEach((valueId: string) => {
                  if (attr.values[valueId]) {
                    newValues[valueId] = {
                      ...attr.values[valueId],
                      selected: true,
                    };
                  }
                });
                attr.values = newValues;
              } else {
                attr.values = {};
              }
              break;
          }
        } else {
          if (attr.type === "select" || attr.type === "checkbox") {
            attr.values = {};
          } else if (attr.type === "input" || attr.type === "text") {
            attr.value = "";
          }
        }
      });
    });
  }

  return finalData;
};

export default attributesSlice.reducer;
