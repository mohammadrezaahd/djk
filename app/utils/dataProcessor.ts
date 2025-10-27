/**
 * Utility functions for processing and converting data to JSON
 */

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
            // برای single select
            if (typeof formValue === 'string') {
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