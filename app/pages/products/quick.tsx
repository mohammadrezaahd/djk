import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Button,
  Alert,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormHelperText,
  Container,
} from "@mui/material";
import { ExpandIcon } from "~/components/icons/IconComponents";
import { Controller } from "react-hook-form";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router";
import { SaveIcon, CloseIcon } from "~/components/icons/IconComponents";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import { useCategoriesList, useCategory } from "~/api/categories.api";
import { useAddProduct } from "~/api/product.api";
import CategorySelector from "~/components/templates/CategorySelector";
import AttributesFormFields from "~/components/templates/attributes/AttributesFormFields";
import DetailsFormFields from "~/components/templates/details/DetailsFormFields";
import { MediaManager } from "~/components/MediaManager";
import { TitleCard } from "~/components/common";
import AppLayout from "~/components/layout/AppLayout";
import { MediaType } from "~/components/MediaManager/FileUpload";
import type { IPostProduct } from "~/types/dtos/product.dto";
import { TemplateSource } from "~/types/dtos/templates.dto";
import { useImages } from "~/api/gallery.api";
import { useQuickProductValidation } from "~/validation";
import { ApiStatus } from "~/types";

export function meta() {
  return [
    { title: "محصول سریع" },
    { name: "description", content: "صفحه افزودن سریع محصول جدید" },
  ];
}

interface FormData {
  details: { [key: string]: any };
  attributes: { [key: string]: any };
}

const QuickProductPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
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

  // Validation hook
  const { form, isFormValid, errors } = useQuickProductValidation();
  const selectedCategory = form.watch("selectedCategory");
  const formImages = form.watch("images");

  // API hooks
  const { data: categoriesResponse, isLoading: categoriesLoading } =
    useCategoriesList(searchTerm, 1, 50);

  const { data: categoryData, isLoading: categoryLoading } = useCategory(
    selectedCategory?.id || 0,
    { attributes: true, details: true },
    !!selectedCategory?.id
  );

  const { mutateAsync: saveProduct, isPending: isProductSaving } =
    useAddProduct();

  // Gallery API for media management
  const {
    data: galleryData,
    isLoading: galleryLoading,
    refetch: refetchGallery,
  } = useImages({ skip: 0, limit: 50, product: true, packaging: false });

  // Extract categories from response
  const categories = categoriesResponse?.data?.items || [];
  const suggestedCategories = categoriesResponse?.data?.suugest || [];

  // Extract category templates data
  const detailsData = categoryData?.data?.item?.details;
  const attributesData = categoryData?.data?.item?.attributes;

  // Handle form submission
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      // Prepare details array
      const detailsList: ICategoryDetails[] = [];
      if (detailsData) {
        // Always create a details object, even if no form data is entered
        const processedDetails: ICategoryDetails = JSON.parse(
          JSON.stringify(detailsData)
        );

        // Apply form data to the details structure - use bind data directly
        Object.keys(formData.details).forEach((fieldName) => {
          const value = formData.details[fieldName];
          if (value !== undefined && value !== "") {
            (processedDetails as any)[fieldName] = value;
          }
        });

        detailsList.push(processedDetails);
      }

      // Prepare attributes array
      const attributesList: ICategoryAttr[] = [];
      if (attributesData) {
        // Always create an attributes object, even if no form data is entered
        const processedAttributes: ICategoryAttr = JSON.parse(
          JSON.stringify(attributesData)
        );

        // Apply form data to the attributes structure
        if (processedAttributes.category_group_attributes) {
          Object.values(processedAttributes.category_group_attributes).forEach(
            (categoryData: any) => {
              Object.values(categoryData.attributes).forEach((attr: any) => {
                const fieldKey = attr.code || attr.id.toString();
                if (formData.attributes[fieldKey] !== undefined) {
                  const value = formData.attributes[fieldKey];

                  switch (attr.type) {
                    case "input":
                    case "text":
                      attr.value = value?.toString() || "";
                      break;
                    case "checkbox":
                      attr.value = Boolean(value);
                      break;
                    case "radio":
                    case "select":
                      attr.value = value;
                      break;
                    default:
                      attr.value = value;
                  }
                }
              });
            }
          );
        }

        attributesList.push(processedAttributes);
      }

      // Prepare the final product data
      const productData: IPostProduct = {
        title: data.title,
        description: data.description,
        category_id: data.selectedCategory!.id,
        details: { list: detailsList },
        attributes: { list: attributesList },
        variant_data: {}, // Empty for quick product
        images: data.images,
        source: TemplateSource.Quick,
        tag: "quick",
      };

      const result = await saveProduct(productData);

      if (result.status === ApiStatus.SUCCEEDED) {
        enqueueSnackbar("محصول با موفقیت ایجاد شد", { variant: "success" });
        navigate("/dashboard/products/list");
      } else {
        enqueueSnackbar("خطا در ایجاد محصول", { variant: "error" });
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      enqueueSnackbar(
        `خطا در ایجاد محصول: ${error.message || "خطای ناشناخته"}`,
        {
          variant: "error",
        }
      );
    }
  });

  // Handle form reset
  const handleReset = () => {
    form.reset();
    setFormData({
      details: {},
      attributes: {},
    });
    setSearchTerm("");
    setExpandedAccordions({
      basic: true,
      details: false,
      attributes: false,
      images: false,
    });
  };

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
  };

  // Handle image selection
  const handleImagesChange = (selectedIds: string[]) => {
    const imageIds = selectedIds.map((id) => parseInt(id));
    form.setValue("images", imageIds, { shouldValidate: true });
  };

  // Handle category change
  const handleCategoryChange = (category: ICategoryList | null) => {
    form.setValue("selectedCategory", category, { shouldValidate: true });
    // Reset form data when category changes
    setFormData({
      details: {},
      attributes: {},
    });
    // Keep accordions closed when category is selected - user will open them manually
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
    <AppLayout title="محصول سریع">
      <Container maxWidth="lg">
        <TitleCard
          title="محصول سریع"
          description="ایجاد سریع محصول در یک صفحه - همه اطلاعات را در یک مکان وارد کنید"
        />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Grid container spacing={3}>
              {/* Category Selection */}
              <Grid size={{ xs: 12 }}>
                <CategorySelector
                  categories={categories}
                  selectedCategory={selectedCategory}
                  loadingCategories={categoriesLoading}
                  onCategoryChange={handleCategoryChange}
                  onSearchChange={setSearchTerm}
                  suggestedCategories={suggestedCategories}
                  loadingSuggestions={categoriesLoading}
                />

                {errors.selectedCategory && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.selectedCategory.message}
                  </Alert>
                )}
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
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Template Forms - Only show if category is selected */}
              {selectedCategory && (
                <>
                  {/* Details Form Accordion */}
                  {detailsData && (
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
                          <Typography variant="h6">
                            اطلاعات تفصیلی محصول
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ ml: 1, color: "text.secondary" }}
                          >
                            (اختیاری)
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {categoryLoading ? (
                            <Typography>در حال بارگیری...</Typography>
                          ) : (
                            <Box sx={{ "& .MuiGrid-container": { gap: 2 } }}>
                              <DetailsFormFields
                                detailsData={detailsData}
                                formData={formData.details}
                                onFormDataChange={handleDetailsChange}
                                validationErrors={{}}
                              />
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

                  {/* Attributes Form Accordion */}
                  {attributesData && (
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
                          <Typography
                            variant="body2"
                            sx={{ ml: 1, color: "text.secondary" }}
                          >
                            (اختیاری)
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {categoryLoading ? (
                            <Typography>در حال بارگیری...</Typography>
                          ) : (
                            <Box sx={{ "& .MuiGrid-container": { gap: 2 } }}>
                              <AttributesFormFields
                                attributesData={attributesData}
                                formData={formData.attributes}
                                onFormDataChange={handleAttributesChange}
                                validationErrors={{}}
                              />
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  )}

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
                            console.log(
                              "Page size changed to:",
                              event.target.value
                            );
                          }}
                          showUpload={true}
                          onUploadSuccess={() => {
                            refetchGallery();
                            enqueueSnackbar("تصویر با موفقیت آپلود شد", {
                              variant: "success",
                            });
                          }}
                          onUploadError={(error) => {
                            enqueueSnackbar(`خطا در آپلود: ${error}`, {
                              variant: "error",
                            });
                          }}
                          selectionMode={true}
                          selectedItems={
                            formImages?.map((id) => id.toString()) || []
                          }
                          onSelectionChange={handleImagesChange}
                          allowMultiple={true}
                          showSearch={false}
                          pageSizeOptions={[20, 50, 100]}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </Grid>

                  {/* Action Buttons */}
                  <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={handleReset}
                          disabled={isProductSaving}
                          startIcon={<CloseIcon />}
                        >
                          پاک کردن فرم
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={isProductSaving || !isFormValid}
                          startIcon={<SaveIcon />}
                        >
                          {isProductSaving ? "در حال ذخیره..." : "ایجاد محصول"}
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                </>
              )}

              {/* Show message when no category is selected */}
              {!selectedCategory && (
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info">
                    برای ادامه، لطفاً ابتدا دسته‌بندی مورد نظر را انتخاب کنید
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AppLayout>
  );
};

export default QuickProductPage;
