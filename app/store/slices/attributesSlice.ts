import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import { attrsApi } from "~/api/attributes.api";
import type { IPostAttr } from "~/types/dtos/attributes.dto";
import { processAndConvertToJSON } from "~/utils/dataProcessor";

interface AttributesState {
  currentCategoryId: number | null;
  attributesData: ICategoryAttr | null;
  formData: { [key: string]: any };
  title: string;
  description: string;
  loading: boolean;
  saving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
}

const initialState: AttributesState = {
  currentCategoryId: null,
  attributesData: null,
  formData: {},
  title: "",
  description: "",
  loading: false,
  saving: false,
  saveSuccess: false,
  saveError: null,
};

const attributesSlice = createSlice({
  name: "attributes",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.saving = action.payload;
    },
    
    setSaveSuccess: (state, action: PayloadAction<boolean>) => {
      state.saveSuccess = action.payload;
      if (action.payload) {
        state.saveError = null;
      }
    },
    
    setSaveError: (state, action: PayloadAction<string | null>) => {
      state.saveError = action.payload;
      if (action.payload) {
        state.saveSuccess = false;
      }
    },
    
    clearSaveStatus: (state) => {
      state.saveSuccess = false;
      state.saveError = null;
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
      state.saving = false;
      state.saveSuccess = false;
      state.saveError = null;
    },
  },
});

export const {
  setLoading,
  setSaving,
  setSaveSuccess,
  setSaveError,
  clearSaveStatus,
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

  return finalData;
};

// Async thunk for saving attributes
export const saveAttributes = (categoryId: number, enqueueSnackbar: any, images: number[] = []) => 
  async (dispatch: any, getState: any) => {
    dispatch(setSaving(true));
    dispatch(clearSaveStatus());

    try {
      const state = getState();
      const attributesState = state.attributes;
      
      // Validate required fields
      if (!attributesState.title || attributesState.title.trim() === '') {
        throw new Error('عنوان قالب الزامی است');
      }

      const finalAttributesData = getFinalAttributesObject(state);
      
      if (!finalAttributesData) {
        throw new Error('اطلاعات قالب در دسترس نیست');
      }

      // Process the data using existing processor
      const processedJSON = processAndConvertToJSON(
        finalAttributesData,
        attributesState.formData
      );

      const postData: IPostAttr = {
        title: attributesState.title.trim(),
        description: attributesState.description?.trim() || undefined,
        category_id: categoryId,
        data_json: JSON.parse(processedJSON),
        images,
        source: 'app' as const,
      };

      const result = await attrsApi.addNewAttr(postData);
      
      if (result.status === 'true') {
        dispatch(setSaveSuccess(true));
        enqueueSnackbar('قالب ویژگی با موفقیت ذخیره شد', { variant: 'success' });
        return result.data;
      } else {
        throw new Error('خطا در ذخیره ویژگی‌ها');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'خطا در ذخیره ویژگی‌ها';
      dispatch(setSaveError(errorMessage));
      enqueueSnackbar(`خطا: ${errorMessage}`, { variant: 'error' });
      throw error;
    } finally {
      dispatch(setSaving(false));
    }
  };

export default attributesSlice.reducer;
