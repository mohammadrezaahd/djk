import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Alert,
  Typography,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";
import { TemplateSource } from "~/types/dtos/templates.dto";
import Layout from "~/components/layout/Layout";
import { TitleCard } from "~/components/common";
import { useProduct, useEditProduct } from "~/api/product.api";
import { useCategoriesList } from "~/api/categories.api";
import { useDetails, useDetail } from "~/api/details.api";
import { useAttrs, useAttr } from "~/api/attributes.api";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import type { ITemplateList } from "~/types/interfaces/templates.interface";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import ProductDetailsForm from "~/components/products/ProductDetailsForm";
import ProductAttributesForm from "~/components/products/ProductAttributesForm";
import DynamicTitleBuilder from "~/components/products/DynamicTitleBuilder";
import ProductImageSelection from "~/components/products/ProductImageSelection";
import {
  useProductDetailsValidation,
  useProductAttributesValidation,
  getAttributesTemplatesValidationErrors,
  getDetailsTemplatesValidationErrors,
  useProductInfoValidation,
} from "~/validation";
import { useSelectedImages } from "~/api/gallery.api";
import ImageSelector from "~/components/templates/ImageSelector";
import { MediaType } from "~/components/MediaManager/FileUpload";

interface TemplateData {
  id: number;
  title: string;
  source: TemplateSource;
  data: ICategoryDetails | ICategoryAttr;
  formData: { [key: string]: any };
}

export function meta() {
  return [
    { title: "ویرایش محصول" },
    { name: "description", content: "صفحه ویرایش محصول در فروشگاه" },
  ];
}

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // State
  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryList | null>(null);

  const [detailsTemplates, setDetailsTemplates] = useState<TemplateData[]>([]);
  const [attributesTemplates, setAttributesTemplates] = useState<
    TemplateData[]
  >([]);

  const [activeDetailsTab, setActiveDetailsTab] = useState(0);
  const [activeAttributesTab, setActiveAttributesTab] = useState(0);

  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAttributesDialog, setShowAttributesDialog] = useState(false);
  const [showImageSelectionDialog, setShowImageSelectionDialog] =
    useState(false);

  const [availableDetailsTemplates, setAvailableDetailsTemplates] = useState<
    ITemplateList[]
  >([]);
  const [availableAttributesTemplates, setAvailableAttributesTemplates] =
    useState<ITemplateList[]>([]);

  // API hooks
  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useProduct(productId);
  const { mutateAsync: editProduct, isPending: isUpdating } = useEditProduct();
  const { data: categoriesData } = useCategoriesList("", 1, 50);
  const detailsMutation = useDetails();
  const attributesMutation = useAttrs();

  // Template data hooks for active templates
  const activeDetailsTemplate = detailsTemplates[activeDetailsTab];
  const activeAttributesTemplate = attributesTemplates[activeAttributesTab];

  const { data: activeDetailsTemplateData } = useDetail(
    activeDetailsTemplate?.id || 0
  );
  const { data: activeAttributesTemplateData } = useAttr(
    activeAttributesTemplate?.id || 0
  );

  // Get validation errors for all details templates
  const allDetailsValidationErrors = useMemo(() => {
    const allErrors = getDetailsTemplatesValidationErrors(detailsTemplates);

    // Flatten errors for the active template
    const activeTemplateErrors = allErrors.find(
      (errorSet) => errorSet.templateId === activeDetailsTemplate?.id
    );

    return activeTemplateErrors?.errors || {};
  }, [detailsTemplates, activeDetailsTemplate?.id]);

  // Get validation errors for all attributes templates
  const allAttributesValidationErrors = useMemo(() => {
    const allErrors =
      getAttributesTemplatesValidationErrors(attributesTemplates);

    // Flatten errors for the active template
    const activeTemplateErrors = allErrors.find(
      (errorSet) => errorSet.templateId === activeAttributesTemplate?.id
    );

    return activeTemplateErrors?.errors || {};
  }, [attributesTemplates, activeAttributesTemplate?.id]);

  // Validate product info (title and description)
  const productInfoValidation = useProductInfoValidation(
    productTitle,
    productDescription
  );

  // Fetch selected images data (moved here before isFormValid)
  const { data: selectedImagesData } = useSelectedImages(selectedImages);

  // Calculate if form is valid
  const isFormValid = useMemo(() => {
    // Check product info validation (title and description)
    if (!productInfoValidation.isValid) return false;

    // Check if at least one image is selected
    if (selectedImages.length === 0) return false;

    // Check if at least one selected image is a product image
    const hasProductImage =
      selectedImagesData?.data?.list?.some((img) => img.product === true) ||
      false;
    if (!hasProductImage) return false;

    // Check if templates exist
    if (detailsTemplates.length === 0 || attributesTemplates.length === 0) {
      return false;
    }

    // Check details validation - check if there are any errors in allDetailsValidationErrors
    const hasDetailsErrors = Object.keys(allDetailsValidationErrors).length > 0;

    // Check attributes validation - check if there are any errors in allAttributesValidationErrors
    const hasAttributesErrors =
      Object.keys(allAttributesValidationErrors).length > 0;

    return !hasDetailsErrors && !hasAttributesErrors;
  }, [
    productInfoValidation.isValid,
    selectedImages.length,
    selectedImagesData,
    detailsTemplates,
    attributesTemplates,
    allDetailsValidationErrors,
    allAttributesValidationErrors,
  ]);

  // Get all attributes data for title builder
  const getAllAttributesData = useMemo(() => {
    return attributesTemplates
      .filter(
        (template) => template.data && Object.keys(template.data).length > 0
      )
      .map((template) => template.data)
      .filter((data): data is ICategoryAttr => {
        return "category_group_attributes" in data;
      });
  }, [attributesTemplates]);

  // Get all details data for title builder
  const getAllDetailsData = useMemo(() => {
    return detailsTemplates
      .filter(
        (template) => template.data && Object.keys(template.data).length > 0
      )
      .map((template) => template.data)
      .filter((data): data is ICategoryDetails => {
        return "bind" in data;
      });
  }, [detailsTemplates]);

  // Load product data
  useEffect(() => {
    if (!productData?.data || !categoriesData?.data) return;

    const product = productData.data;

    setProductTitle(product.title);
    setProductDescription(product.description || "");
    setSelectedImages(product.images);

    // Find category
    const category = categoriesData.data.items.find(
      (cat: ICategoryList) => cat.id === product.category_id
    );
    if (category) {
      setSelectedCategory(category);
    }

    // Load details templates
    if (product.details?.list && product.details.list.length > 0) {
      const templates: TemplateData[] = product.details.list.map(
        (detailData: ICategoryDetails, index: number) => {
          const templateId = (detailData as any).template_id || index + 1000;
          const templateTitle =
            (detailData as any).template_title || `قالب ${index + 1}`;

          // Extract form data from the detail data
          const formData: { [key: string]: any } = {};

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
              formData[field] = (detailData as any)[field];
            }
          });

          // Extract text fields from bind
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
                formData[fieldName] = bind[fieldName].value;
              }
            });
          }

          return {
            id: templateId,
            title: templateTitle,
            source: product.source,
            data: detailData,
            formData,
          };
        }
      );
      setDetailsTemplates(templates);
    }

    // Load attributes templates
    if (product.attributes?.list && product.attributes.list.length > 0) {
      const templates: TemplateData[] = product.attributes.list.map(
        (attrData: ICategoryAttr, index: number) => {
          const templateId = (attrData as any).template_id || index + 2000;
          const templateTitle =
            (attrData as any).template_title || `قالب ${index + 1}`;

          // Extract form data from attributes
          const formData: { [key: string]: any } = {};

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
                          formData[fieldKey] = attr.value.original_text;
                        } else if (typeof attr.value === "string") {
                          formData[fieldKey] = attr.value;
                        }
                      }
                      break;
                    case "select":
                      const selectedValue = Object.entries(
                        attr.values || {}
                      ).find(([_, v]: [string, any]) => v.selected)?.[0];
                      if (selectedValue) {
                        formData[fieldKey] = selectedValue;
                      }
                      break;
                    case "checkbox":
                      const selectedValues = Object.entries(attr.values || {})
                        .filter(([_, v]: [string, any]) => v.selected)
                        .map(([k, _]) => k);
                      if (selectedValues.length > 0) {
                        formData[fieldKey] = selectedValues;
                      }
                      break;
                  }
                });
              }
            );
          }

          return {
            id: templateId,
            title: templateTitle,
            source: product.source,
            data: attrData,
            formData,
          };
        }
      );
      setAttributesTemplates(templates);
    }
  }, [productData?.data, categoriesData?.data]);

  // Update template data when loaded from API
  useEffect(() => {
    if (
      activeDetailsTemplateData?.data &&
      activeDetailsTemplate &&
      (!activeDetailsTemplate.data ||
        Object.keys(activeDetailsTemplate.data).length === 0)
    ) {
      const updatedTemplates = [...detailsTemplates];
      updatedTemplates[activeDetailsTab] = {
        ...updatedTemplates[activeDetailsTab],
        data: activeDetailsTemplateData.data.data_json,
      };
      setDetailsTemplates(updatedTemplates);
    }
  }, [activeDetailsTemplateData?.data, activeDetailsTemplate?.id]);

  useEffect(() => {
    if (
      activeAttributesTemplateData?.data &&
      activeAttributesTemplate &&
      (!activeAttributesTemplate.data ||
        Object.keys(activeAttributesTemplate.data).length === 0)
    ) {
      const updatedTemplates = [...attributesTemplates];
      updatedTemplates[activeAttributesTab] = {
        ...updatedTemplates[activeAttributesTab],
        data: activeAttributesTemplateData.data.data_json,
      };
      setAttributesTemplates(updatedTemplates);
    }
  }, [activeAttributesTemplateData?.data, activeAttributesTemplate?.id]);

  // Handle form data changes
  const handleDetailsFormDataChange = (fieldName: string, value: any) => {
    const updatedTemplates = [...detailsTemplates];
    updatedTemplates[activeDetailsTab].formData[fieldName] = value;
    setDetailsTemplates(updatedTemplates);
  };

  const handleAttributesFormDataChange = (
    fieldId: number | string,
    value: any
  ) => {
    const updatedTemplates = [...attributesTemplates];
    const fieldKey = typeof fieldId === "string" ? fieldId : fieldId.toString();
    updatedTemplates[activeAttributesTab].formData[fieldKey] = value;
    setAttributesTemplates(updatedTemplates);
  };

  // Handle template removal
  const handleRemoveDetailsTemplate = (index: number) => {
    const newTemplates = detailsTemplates.filter((_, i) => i !== index);
    setDetailsTemplates(newTemplates);
    if (activeDetailsTab >= newTemplates.length) {
      setActiveDetailsTab(Math.max(0, newTemplates.length - 1));
    }
  };

  const handleRemoveAttributesTemplate = (index: number) => {
    const newTemplates = attributesTemplates.filter((_, i) => i !== index);
    setAttributesTemplates(newTemplates);
    if (activeAttributesTab >= newTemplates.length) {
      setActiveAttributesTab(Math.max(0, newTemplates.length - 1));
    }
  };

  // Load available templates for adding
  const handleOpenDetailsDialog = async () => {
    if (!selectedCategory) return;
    try {
      const result = await detailsMutation.mutateAsync({
        categoryId: selectedCategory.id,
        skip: 0,
        limit: 100,
      });
      if (result.status === "true" && result.data?.list) {
        setAvailableDetailsTemplates(result.data.list);
        setShowDetailsDialog(true);
      }
    } catch (error) {
      enqueueSnackbar("خطا در بارگذاری قالب‌ها", { variant: "error" });
    }
  };

  const handleOpenAttributesDialog = async () => {
    if (!selectedCategory) return;
    try {
      const result = await attributesMutation.mutateAsync({
        categoryId: selectedCategory.id,
        skip: 0,
        limit: 100,
      });
      if (result.status === "true" && result.data?.list) {
        setAvailableAttributesTemplates(result.data.list);
        setShowAttributesDialog(true);
      }
    } catch (error) {
      enqueueSnackbar("خطا در بارگذاری قالب‌ها", { variant: "error" });
    }
  };

  // Add selected templates
  const handleAddDetailsTemplates = (selectedIds: number[]) => {
    const newTemplates = selectedIds
      .filter((id) => !detailsTemplates.some((t) => t.id === id))
      .map((id) => {
        const template = availableDetailsTemplates.find((t) => t.id === id);
        return {
          id: template!.id,
          title: template!.title,
          source: template!.source,
          data: {} as ICategoryDetails,
          formData: {},
        };
      });
    setDetailsTemplates([...detailsTemplates, ...newTemplates]);
    setShowDetailsDialog(false);
  };

  const handleAddAttributesTemplates = (selectedIds: number[]) => {
    const newTemplates = selectedIds
      .filter((id) => !attributesTemplates.some((t) => t.id === id))
      .map((id) => {
        const template = availableAttributesTemplates.find((t) => t.id === id);
        return {
          id: template!.id,
          title: template!.title,
          source: template!.source,
          data: {} as ICategoryAttr,
          formData: {},
        };
      });
    setAttributesTemplates([...attributesTemplates, ...newTemplates]);
    setShowAttributesDialog(false);
  };

  // Handle save
  const handleSave = async () => {
    try {
      // Build details list
      const detailsList = detailsTemplates.map((template) => {
        const finalData = JSON.parse(JSON.stringify(template.data));
        const formData = template.formData;

        // Apply static fields
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

        // Apply bind selections
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
          if (bind.platforms && formData.platform) {
            bind.platforms.forEach((platform: any) => {
              platform.selected = platform.value === formData.platform;
            });
          }
          if (bind.product_classes && formData.product_class) {
            bind.product_classes.forEach((productClass: any) => {
              productClass.selected =
                productClass.value === formData.product_class;
            });
          }
          if (bind.category_product_types && formData.category_product_type) {
            bind.category_product_types.forEach((cpt: any) => {
              cpt.selected = cpt.value === formData.category_product_type;
            });
          }
          if (bind.fake_reasons && formData.fake_reason) {
            bind.fake_reasons.forEach((reason: any) => {
              reason.selected = reason.text.toString() === formData.fake_reason;
            });
          }
          if (bind.category_data?.themes && formData.theme) {
            bind.category_data.themes.forEach((theme: any) => {
              theme.selected = theme.value === formData.theme;
            });
          }

          // Apply text fields
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
            if (bind[fieldName] && formData[fieldName] !== undefined) {
              bind[fieldName].value = formData[fieldName];
            }
          });
        }

        return finalData;
      });

      // Build attributes list
      const attributesList = attributesTemplates.map((template) => {
        const finalData = JSON.parse(JSON.stringify(template.data));
        const formData = template.formData;

        if (finalData.category_group_attributes) {
          Object.keys(finalData.category_group_attributes).forEach(
            (categoryId) => {
              const categoryData =
                finalData.category_group_attributes[categoryId];
              Object.keys(categoryData.attributes).forEach((attributeId) => {
                const attr = categoryData.attributes[attributeId];
                const fieldKey = attr.code || attr.id.toString();
                const formValue = formData[fieldKey];
                const hasFormValue = fieldKey in formData;

                if (hasFormValue) {
                  switch (attr.type) {
                    case "input":
                      attr.value =
                        formValue !== null && formValue !== undefined
                          ? formValue.toString()
                          : "";
                      break;
                    case "text":
                      if (
                        formValue !== null &&
                        formValue !== undefined &&
                        formValue !== ""
                      ) {
                        const lines = formValue
                          .toString()
                          .split("\n")
                          .filter((line: string) => line.trim() !== "");
                        attr.value = {
                          text_lines: lines,
                          original_text: formValue.toString(),
                        };
                      } else {
                        attr.value = "";
                      }
                      break;
                    case "select":
                      Object.keys(attr.values).forEach((valueId) => {
                        attr.values[valueId].selected = false;
                      });
                      if (formValue) {
                        // تبدیل به string برای اطمینان از تطابق کلید
                        const formValueStr = formValue.toString();
                        if (attr.values[formValueStr]) {
                          attr.values[formValueStr].selected = true;
                        }
                      }
                      break;
                    case "checkbox":
                      Object.keys(attr.values).forEach((valueId) => {
                        attr.values[valueId].selected = false;
                      });
                      if (Array.isArray(formValue) && formValue.length > 0) {
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
                }
              });
            }
          );
        }

        return finalData;
      });

      const finalProductData = {
        category_id:
          selectedCategory?.id || productData?.data?.category_id || 0,
        title: productTitle,
        description: productDescription,
        details: { list: detailsList },
        attributes: { list: attributesList },
        images: selectedImages,
        source: productData?.data?.source || TemplateSource.App,
        tag: "test",
        variant_data: {},
      };

      const response = await editProduct({
        id: productId,
        data: finalProductData as any,
      });

      if (response?.status === "true") {
        enqueueSnackbar("محصول با موفقیت به‌روزرسانی شد", {
          variant: "success",
        });
        navigate("/dashboard/products/list");
      } else {
        enqueueSnackbar("خطا در به‌روزرسانی محصول", { variant: "error" });
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      enqueueSnackbar(error?.message || "خطا در به‌روزرسانی محصول", {
        variant: "error",
      });
    }
  };

  // Loading state
  if (!productId || productId === 0) {
    return (
      <Layout title="ویرایش محصول">
        <Box sx={{ p: 3 }}>
          <Alert severity="error">شناسه محصول نامعتبر است.</Alert>
        </Box>
      </Layout>
    );
  }

  if (isProductLoading) {
    return (
      <Layout title="ویرایش محصول">
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="body1" color="text.secondary">
            در حال بارگذاری اطلاعات محصول...
          </Typography>
        </Box>
      </Layout>
    );
  }

  if (productError || !productData?.data) {
    return (
      <Layout title="ویرایش محصول">
        <Box sx={{ p: 3 }}>
          <Alert severity="error">
            خطا در بارگذاری اطلاعات محصول. لطفاً دوباره تلاش کنید.
          </Alert>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="ویرایش محصول">
      <Box sx={{ p: 3 }}>
        <TitleCard
          title={`ویرایش محصول: ${productData.data.title}`}
          description="اطلاعات محصول را ویرایش کنید."
        />

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Product Info Section */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader
                title="اطلاعات اصلی محصول"
                avatar={<Chip label="اجباری" color="primary" size="small" />}
              />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <DynamicTitleBuilder
                      value={productTitle}
                      onChange={setProductTitle}
                      attributesData={getAllAttributesData}
                      detailsData={getAllDetailsData}
                      label="عنوان محصول"
                      placeholder="عنوان محصول را وارد کنید..."
                    />
                    {productInfoValidation.errors.title && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {productInfoValidation.errors.title}
                      </Typography>
                    )}
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="توضیحات محصول"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      error={!!productInfoValidation.errors.description}
                      helperText={productInfoValidation.errors.description}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Alert severity="info">
                      دسته‌بندی محصول:{" "}
                      <strong>{selectedCategory?.title}</strong> (قابل تغییر
                      نیست)
                    </Alert>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Details Templates Section */}
          <Grid size={{ xs: 12 }}>
            <Card>
              {/* <CardHeader
                title="قالب‌های اطلاعات"
                action={
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleOpenDetailsDialog}
                    variant="outlined"
                    size="small"
                  >
                    افزودن قالب
                  </Button>
                }
              /> */}
              <CardContent>
                {detailsTemplates.length === 0 ? (
                  <Alert severity="warning">
                    هیچ قالب اطلاعاتی انتخاب نشده است.
                  </Alert>
                ) : (
                  <>
                    <Tabs
                      value={activeDetailsTab}
                      onChange={(_, newValue) => setActiveDetailsTab(newValue)}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      {detailsTemplates.map((template, index) => (
                        <Tab
                          key={index}
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {template.title}
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveDetailsTemplate(index);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          }
                        />
                      ))}
                    </Tabs>
                    <Divider sx={{ my: 2 }} />
                    {activeDetailsTemplate &&
                      activeDetailsTemplate.data &&
                      Object.keys(activeDetailsTemplate.data).length > 0 && (
                        <Grid container spacing={2}>
                          <ProductDetailsForm
                            data={activeDetailsTemplate.data as ICategoryDetails}
                            formData={activeDetailsTemplate.formData}
                            onFormDataChange={handleDetailsFormDataChange}
                            validationErrors={allDetailsValidationErrors}
                          />
                        </Grid>
                      )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Attributes Templates Section */}
          <Grid size={{ xs: 12 }}>
            <Card>
              {/* <CardHeader
                title="قالب‌های ویژگی"
                action={
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleOpenAttributesDialog}
                    variant="outlined"
                    size="small"
                  >
                    افزودن قالب
                  </Button>
                }
              /> */}
              <CardContent>
                {attributesTemplates.length === 0 ? (
                  <Alert severity="warning">
                    هیچ قالب ویژگی انتخاب نشده است.
                  </Alert>
                ) : (
                  <>
                    <Tabs
                      value={activeAttributesTab}
                      onChange={(_, newValue) =>
                        setActiveAttributesTab(newValue)
                      }
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      {attributesTemplates.map((template, index) => (
                        <Tab
                          key={index}
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {template.title}
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveAttributesTemplate(index);
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          }
                        />
                      ))}
                    </Tabs>
                    <Divider sx={{ my: 2 }} />
                    {activeAttributesTemplate &&
                      activeAttributesTemplate.data &&
                      Object.keys(activeAttributesTemplate.data).length > 0 && (
                        <ProductAttributesForm
                          data={activeAttributesTemplate.data as ICategoryAttr}
                          formData={activeAttributesTemplate.formData}
                          onFormDataChange={handleAttributesFormDataChange}
                          validationErrors={allAttributesValidationErrors}
                        />
                      )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Image Selection Section */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <ImageSelector
                  selectedImages={selectedImages}
                  onImagesChange={(selectedIds) =>
                    setSelectedImages(selectedIds)
                  }
                  // defaultType={MediaType.PRODUCT}
                />
              </CardContent>
            </Card>
          </Grid>

          {!isFormValid && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="warning">
                لطفاً تمام فیلدهای الزامی را پر کنید:
                <ul style={{ margin: "8px 0", paddingRight: "20px" }}>
                  {!productInfoValidation.isValid && (
                    <li>عنوان و توضیحات محصول را به درستی وارد کنید</li>
                  )}
                  {selectedImages.length === 0 && (
                    <li>حداقل یک تصویر برای محصول انتخاب کنید</li>
                  )}
                  {selectedImages.length > 0 &&
                    !selectedImagesData?.data?.list?.some(
                      (img) => img.product === true
                    ) && (
                      <li>
                        حداقل یکی از تصاویر انتخاب شده باید عکس محصول (product)
                        باشد
                      </li>
                    )}
                  {(detailsTemplates.length === 0 ||
                    attributesTemplates.length === 0) && (
                    <li>حداقل یک قالب برای جزئیات و ویژگی‌ها انتخاب کنید</li>
                  )}
                  {Object.keys(allDetailsValidationErrors).length > 0 && (
                    <li>فیلدهای الزامی در قالب‌های جزئیات را پر کنید</li>
                  )}
                  {Object.keys(allAttributesValidationErrors).length > 0 && (
                    <li>فیلدهای الزامی در قالب‌های ویژگی‌ها را پر کنید</li>
                  )}
                </ul>
              </Alert>
            </Grid>
          )}

          {/* Action Buttons */}
          <Grid size={{ xs: 12 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={() => navigate("/dashboard/products/list")}
                variant="outlined"
              >
                بازگشت
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={!isFormValid || isUpdating}
              >
                {isUpdating ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default EditProductPage;
