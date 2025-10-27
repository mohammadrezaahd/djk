import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ICategoryDetails } from '~/types/interfaces/details.interface';

interface DetailsState {
  currentCategoryId: number | null;
  detailsData: ICategoryDetails | null;
  formData: { [key: string]: any };
  loading: boolean;
}

const initialState: DetailsState = {
  currentCategoryId: null,
  detailsData: null,
  formData: {},
  loading: false,
};

const detailsSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
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
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setDetailsData,
  updateFormField,
  resetDetails,
} = detailsSlice.actions;

export default detailsSlice.reducer;