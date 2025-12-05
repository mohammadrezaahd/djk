import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import DynamicTitleBuilder from "../DynamicTitleBuilder";
import { DeleteIcon } from "~/components/icons/IconComponents";
import ImageSelector from "~/components/templates/ImageSelector";
import ProductAttributesForm from "../ProductAttributesForm";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import ProductDetailsForm from "../ProductDetailsForm";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import React, { useState, useMemo, useEffect } from "react";
import { useCategoriesList } from "~/api/categories.api";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import type { TemplateSource } from "~/types/dtos/templates.dto";
import type { ApiResponseData } from "~/types";
import type { IGetProduct } from "~/types/interfaces/products.interface";

interface AppEditProductProps {
  productData: ApiResponseData<IGetProduct>;
  productTitle: string;
  productDescription: string;
  selectedImages: number[];
  detailsTemplates: TemplateData[];
  attributesTemplates: TemplateData[];
  activeDetailsTab: number;
  activeAttributesTab: number;
  productInfoValidation: {
    isValid: boolean;
    errors: { [key: string]: string };
  };
  allDetailsValidationErrors: { [key: string]: string };
  allAttributesValidationErrors: { [key: string]: string };
  onProductTitleChange: (value: string) => void;
  onProductDescriptionChange: (value: string) => void;
  onImagesChange: (images: number[]) => void;
  onDetailsTemplatesChange: (templates: TemplateData[]) => void;
  onAttributesTemplatesChange: (templates: TemplateData[]) => void;
  onActiveDetailsTabChange: (tab: number) => void;
  onActiveAttributesTabChange: (tab: number) => void;
}

interface TemplateData {
  id: number;
  title: string;
  source: TemplateSource;
  data: ICategoryDetails | ICategoryAttr;
  formData: { [key: string]: any };
}

const AppEditProduct: React.FC<AppEditProductProps> = ({
  productData,
  productTitle,
  productDescription,
  selectedImages,
  detailsTemplates,
  attributesTemplates,
  activeDetailsTab,
  activeAttributesTab,
  productInfoValidation,
  allDetailsValidationErrors,
  allAttributesValidationErrors,
  onProductTitleChange,
  onProductDescriptionChange,
  onImagesChange,
  onDetailsTemplatesChange,
  onAttributesTemplatesChange,
  onActiveDetailsTabChange,
  onActiveAttributesTabChange,
}) => {
  // All useState hooks first
  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryList | null>(null);

  // All API hooks
  const { data: categoriesData } = useCategoriesList("", 1, 50);

  // Template references
  const activeDetailsTemplate = detailsTemplates[activeDetailsTab];
  const activeAttributesTemplate = attributesTemplates[activeAttributesTab];

  // All useMemo hooks
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

  // Set category when data is available
  React.useEffect(() => {
    if (!productData?.data || !categoriesData?.data) return;

    const category = categoriesData.data.items.find(
      (cat: ICategoryList) => cat.id === productData.data?.category_id
    );
    if (category) {
      setSelectedCategory(category);
    }
  }, [productData?.data?.category_id, categoriesData?.data]);

  // Handle form data changes
  const handleDetailsFormDataChange = (fieldName: string, value: any) => {
    const updatedTemplates = [...detailsTemplates];
    updatedTemplates[activeDetailsTab].formData[fieldName] = value;
    onDetailsTemplatesChange(updatedTemplates);
  };

  const handleAttributesFormDataChange = (
    fieldId: number | string,
    value: any
  ) => {
    const updatedTemplates = [...attributesTemplates];
    const fieldKey = typeof fieldId === "string" ? fieldId : fieldId.toString();
    updatedTemplates[activeAttributesTab].formData[fieldKey] = value;
    onAttributesTemplatesChange(updatedTemplates);
  };

  // Handle template removal
  const handleRemoveDetailsTemplate = (index: number) => {
    const newTemplates = detailsTemplates.filter((_, i) => i !== index);
    onDetailsTemplatesChange(newTemplates);
    if (activeDetailsTab >= newTemplates.length) {
      onActiveDetailsTabChange(Math.max(0, newTemplates.length - 1));
    }
  };

  const handleRemoveAttributesTemplate = (index: number) => {
    const newTemplates = attributesTemplates.filter((_, i) => i !== index);
    onAttributesTemplatesChange(newTemplates);
    if (activeAttributesTab >= newTemplates.length) {
      onActiveAttributesTabChange(Math.max(0, newTemplates.length - 1));
    }
  };

  return (
    <>
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
                  onChange={onProductTitleChange}
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
                  onChange={(e) => onProductDescriptionChange(e.target.value)}
                  error={!!productInfoValidation.errors.description}
                  helperText={productInfoValidation.errors.description}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Alert severity="info">
                  دسته‌بندی محصول: <strong>{selectedCategory?.title}</strong>{" "}
                  (قابل تغییر نیست)
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Details Templates Section */}
      <Grid size={{ xs: 12 }}>
        <Card>
          <CardContent>
            {detailsTemplates.length === 0 ? (
              <Alert severity="warning">
                هیچ قالب اطلاعاتی انتخاب نشده است.
              </Alert>
            ) : (
              <>
                <Tabs
                  value={activeDetailsTab}
                  onChange={(_, newValue) => onActiveDetailsTabChange(newValue)}
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
                            <DeleteIcon size="small" />
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
          <CardContent>
            {attributesTemplates.length === 0 ? (
              <Alert severity="warning">هیچ قالب ویژگی انتخاب نشده است.</Alert>
            ) : (
              <>
                <Tabs
                  value={activeAttributesTab}
                  onChange={(_, newValue) =>
                    onActiveAttributesTabChange(newValue)
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
                            <DeleteIcon size="small" />
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
              onImagesChange={onImagesChange}
            />
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default AppEditProduct;
