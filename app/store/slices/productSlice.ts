import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "../types";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { IPostProduct } from "~/types/dtos/product.dto";
import type { ITemplateList } from "~/types/interfaces/templates.interface";
import { TemplateSource } from "~/types/dtos/templates.dto";

export interface SelectedTemplate {
  id: number;
  title: string;
  data: ICategoryDetails | ICategoryAttr;
  formData: { [key: string]: any };
}

export enum FormStep {
  CATEGORY_SELECTION = "category_selection",
  DETAILS_SELECTION = "details_selection", 
  DETAILS_FORM = "details_form",
  ATTRIBUTES_SELECTION = "attributes_selection",
  ATTRIBUTES_FORM = "attributes_form",
  IMAGE_SELECTION = "image_selection",
  PRODUCT_INFO = "product_info"
}

interface ProductState {
  currentStep: FormStep;
  selectedCategoryId: number | null;
  
  // Details step
  availableDetailsTemplates: ITemplateList[];
  selectedDetailsTemplates: SelectedTemplate[];
  activeDetailsTemplateIndex: number;
  
  // Attributes step  
  availableAttributesTemplates: ITemplateList[];
  selectedAttributesTemplates: SelectedTemplate[];
  activeAttributesTemplateIndex: number;
  
  // Images step
  selectedImages: number[];
  
  // Final product data
  productTitle: string;
  productDescription: string;
  finalProductData: IPostProduct | null;
  
  // Validation state
  stepValidationErrors: {
    [FormStep.DETAILS_FORM]: boolean;
    [FormStep.ATTRIBUTES_FORM]: boolean;
    [FormStep.IMAGE_SELECTION]: boolean;
    [FormStep.PRODUCT_INFO]: boolean;
  };
}

const initialState: ProductState = {
  currentStep: FormStep.CATEGORY_SELECTION,
  selectedCategoryId: null,
  
  availableDetailsTemplates: [],
  selectedDetailsTemplates: [],
  activeDetailsTemplateIndex: 0,
  
  availableAttributesTemplates: [],
  selectedAttributesTemplates: [],
  activeAttributesTemplateIndex: 0,
  
  selectedImages: [],
  
  productTitle: "",
  productDescription: "",
  finalProductData: null,
  
  stepValidationErrors: {
    [FormStep.DETAILS_FORM]: false,
    [FormStep.ATTRIBUTES_FORM]: false,
    [FormStep.IMAGE_SELECTION]: false,
    [FormStep.PRODUCT_INFO]: false,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<FormStep>) => {
      state.currentStep = action.payload;
    },

    setSelectedCategory: (state, action: PayloadAction<number>) => {
      // Reset all data when category changes
      state.selectedCategoryId = action.payload;
      state.availableDetailsTemplates = [];
      state.selectedDetailsTemplates = [];
      state.activeDetailsTemplateIndex = 0;
      state.availableAttributesTemplates = [];
      state.selectedAttributesTemplates = [];
      state.activeAttributesTemplateIndex = 0;
      state.productTitle = "";
      state.productDescription = "";
      state.finalProductData = null;
    },

    // Details management
    setAvailableDetailsTemplates: (state, action: PayloadAction<ITemplateList[]>) => {
      state.availableDetailsTemplates = action.payload;
    },

    addDetailsTemplate: (state, action: PayloadAction<{ template: ITemplateList; data: ICategoryDetails }>) => {
      const { template, data } = action.payload;
      
      // Check if template is already selected
      const exists = state.selectedDetailsTemplates.find(t => t.id === template.id);
      if (!exists) {
        state.selectedDetailsTemplates.push({
          id: template.id,
          title: template.title,
          data,
          formData: {}
        });
      }
    },

    removeDetailsTemplate: (state, action: PayloadAction<number>) => {
      const templateId = action.payload;
      state.selectedDetailsTemplates = state.selectedDetailsTemplates.filter(t => t.id !== templateId);
      
      // Adjust active index if needed
      if (state.activeDetailsTemplateIndex >= state.selectedDetailsTemplates.length) {
        state.activeDetailsTemplateIndex = Math.max(0, state.selectedDetailsTemplates.length - 1);
      }
    },

    setActiveDetailsTemplateIndex: (state, action: PayloadAction<number>) => {
      state.activeDetailsTemplateIndex = action.payload;
    },

    updateDetailsTemplateFormData: (state, action: PayloadAction<{ templateIndex: number; fieldName: string; value: any }>) => {
      const { templateIndex, fieldName, value } = action.payload;
      if (state.selectedDetailsTemplates[templateIndex]) {
        state.selectedDetailsTemplates[templateIndex].formData[fieldName] = value;
      }
    },

    // Attributes management
    setAvailableAttributesTemplates: (state, action: PayloadAction<ITemplateList[]>) => {
      state.availableAttributesTemplates = action.payload;
    },

    addAttributesTemplate: (state, action: PayloadAction<{ template: ITemplateList; data: ICategoryAttr }>) => {
      const { template, data } = action.payload;
      
      // Check if template is already selected
      const exists = state.selectedAttributesTemplates.find(t => t.id === template.id);
      if (!exists) {
        // Extract initial form data from template
        const initialFormData: { [key: string]: any } = {};
        
        if (data?.category_group_attributes) {
          Object.values(data.category_group_attributes).forEach((categoryData: any) => {
            Object.values(categoryData.attributes).forEach((attr: any) => {
              // استفاده از code برای فیلدهای خاص، در غیر این صورت id را به string تبدیل می‌کنیم
              const fieldKey = attr.code || attr.id.toString();
              
              // برای text fields
              if (attr.type === 'text') {
                if (attr.value !== undefined && attr.value !== null && attr.value !== "") {
                  if (typeof attr.value === 'object' && attr.value.text_lines) {
                    initialFormData[fieldKey] = attr.value.text_lines.join('\n');
                  } else if (typeof attr.value === 'object' && attr.value.original_text) {
                    initialFormData[fieldKey] = attr.value.original_text;
                  } else if (typeof attr.value === 'string') {
                    initialFormData[fieldKey] = attr.value;
                  }
                } else {
                  initialFormData[fieldKey] = "";
                }
              }
              // برای input fields
              else if (attr.type === 'input') {
                initialFormData[fieldKey] = attr.value !== undefined && attr.value !== null ? attr.value : "";
              }
              // برای select fields
              else if (attr.type === 'select') {
                const selectedValues = Object.entries(attr.values)
                  .filter(([_, valueData]: [string, any]) => valueData.selected)
                  .map(([valueId, _]) => valueId);
                if (selectedValues.length > 0) {
                  initialFormData[fieldKey] = selectedValues[0];
                } else {
                  initialFormData[fieldKey] = "";
                }
              }
              // برای checkbox fields
              else if (attr.type === 'checkbox') {
                const selectedValues = Object.entries(attr.values)
                  .filter(([_, valueData]: [string, any]) => valueData.selected)
                  .map(([valueId, _]) => valueId);
                initialFormData[fieldKey] = selectedValues.length > 0 ? selectedValues : [];
              }
            });
          });
        }
        
        state.selectedAttributesTemplates.push({
          id: template.id,
          title: template.title,
          data,
          formData: initialFormData
        });
      }
    },

    removeAttributesTemplate: (state, action: PayloadAction<number>) => {
      const templateId = action.payload;
      state.selectedAttributesTemplates = state.selectedAttributesTemplates.filter(t => t.id !== templateId);
      
      // Adjust active index if needed
      if (state.activeAttributesTemplateIndex >= state.selectedAttributesTemplates.length) {
        state.activeAttributesTemplateIndex = Math.max(0, state.selectedAttributesTemplates.length - 1);
      }
    },

    setActiveAttributesTemplateIndex: (state, action: PayloadAction<number>) => {
      state.activeAttributesTemplateIndex = action.payload;
    },

    updateAttributesTemplateFormData: (state, action: PayloadAction<{ templateIndex: number; fieldId: string; value: any }>) => {
      const { templateIndex, fieldId, value } = action.payload;
      if (state.selectedAttributesTemplates[templateIndex]) {
        state.selectedAttributesTemplates[templateIndex].formData[fieldId] = value;
      }
    },

    // Product info
    setProductTitle: (state, action: PayloadAction<string>) => {
      state.productTitle = action.payload;
    },

    setProductDescription: (state, action: PayloadAction<string>) => {
      state.productDescription = action.payload;
    },

    // Images management
    setSelectedImages: (state, action: PayloadAction<number[]>) => {
      state.selectedImages = action.payload;
    },

    // Update selected template data  
    updateSelectedTemplateData: (state, action: PayloadAction<{ templateId: number; data: ICategoryDetails | ICategoryAttr; type: 'details' | 'attributes' }>) => {
      const { templateId, data, type } = action.payload;
      
      if (type === 'details') {
        const template = state.selectedDetailsTemplates.find(t => t.id === templateId);
        if (template) {
          template.data = data as ICategoryDetails;
          
          // Initialize form data with default values from the template
          const templateData = data as ICategoryDetails;
          const initialFormData: { [key: string]: any } = {};
          
          // Populate form fields from stored values in template
          if (templateData.brand) initialFormData.brand = templateData.brand;
          if (templateData.status) initialFormData.status = templateData.status;
          if (templateData.platform) initialFormData.platform = templateData.platform;
          if (templateData.product_class) initialFormData.product_class = templateData.product_class;
          if (templateData.category_product_type) initialFormData.category_product_type = templateData.category_product_type;
          if (templateData.theme) initialFormData.theme = templateData.theme;
          
          // Handle id_type logic properly
          const idType = templateData.id_type || "general";
          initialFormData.id_type = idType;
          
          // Only set the relevant id field based on id_type
          if (idType === "general" && templateData.general_mefa_id) {
            initialFormData.general_mefa_id = templateData.general_mefa_id;
          } else if (idType === "custom" && templateData.custom_id) {
            initialFormData.custom_id = templateData.custom_id;
          }
          
          if (templateData.fake_reason) initialFormData.fake_reason = templateData.fake_reason;
          if (templateData.is_fake_product !== undefined) initialFormData.is_fake_product = templateData.is_fake_product;
          
          // Update the template's form data
          template.formData = { ...template.formData, ...initialFormData };
        }
      } else {
        const template = state.selectedAttributesTemplates.find(t => t.id === templateId);
        if (template) {
          template.data = data as ICategoryAttr;
          
          // Initialize form data with default values from the template
          const templateData = data as ICategoryAttr;
          const initialFormData: { [key: string]: any } = {};
          
          // Extract form values from stored attributes data
          if (templateData.category_group_attributes) {
            Object.values(templateData.category_group_attributes).forEach(
              (categoryData: any) => {
                Object.values(categoryData.attributes).forEach((attr: any) => {
                  // استفاده از code برای فیلدهای خاص، در غیر این صورت id را به string تبدیل می‌کنیم
                  const fieldKey = attr.code || attr.id.toString();
                  
                  // For text fields
                  if (attr.type === 'text') {
                    if (attr.value !== undefined && attr.value !== null && attr.value !== "") {
                      if (typeof attr.value === 'object' && attr.value.text_lines) {
                        initialFormData[fieldKey] = attr.value.text_lines.join('\n');
                      } else if (typeof attr.value === 'object' && attr.value.original_text) {
                        initialFormData[fieldKey] = attr.value.original_text;
                      } else if (typeof attr.value === 'string') {
                        initialFormData[fieldKey] = attr.value;
                      }
                    } else {
                      // Load empty value
                      initialFormData[fieldKey] = "";
                    }
                  }
                  // For input fields
                  else if (attr.type === 'input') {
                    initialFormData[fieldKey] = attr.value !== undefined && attr.value !== null ? attr.value : "";
                  }
                  // For select fields
                  else if (attr.type === 'select') {
                    const selectedValues = Object.entries(attr.values)
                      .filter(([_, valueData]: [string, any]) => valueData.selected)
                      .map(([valueId, _]) => valueId);
                    if (selectedValues.length > 0) {
                      initialFormData[fieldKey] = selectedValues[0];
                    } else {
                      initialFormData[fieldKey] = "";
                    }
                  }
                  // For checkbox fields
                  else if (attr.type === 'checkbox') {
                    const selectedValues = Object.entries(attr.values)
                      .filter(([_, valueData]: [string, any]) => valueData.selected)
                      .map(([valueId, _]) => valueId);
                    initialFormData[fieldKey] = selectedValues.length > 0 ? selectedValues : [];
                  }
                });
              }
            );
          }
          
          // Update the template's form data
          template.formData = { ...template.formData, ...initialFormData };
        }
      }
    },
    generateFinalProductData: (state) => {
      if (!state.selectedCategoryId) return;

      // Process details templates
      const detailsList: ICategoryDetails[] = state.selectedDetailsTemplates.map(template => {
        const finalData = JSON.parse(JSON.stringify(template.data));
        const formData = template.formData;

        // Apply form data to details structure (similar to detailsSlice logic)
        const staticFields = [
          "is_fake_product", "brand", "status", "platform", "product_class",
          "category_product_type", "fake_reason", "theme", "id_type", 
          "general_mefa_id", "custom_id"
        ];

        staticFields.forEach((field) => {
          if (formData[field] !== undefined && formData[field] !== null && formData[field] !== "") {
            (finalData as any)[field] = formData[field];
          }
        });

        // Update bind selections
        const bind = finalData.bind;
        if (bind) {
          if (bind.brands && formData.brand) {
            bind.brands.forEach((brand: any) => {
              brand.selected = brand.id === formData.brand;
            });
          }
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

          // Update themes selected
          if (bind.category_data?.themes && formData.theme) {
            bind.category_data.themes.forEach((theme: any) => {
              theme.selected = theme.value === formData.theme;
            });
          }

          // Apply text fields
          const textFields = [
            "brand_model", "color_pattern", "warranty", "size", "weight", 
            "material", "origin_country", "manufacturer", "model_number", 
            "barcode", "package_dimensions", "special_features", "care_instructions"
          ];
          textFields.forEach((fieldName) => {
            if (bind[fieldName] && formData[fieldName] !== undefined) {
              bind[fieldName].value = formData[fieldName];
            }
          });
        }

        return finalData;
      });

      // Process attributes templates
      const attributesList: ICategoryAttr[] = state.selectedAttributesTemplates.map(template => {
        const finalData = JSON.parse(JSON.stringify(template.data));
        const formData = template.formData;

        // Apply form data to attributes structure (similar to attributesSlice logic)
        if (finalData.category_group_attributes) {
          Object.keys(finalData.category_group_attributes).forEach((categoryId) => {
            const categoryData = finalData.category_group_attributes[categoryId];

            Object.keys(categoryData.attributes).forEach((attributeId) => {
              const attr = categoryData.attributes[attributeId];
              const fieldKey = attr.code || attr.id.toString();
              const formValue = formData[fieldKey];
              const hasFormValue = fieldKey in formData;

              switch (attr.type) {
                case "input":
                  if (hasFormValue && formValue !== null && formValue !== undefined && formValue !== "") {
                    attr.value = formValue.toString();
                  }
                  break;
                case "text":
                  if (hasFormValue && formValue !== null && formValue !== undefined && formValue !== "") {
                    // ذخیره متن به صورت ساختاریافته برای نمایش بهتر
                    const lines = formValue.toString().split('\n').filter((line: string) => line.trim() !== '');
                    attr.value = {
                      text_lines: lines,
                      original_text: formValue.toString()
                    };
                  } else {
                    attr.value = "";
                  }
                  break;
                case "select":
                  // همیشه ابتدا همه را false می‌کنیم
                  Object.keys(attr.values).forEach((valueId) => {
                    attr.values[valueId].selected = false;
                  });
                  // سپس اگر مقدار وجود داشت، آن را true می‌کنیم
                  if (hasFormValue && formValue) {
                    // تبدیل به string برای اطمینان از تطابق کلید
                    const formValueStr = formValue.toString();
                    if (attr.values[formValueStr]) {
                      attr.values[formValueStr].selected = true;
                    }
                  }
                  break;
                case "checkbox":
                  // همیشه ابتدا همه را false می‌کنیم
                  Object.keys(attr.values).forEach((valueId) => {
                    attr.values[valueId].selected = false;
                  });
                  // سپس اگر آرایه‌ای از مقادیر وجود داشت، آن‌ها را true می‌کنیم
                  if (hasFormValue && Array.isArray(formValue) && formValue.length > 0) {
                    formValue.forEach((valueId: any) => {
                      // تبدیل به string برای اطمینان از تطابق کلید
                      const valueIdStr = valueId.toString();
                      if (attr.values[valueIdStr]) {
                        attr.values[valueIdStr].selected = true;
                      }
                    });
                  }
                  break;
              }
            });
          });
        }

        return finalData;
      });

      // Create final product object with default values as requested
      state.finalProductData = {
        title: state.productTitle.trim(),
        description: state.productDescription.trim() || "",
        category_id: state.selectedCategoryId,
        details: { list: detailsList },
        attributes: { list: attributesList },
        variant_data: { test: "" }, // Default as requested
        images: state.selectedImages, // Use selected images
        source: TemplateSource.App, // Default as requested
        tag: "test" // Default as requested
      };
    },

    resetProduct: (state) => {
      return { ...initialState };
    },

    // Validation actions
    setStepValidationError: (state, action: PayloadAction<{ step: FormStep; hasError: boolean }>) => {
      const { step, hasError } = action.payload;
      if (step in state.stepValidationErrors) {
        state.stepValidationErrors[step as keyof typeof state.stepValidationErrors] = hasError;
      }
    },
  },
});

export const {
  setCurrentStep,
  setSelectedCategory,
  setAvailableDetailsTemplates,
  addDetailsTemplate,
  removeDetailsTemplate,
  setActiveDetailsTemplateIndex,
  updateDetailsTemplateFormData,
  setAvailableAttributesTemplates,
  addAttributesTemplate,
  removeAttributesTemplate,
  setActiveAttributesTemplateIndex,
  updateAttributesTemplateFormData,
  setProductTitle,
  setProductDescription,
  setSelectedImages,
  updateSelectedTemplateData,
  generateFinalProductData,
  resetProduct,
  setStepValidationError,
} = productSlice.actions;

export default productSlice.reducer;