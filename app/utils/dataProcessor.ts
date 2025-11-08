/**
 * Utility functions for processing and converting data to JSON
 */

/**
 * Extracts form data from processed attribute data for editing
 * @param categoryAttr - Processed ICategoryAttr structure
 * @returns Form data object suitable for form inputs
 */
export function extractFormDataFromAttributes(categoryAttr: any): { [key: string]: any } {
  const formData: { [key: string]: any } = {};

  if (!categoryAttr?.category_group_attributes) {
    return formData;
  }

  try {
    Object.keys(categoryAttr.category_group_attributes).forEach((categoryId) => {
      const categoryData = categoryAttr.category_group_attributes[categoryId];

      Object.keys(categoryData.attributes).forEach((attributeId) => {
        const attr = categoryData.attributes[attributeId];
        
        if (attr.value && Object.keys(attr.value).length > 0) {
          // برای text fields
          if (attr.type === 'text' && attr.value.text_lines) {
            // تبدیل آرایه خطوط به متن با \n
            formData[attr.id] = attr.value.text_lines.join('\n');
          }
          // برای text fields که به صورت قدیمی ذخیره شده‌اند
          else if (attr.type === 'text' && attr.value.original_text) {
            formData[attr.id] = attr.value.original_text;
          }
          // برای single select
          else if (Object.keys(attr.value).length === 1) {
            formData[attr.id] = Object.keys(attr.value)[0];
          }
          // برای multi select
          else if (Object.keys(attr.value).length > 1) {
            formData[attr.id] = Object.keys(attr.value);
          }
        }
      });
    });

    return formData;
  } catch (error) {
    console.error('Error extracting form data from attributes:', error);
    return {};
  }
}

/**
 * Converts any object to formatted JSON string
 * @param data - The data object to convert
 * @param indent - Number of spaces for indentation (default: 2)
 * @returns Formatted JSON string
 */
export function convertToJSON(data: any, indent: number = 2): string {
  try {
    return JSON.stringify(data, null, indent);
  } catch (error) {
    console.error('Error converting to JSON:', error);
    return JSON.stringify({ error: 'Failed to convert data to JSON' }, null, indent);
  }
}

/**
 * Processes form data and attributes to final format
 * @param originalCategoryAttr - Original ICategoryAttr structure
 * @param formData - User form input data
 * @param detailsFormData - User details form input data
 * @returns Processed ICategoryAttr object
 */
export function processFormData(
  originalCategoryAttr: any, // ICategoryAttr
  formData: { [key: string]: any },
  detailsFormData: { [key: string]: any } = {}
): any {
  if (!originalCategoryAttr) {
    return { error: 'No original ICategoryAttr data provided' };
  }

  try {
    // Deep copy of original ICategoryAttr structure
    const processedData: any = JSON.parse(JSON.stringify(originalCategoryAttr));

    // Process attributes data in category_group_attributes
    if (processedData.category_group_attributes) {
      Object.keys(processedData.category_group_attributes).forEach((categoryId) => {
        const categoryData = processedData.category_group_attributes[categoryId];

        Object.keys(categoryData.attributes).forEach((attributeId) => {
          const attr = categoryData.attributes[attributeId];
          const formValue = formData[attr.id];

          if (formValue !== undefined && formValue !== null && formValue !== "") {
            // برای text fields (مانند Advantage و Disadvantages)
            if (attr.type === 'text' && typeof formValue === 'string') {
              // تبدیل \n به آرایه برای ذخیره صحیح
              const lines = formValue.split('\n').filter(line => line.trim() !== '');
              attr.value = {
                text_lines: lines,
                original_text: formValue
              };
            }
            // برای single select
            else if (typeof formValue === 'string') {
              // فقط یک مقدار انتخاب شده - آن را از values پیدا کن و در value بگذار
              if (attr.values[formValue]) {
                attr.value = {
                  [formValue]: attr.values[formValue]
                };
              }
            }
            // برای multi select  
            else if (Array.isArray(formValue)) {
              // چندین مقدار انتخاب شده - همه را از values پیدا کن و در value بگذار
              const selectedValues: { [valueId: string]: any } = {};
              formValue.forEach((valueId: string) => {
                if (attr.values[valueId]) {
                  selectedValues[valueId] = attr.values[valueId];
                }
              });
              attr.value = selectedValues;
            }
            
            // values را خالی نکن - بگذار همانطور که هست
            // attr.values = attr.values; // بدون تغییر
          } else {
            // اگر مقداری وارد نشده
            attr.value = {};
          }
        });
      });
    }

    // Add details data if provided
    if (Object.keys(detailsFormData).length > 0) {
      processedData._details = detailsFormData;
    }

    return processedData;
  } catch (error) {
    console.error('Error processing form data:', error);
    return { 
      error: 'Failed to process form data',
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Formats text field value for display purposes
 * @param value - The stored value (can be string, object with text_lines, or object with original_text)
 * @returns Formatted string suitable for display
 */
export function formatTextFieldForDisplay(value: any): string {
  if (!value) return '';
  
  // اگر به صورت آرایه خطوط ذخیره شده
  if (typeof value === 'object' && value.text_lines && Array.isArray(value.text_lines)) {
    return value.text_lines.join('\n');
  }
  
  // اگر متن اصلی ذخیره شده
  if (typeof value === 'object' && value.original_text) {
    return value.original_text;
  }
  
  // اگر به صورت متن ساده ذخیره شده
  if (typeof value === 'string') {
    return value;
  }
  
  return '';
}

/**
 * Combines processing and JSON conversion
 * @param originalCategoryAttr - Original ICategoryAttr structure
 * @param formData - User form input data
 * @param detailsFormData - User details form input data
 * @returns Formatted JSON string of processed ICategoryAttr
 */
export function processAndConvertToJSON(
  originalCategoryAttr: any, // ICategoryAttr
  formData: { [key: string]: any },
  detailsFormData: { [key: string]: any } = {}
): string {
  const processedData = processFormData(originalCategoryAttr, formData, detailsFormData);
  return convertToJSON(processedData);
}