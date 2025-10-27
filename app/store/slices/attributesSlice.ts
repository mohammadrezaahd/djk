import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ICategoryAttr } from '~/types/interfaces/attributes.interface';

interface AttributesState {
  currentCategoryId: number | null;
  attributesData: ICategoryAttr | null;
  formData: { [key: string]: any };
  loading: boolean;
}

const initialState: AttributesState = {
  currentCategoryId: null,
  attributesData: null,
  formData: {},
  loading: false,
};

const attributesSlice = createSlice({
  name: 'attributes',
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
      
      // اگر دسته‌بندی عوض شده باشد، فرم داده‌ها را پاک کن
      if (state.currentCategoryId !== categoryId) {
        state.formData = {};
        state.currentCategoryId = categoryId;
      }
      
      state.attributesData = data;
      
      // مقداردهی اولیه فرم بر اساس selected values
      if (Object.keys(state.formData).length === 0) {
        const initialFormData: { [key: string]: any } = {};
        
        if (data.category_group_attributes) {
          Object.values(data.category_group_attributes).forEach((categoryData) => {
            Object.values(categoryData.attributes).forEach((attr) => {
              const selectedValues = Object.entries(attr.values)
                .filter(([_, valueData]) => valueData.selected)
                .map(([valueId, _]) => valueId);

              if (selectedValues.length > 0) {
                if (attr.type === 'select') {
                  initialFormData[attr.id] = selectedValues[0];
                } else if (attr.type === 'checkbox') {
                  initialFormData[attr.id] = selectedValues;
                }
              }
            });
          });
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
    
    resetAttributes: (state) => {
      state.currentCategoryId = null;
      state.attributesData = null;
      state.formData = {};
      state.loading = false;
    },
    

  },
});

export const {
  setLoading,
  setAttributesData,
  updateFormField,
  resetAttributes,
} = attributesSlice.actions;

// Selector function برای گرفتن آبجکت نهایی
export const getFinalAttributesObject = (state: { attributes: AttributesState }) => {
  if (!state.attributes.attributesData) return null;
  
  // کپی عمیق از ساختار اصلی
  const finalData = JSON.parse(JSON.stringify(state.attributes.attributesData));
  
  // به‌روزرسانی داده‌ها بر اساس فرم
  if (finalData.category_group_attributes) {
    Object.keys(finalData.category_group_attributes).forEach((categoryId) => {
      const categoryData = finalData.category_group_attributes[categoryId];
      
      Object.keys(categoryData.attributes).forEach((attributeId) => {
        const attr = categoryData.attributes[attributeId];
        const formValue = state.attributes.formData[attr.id];
        
        if (formValue !== undefined && formValue !== null && formValue !== "") {
          switch (attr.type) {
            case 'input':
            case 'text':
              // برای Input و Text، مقدار value را تنظیم می‌کنیم
              attr.value = formValue.toString();
              break;
              
            case 'select':
              // برای Select، فقط گزینه انتخاب شده را نگه می‌داریم
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
              
            case 'checkbox':
              // برای Checkbox، فقط گزینه‌های انتخاب شده را نگه می‌داریم
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
                // اگر هیچ مقداری انتخاب نشده، values را خالی می‌کنیم
                attr.values = {};
              }
              break;
          }
        } else {
          // اگر مقداری وارد نشده، values را خالی می‌کنیم (برای select و checkbox)
          if (attr.type === 'select' || attr.type === 'checkbox') {
            attr.values = {};
          } else if (attr.type === 'input' || attr.type === 'text') {
            attr.value = "";
          }
        }
      });
    });
  }
  
  return finalData;
};

export default attributesSlice.reducer;