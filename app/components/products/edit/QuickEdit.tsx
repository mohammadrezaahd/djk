import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Typography,
  TextField,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ExpandIcon } from "~/components/icons/IconComponents";
import { Controller } from "react-hook-form";

import { useCategory } from "~/api/categories.api";
import AttributesFormFields from "~/components/templates/attributes/AttributesFormFields";
import DetailsFormFields from "~/components/templates/details/DetailsFormFields";
import { MediaManager } from "~/components/MediaManager";
import { useImages } from "~/api/gallery.api";
import { useQuickProductValidation } from "~/validation";

export interface QuickEditProductProps {
  productData: any;
  productTitle: string;
  productDescription: string;
  selectedImages: number[];
  onProductTitleChange: (value: string) => void;
  onProductDescriptionChange: (value: string) => void;
  onImagesChange: (images: number[]) => void;
  onDetailsTemplatesChange: (templates: any[]) => void;
  onAttributesTemplatesChange: (templates: any[]) => void;
}

interface FormData {
  details: { [key: string]: any };
  attributes: { [key: string]: any };
}

const QuickEditProduct: React.FC<QuickEditProductProps> = ({
  productData,
  productTitle,
  productDescription,
  selectedImages,
  onProductTitleChange,
  onProductDescriptionChange,
  onImagesChange,
  onDetailsTemplatesChange,
  onAttributesTemplatesChange,
}) => {
  // State management
  const [formData, setFormData] = useState<FormData>({
    details: {},
    attributes: {},
  });
  const [expandedAccordions, setExpandedAccordions] = useState({
    basic: true,
    details: false,
    attributes: false,
    images: false,
  });

  // Category is fixed (from product data - cannot be changed)
  const selectedCategory = useMemo(() => {
    if (!productData?.data) return null;
    return {
      id: productData.data.category_id,
      title: productData.data.category_title || "دسته‌بندی",
      parent_id: productData.data.parent_category_id || 0, // Add required field
      slug: productData.data.category_slug || "", // Add if available
      description: "", // Default value
      image: "", // Default value
      status: 1, // Default active status
      created_at: "", // Default value
      updated_at: "", // Default value
    };
  }, [productData?.data]);

  // Validation hook with initial values - using QuickProduct validation (non-strict)
  const { form, isFormValid, errors } = useQuickProductValidation({
    title: productTitle,
    description: productDescription,
    selectedCategory: selectedCategory as any,
    images: selectedImages,
  });

  // Keep form in sync with props
  useEffect(() => {
    form.setValue("title", productTitle);
  }, [productTitle, form]);

  useEffect(() => {
    form.setValue("description", productDescription);
  }, [productDescription, form]);

  useEffect(() => {
    form.setValue("images", selectedImages);
  }, [selectedImages, form]);

  useEffect(() => {
    form.setValue("selectedCategory", selectedCategory);
  }, [selectedCategory, form]);

  // API hooks
  const { data: categoryData, isLoading: categoryLoading } = useCategory(
    selectedCategory?.id || 0,
    { attributes: true, details: true },
    !!selectedCategory?.id
  );

  // Gallery API for media management
  const {
    data: galleryData,
    isLoading: galleryLoading,
    refetch: refetchGallery,
  } = useImages({ skip: 0, limit: 50, product: true, packaging: false });

  // Extract category templates data
  const detailsData = categoryData?.data?.item?.details;
  const attributesData = categoryData?.data?.item?.attributes;

  // Initialize form data from product data when available
  useEffect(() => {
    if (!productData?.data) return;

    const product = productData.data;

    // Load details form data from existing product
    const detailsFormData: { [key: string]: any } = {};
    if (product.details?.list && product.details.list.length > 0) {
      const detailData = product.details.list[0]; // Take first template for quick edit

      // Extract static fields
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
        if ((detailData as any)[field] !== undefined) {
          detailsFormData[field] = (detailData as any)[field];
        }
      });

      // Extract bind text fields
      if (detailData.bind) {
        const bind = detailData.bind as any;
        const textFields = [
          "brand_model",
          "color_pattern",
          "warranty",
          "size",
          "weight",
          "material",
          "origin_country",
          "manufacturer",
          "model_number",
          "barcode",
          "package_dimensions",
          "special_features",
          "care_instructions",
        ];
        textFields.forEach((fieldName) => {
          if (bind[fieldName]?.value !== undefined) {
            detailsFormData[fieldName] = bind[fieldName].value;
          }
        });
      }
    }

    // Load attributes form data from existing product
    const attributesFormData: { [key: string]: any } = {};
    if (product.attributes?.list && product.attributes.list.length > 0) {
      const attrData = product.attributes.list[0]; // Take first template for quick edit

      if (attrData.category_group_attributes) {
        Object.values(attrData.category_group_attributes).forEach(
          (categoryData: any) => {
            Object.values(categoryData.attributes).forEach((attr: any) => {
              const fieldKey = attr.code || attr.id.toString();

              switch (attr.type) {
                case "input":
                case "text":
                  if (attr.value) {
                    if (
                      typeof attr.value === "object" &&
                      attr.value.original_text
                    ) {
                      attributesFormData[fieldKey] = attr.value.original_text;
                    } else if (typeof attr.value === "string") {
                      attributesFormData[fieldKey] = attr.value;
                    }
                  }
                  break;
                case "select":
                  const selectedValue = Object.entries(attr.values || {}).find(
                    ([_, v]: [string, any]) => v.selected
                  )?.[0];
                  if (selectedValue) {
                    attributesFormData[fieldKey] = selectedValue;
                  }
                  break;
                case "checkbox":
                  const selectedValues = Object.entries(attr.values || {})
                    .filter(([_, v]: [string, any]) => v.selected)
                    .map(([k, _]) => k);
                  if (selectedValues.length > 0) {
                    attributesFormData[fieldKey] = selectedValues;
                  }
                  break;
              }
            });
          }
        );
      }
    }

    setFormData({
      details: detailsFormData,
      attributes: attributesFormData,
    });

    // Initialize templates for parent on first load
    if (detailsData) {
      const processedDetails = JSON.parse(JSON.stringify(detailsData));
      Object.keys(detailsFormData).forEach((field) => {
        const fieldValue = detailsFormData[field];
        if (fieldValue !== undefined && fieldValue !== "") {
          (processedDetails as any)[field] = fieldValue;
        }
      });

      onDetailsTemplatesChange([
        {
          id: 1000,
          title: "قالب ویرایش سریع",
          source: productData?.data?.source,
          data: processedDetails,
          formData: detailsFormData,
        },
      ]);
    }

    if (attributesData) {
      const processedAttributes = JSON.parse(JSON.stringify(attributesData));

      if (processedAttributes.category_group_attributes) {
        Object.values(processedAttributes.category_group_attributes).forEach(
          (categoryData: any) => {
            Object.values(categoryData.attributes).forEach((attr: any) => {
              const attrFieldKey = attr.code || attr.id.toString();
              if (attributesFormData[attrFieldKey] !== undefined) {
                const fieldValue = attributesFormData[attrFieldKey];

                switch (attr.type) {
                  case "input":
                  case "text":
                    attr.value = fieldValue?.toString() || "";
                    break;
                  case "checkbox":
                    attr.value = Boolean(fieldValue);
                    break;
                  case "radio":
                  case "select":
                    attr.value = fieldValue;
                    break;
                  default:
                    attr.value = fieldValue;
                }
              }
            });
          }
        );
      }

      onAttributesTemplatesChange([
        {
          id: 2000,
          title: "قالب ویرایش سریع",
          source: productData?.data?.source,
          data: processedAttributes,
          formData: attributesFormData,
        },
      ]);
    }
  }, [productData?.data, detailsData, attributesData]);

  // Handle details form data changes
  const handleDetailsChange = (fieldId: string | number, value: any) => {
    const fieldKey = typeof fieldId === "string" ? fieldId : fieldId.toString();
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [fieldKey]: value,
      },
    }));

    // Update parent templates for saving
    if (detailsData) {
      const processedDetails = JSON.parse(JSON.stringify(detailsData));

      // Apply current form data
      const currentFormData = { ...formData.details, [fieldKey]: value };
      Object.keys(currentFormData).forEach((field) => {
        const fieldValue = currentFormData[field];
        if (fieldValue !== undefined && fieldValue !== "") {
          (processedDetails as any)[field] = fieldValue;
        }
      });

      onDetailsTemplatesChange([
        {
          id: 1000,
          title: "قالب ویرایش سریع",
          source: productData?.data?.source,
          data: processedDetails,
          formData: currentFormData,
        },
      ]);
    }
  };

  // Handle attributes form data changes
  const handleAttributesChange = (fieldId: string | number, value: any) => {
    const fieldKey = typeof fieldId === "string" ? fieldId : fieldId.toString();
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [fieldKey]: value,
      },
    }));

    // Update parent templates for saving
    if (attributesData) {
      const processedAttributes = JSON.parse(JSON.stringify(attributesData));

      // Apply current form data
      const currentFormData = { ...formData.attributes, [fieldKey]: value };

      if (processedAttributes.category_group_attributes) {
        Object.values(processedAttributes.category_group_attributes).forEach(
          (categoryData: any) => {
            Object.values(categoryData.attributes).forEach((attr: any) => {
              const attrFieldKey = attr.code || attr.id.toString();
              if (currentFormData[attrFieldKey] !== undefined) {
                const fieldValue = currentFormData[attrFieldKey];

                switch (attr.type) {
                  case "input":
                  case "text":
                    attr.value = fieldValue?.toString() || "";
                    break;
                  case "checkbox":
                    attr.value = Boolean(fieldValue);
                    break;
                  case "radio":
                  case "select":
                    attr.value = fieldValue;
                    break;
                  default:
                    attr.value = fieldValue;
                }
              }
            });
          }
        );
      }

      onAttributesTemplatesChange([
        {
          id: 2000,
          title: "قالب ویرایش سریع",
          source: productData?.data?.source,
          data: processedAttributes,
          formData: currentFormData,
        },
      ]);
    }
  };

  // Handle image selection
  const handleImagesChange = (selectedIds: string[]) => {
    const imageIds = selectedIds.map((id) => parseInt(id));
    onImagesChange(imageIds);
  };

  // Handle accordion toggle
  const handleAccordionChange =
    (panel: keyof typeof expandedAccordions) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordions((prev) => ({
        ...prev,
        [panel]: isExpanded,
      }));
    };

  // Convert gallery data to MediaManager format
  const mediaFiles =
    galleryData?.data?.list?.map((item: any) => ({
      _id: item.id.toString(),
      filename: item.title || `image-${item.id}`,
      filepath: item.image_url,
      size: parseInt(item.size) || 0,
      mimetype: "image/jpeg",
      createdAt: new Date().toISOString(),
      product: item.product || true,
    })) || [];

  return (
    <>
      {/* Category Info - Read Only */}
      <Grid size={{ xs: 12 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>دسته‌بندی محصول:</strong>{" "}
            {selectedCategory?.title || "نامشخص"}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
            در ویرایش سریع، امکان تغییر دسته‌بندی وجود ندارد
          </Typography>
        </Alert>
      </Grid>

      {/* Basic Product Info Accordion */}
      <Grid size={{ xs: 12 }}>
        <Accordion
          expanded={expandedAccordions.basic}
          onChange={handleAccordionChange("basic")}
        >
          <AccordionSummary
            expandIcon={<ExpandIcon />}
            aria-controls="basic-content"
            id="basic-header"
          >
            <Typography variant="h6">اطلاعات پایه محصول *</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="عنوان محصول"
                      placeholder="عنوان محصول را وارد کنید..."
                      required
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      onChange={(e) => {
                        field.onChange(e);
                        onProductTitleChange(e.target.value);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      label="توضیحات محصول"
                      placeholder="توضیحات کامل محصول را وارد کنید... (حداقل 100 کاراکتر)"
                      required
                      error={!!errors.description}
                      helperText={
                        errors.description?.message ||
                        `${field.value?.length || 0}/100 کاراکتر`
                      }
                      onChange={(e) => {
                        field.onChange(e);
                        onProductDescriptionChange(e.target.value);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* Details Form Accordion */}
      <Grid size={{ xs: 12 }}>
        <Accordion
          expanded={expandedAccordions.details}
          onChange={handleAccordionChange("details")}
        >
          <AccordionSummary
            expandIcon={<ExpandIcon />}
            aria-controls="details-content"
            id="details-header"
          >
            <Typography variant="h6">اطلاعات تفصیلی محصول</Typography>
            <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
              (اختیاری)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {categoryLoading ? (
              <Typography>در حال بارگیری...</Typography>
            ) : detailsData ? (
              <Box sx={{ "& .MuiGrid-container": { gap: 2 } }}>
                <DetailsFormFields
                  detailsData={detailsData}
                  formData={formData.details}
                  onFormDataChange={handleDetailsChange}
                  validationErrors={{}}
                />
              </Box>
            ) : (
              <Alert severity="info">
                اطلاعات تفصیلی برای این دسته‌بندی موجود نیست
              </Alert>
            )}
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* Attributes Form Accordion */}
      <Grid size={{ xs: 12 }}>
        <Accordion
          expanded={expandedAccordions.attributes}
          onChange={handleAccordionChange("attributes")}
        >
          <AccordionSummary
            expandIcon={<ExpandIcon />}
            aria-controls="attributes-content"
            id="attributes-header"
          >
            <Typography variant="h6">ویژگی‌های محصول</Typography>
            <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
              (اختیاری)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {categoryLoading ? (
              <Typography>در حال بارگیری...</Typography>
            ) : attributesData ? (
              <Box sx={{ "& .MuiGrid-container": { gap: 2 } }}>
                <AttributesFormFields
                  attributesData={attributesData}
                  formData={formData.attributes}
                  onFormDataChange={handleAttributesChange}
                  validationErrors={{}}
                />
              </Box>
            ) : (
              <Alert severity="info">
                ویژگی‌های محصول برای این دسته‌بندی موجود نیست
              </Alert>
            )}
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* Image Selection Accordion */}
      <Grid size={{ xs: 12 }}>
        <Accordion
          expanded={expandedAccordions.images}
          onChange={handleAccordionChange("images")}
        >
          <AccordionSummary
            expandIcon={<ExpandIcon />}
            aria-controls="images-content"
            id="images-header"
          >
            <Typography variant="h6">تصاویر محصول *</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {errors.images && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.images.message}
              </Alert>
            )}
            <MediaManager
              media={mediaFiles}
              loading={galleryLoading}
              currentPage={1}
              totalItems={galleryData?.data?.list?.length || 0}
              pageSize={50}
              onPageChange={(event, page) => {
                // Handle page change if needed in future
                console.log("Page changed to:", page);
              }}
              onPageSizeChange={(event) => {
                // Handle page size change if needed in future
                console.log("Page size changed to:", event.target.value);
              }}
              showUpload={true}
              onUploadSuccess={() => {
                refetchGallery();
              }}
              onUploadError={(error) => {
                console.error("Upload error:", error);
              }}
              selectionMode={true}
              selectedItems={selectedImages?.map((id) => id.toString()) || []}
              onSelectionChange={handleImagesChange}
              allowMultiple={true}
              showSearch={false}
              pageSizeOptions={[20, 50, 100]}
            />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </>
  );
};

export default QuickEditProduct;
