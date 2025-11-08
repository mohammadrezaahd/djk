import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
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
        state.selectedAttributesTemplates.push({
          id: template.id,
          title: template.title,
          data,
          formData: {}
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
                  // For input fields, check if there's a stored value
                  if (attr.type === "input" && attr.value !== undefined) {
                    // Convert string numbers to proper format
                    const numericValue =
                      typeof attr.value === "string" &&
                      !isNaN(parseFloat(attr.value))
                        ? parseFloat(attr.value)
                        : attr.value;
                    initialFormData[attr.id] = numericValue;
                  }
                  // For text fields (Advantage/Disadvantages), handle structured format
                  else if (attr.type === "text" && attr.value !== undefined) {
                    if (typeof attr.value === 'object' && attr.value.text_lines) {
                      // اگر به صورت آرایه خطوط ذخیره شده
                      initialFormData[attr.id] = attr.value.text_lines.join('\n');
                    } else if (typeof attr.value === 'object' && attr.value.original_text) {
                      // اگر متن اصلی ذخیره شده
                      initialFormData[attr.id] = attr.value.original_text;
                    } else if (typeof attr.value === 'string') {
                      // اگر به صورت متن ساده ذخیره شده
                      initialFormData[attr.id] = attr.value;
                    }
                  }
                  // For select/checkbox fields, get selected values
                  else if (attr.values) {
                    const selectedValues = Object.entries(attr.values)
                      .filter(
                        ([_, valueData]: [string, any]) => valueData.selected
                      )
                      .map(([valueId, _]) => valueId);

                    if (selectedValues.length > 0) {
                      const value =
                        attr.type === "checkbox"
                          ? selectedValues
                          : selectedValues[0];
                      initialFormData[attr.id] = value;
                    }
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
          // Add other bind updates as needed...
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
              const formValue = formData[attr.id];

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
                    Object.keys(attr.values).forEach((valueId) => {
                      attr.values[valueId].selected = false;
                    });
                    if (formValue && attr.values[formValue]) {
                      attr.values[formValue].selected = true;
                    }
                    break;
                  case "checkbox":
                    Object.keys(attr.values).forEach((valueId) => {
                      attr.values[valueId].selected = false;
                    });
                    if (Array.isArray(formValue) && formValue.length > 0) {
                      formValue.forEach((valueId: string) => {
                        if (attr.values[valueId]) {
                          attr.values[valueId].selected = true;
                        }
                      });
                    }
                    break;
                }
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