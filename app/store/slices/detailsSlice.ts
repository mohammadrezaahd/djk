import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";

interface DetailsState {
  currentCategoryId: number | null;
  detailsData: ICategoryDetails | null;
  formData: { [key: string]: any };
}

const initialState: DetailsState = {
  currentCategoryId: null,
  detailsData: null,
  formData: {},
};

const detailsSlice = createSlice({
  name: "details",
  initialState,
  reducers: {
    setDetailsData: (
      state,
      action: PayloadAction<{ categoryId: number; data: ICategoryDetails }>
    ) => {
      const { categoryId, data } = action.payload;

      // اگر دسته‌بندی عوض شده باشد، فرم داده‌ها را پاک کن
      if (state.currentCategoryId !== categoryId) {
        state.formData = {};
        state.currentCategoryId = categoryId;
      }

      state.detailsData = data;

      // مقداردهی اولیه فرم بر اساس category_mefa_type
      if (data.bind?.category_mefa_type && !state.formData.id_type) {
        state.formData.id_type = data.bind.category_mefa_type;
      }
    },

    updateFormField: (
      state,
      action: PayloadAction<{ fieldName: string; value: any }>
    ) => {
      const { fieldName, value } = action.payload;
      state.formData[fieldName] = value;
    },

    resetDetails: (state) => {
      state.currentCategoryId = null;
      state.detailsData = null;
      state.formData = {};
    },
  },
});

export const {
  setDetailsData,
  updateFormField,
  resetDetails,
} = detailsSlice.actions;

// Helper function to transform formData to final data_json structure
export const getFinalDetailsObject = (state: { details: DetailsState }) => {
  if (!state.details.detailsData) return null;

  // Deep clone the original data
  const finalData = JSON.parse(JSON.stringify(state.details.detailsData));
  const formData = state.details.formData;

  // Add static form fields to the root of finalData (excluding title/description which go to IPostTemplateBase)
  const staticFields = [
    "is_fake_product",
    "brand",
    "status",
    "platform",
    "product_class",
    "category_product_type",
    "fake_reason",
    "theme",
    "id_type",
    "general_mefa_id",
    "custom_id",
  ];

  staticFields.forEach((field) => {
    if (
      formData[field] !== undefined &&
      formData[field] !== null &&
      formData[field] !== ""
    ) {
      (finalData as any)[field] = formData[field];
    }
  });

  // Update selected values for dynamic fields in bind
  const bind = finalData.bind;

  if (bind) {
    // Update brands selected
    if (bind.brands && formData.brand) {
      bind.brands.forEach((brand: any) => {
        brand.selected = brand.id === formData.brand;
      });
    }

    // Update statuses selected
    if (bind.statuses && formData.status) {
      bind.statuses.forEach((status: any) => {
        status.selected = status.value === formData.status;
      });
    }

    // Update platforms selected
    if (bind.platforms && formData.platform) {
      bind.platforms.forEach((platform: any) => {
        platform.selected = platform.value === formData.platform;
      });
    }

    // Update product_classes selected
    if (bind.product_classes && formData.product_class) {
      bind.product_classes.forEach((productClass: any) => {
        productClass.selected = productClass.value === formData.product_class;
      });
    }

    // Update category_product_types selected
    if (bind.category_product_types && formData.category_product_type) {
      bind.category_product_types.forEach((cpt: any) => {
        cpt.selected = cpt.value === formData.category_product_type;
      });
    }

    // Update fake_reasons selected (special case: text field matches form value)
    if (bind.fake_reasons && formData.fake_reason) {
      bind.fake_reasons.forEach((reason: any) => {
        reason.selected = reason.text.toString() === formData.fake_reason;
      });
    }

    // Update themes selected in category_data
    if (bind.category_data?.themes && formData.theme) {
      bind.category_data.themes.forEach((theme: any) => {
        theme.selected = theme.id.toString() === formData.theme;
      });
    }

    // Update general_mefa selected
    if (bind.general_mefa && formData.general_mefa_id) {
      Object.keys(bind.general_mefa).forEach((key) => {
        bind.general_mefa[key].selected = key === formData.general_mefa_id;
      });
    }
  }

  return finalData;
};

export default detailsSlice.reducer;
