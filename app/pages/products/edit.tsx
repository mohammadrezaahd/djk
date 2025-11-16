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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router";
import { TemplateSource } from "../../types/dtos/templates.dto";
import Layout from "../../components/layout/Layout";
import { TitleCard } from "../../components/common";
import { useProduct, useEditProduct } from "../../api/product.api";
import { useCategoriesList } from "../../api/categories.api";
import { useDetails, useDetail } from "../../api/details.api";
import { useAttrs, useAttr } from "../../api/attributes.api";
import type { ICategoryList } from "../../types/interfaces/categories.interface";
import type { ITemplateList } from "../../types/interfaces/templates.interface";
import type { ICategoryAttr } from "../../types/interfaces/attributes.interface";
import type { ICategoryDetails } from "../../types/interfaces/details.interface";
import ProductDetailsForm from "../../components/products/ProductDetailsForm";
import ProductAttributesForm from "../../components/products/ProductAttributesForm";
import DynamicTitleBuilder from "../../components/products/DynamicTitleBuilder";
import {
  getAttributesTemplatesValidationErrors,
  getDetailsTemplatesValidationErrors,
  useProductInfoValidation,
} from "../../validation";
import { useSelectedImages } from "../../api/gallery.api";
import ImageSelector from "../../components/templates/ImageSelector";

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

  const [availableDetailsTemplates, setAvailableDetailsTemplates] = useState<
    ITemplateList[]
  >([]);
  const [availableAttributesTemplates, setAvailableAttributesTemplates] =
    useState<ITemplateList[]
  >([]);

  // API hooks
  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useProduct(productId);
  const { mutateAsync: editProduct, isPending: isUpdating } = useEditProduct();
  const { data: categoriesData } = useCategoriesList("", 1, 50);

  // Template data hooks for active templates
  const activeDetailsTemplate = detailsTemplates[activeDetailsTab];
  const activeAttributesTemplate = attributesTemplates[activeAttributesTab];

  const { data: activeDetailsTemplateData } = useDetail(
    activeDetailsTemplate?.id || 0
  );
  const { data: activeAttributesTemplateData } = useAttr(
    activeAttributesTemplate?.id || 0
  );

  const allDetailsValidationErrors = useMemo(() => {
    const allErrors = getDetailsTemplatesValidationErrors(detailsTemplates);
    const activeTemplateErrors = allErrors.find(
      (errorSet) => errorSet.templateId === activeDetailsTemplate?.id
    );
    return activeTemplateErrors?.errors || {};
  }, [detailsTemplates, activeDetailsTemplate?.id]);

  const allAttributesValidationErrors = useMemo(() => {
    const allErrors =
      getAttributesTemplatesValidationErrors(attributesTemplates);
    const activeTemplateErrors = allErrors.find(
      (errorSet) => errorSet.templateId === activeAttributesTemplate?.id
    );
    return activeTemplateErrors?.errors || {};
  }, [attributesTemplates, activeAttributesTemplate?.id]);

  const productInfoValidation = useProductInfoValidation(
    productTitle,
    productDescription
  );

  const { data: selectedImagesData } = useSelectedImages(selectedImages);

  const isFormValid = useMemo(() => {
    if (!productInfoValidation.isValid) return false;
    if (selectedImages.length === 0) return false;
    const hasProductImage =
      selectedImagesData?.data?.list?.some((img) => img.product === true) ||
      false;
    if (!hasProductImage) return false;
    if (detailsTemplates.length === 0 || attributesTemplates.length === 0) {
      return false;
    }
    const hasDetailsErrors = Object.keys(allDetailsValidationErrors).length > 0;
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

  const getAllAttributesData = useMemo(() => {
    return attributesTemplates
      .map((template) => template.data)
      .filter((data): data is ICategoryAttr => "category_group_attributes" in data);
  }, [attributesTemplates]);

  const getAllDetailsData = useMemo(() => {
    return detailsTemplates
      .map((template) => template.data)
      .filter((data): data is ICategoryDetails => "bind" in data);
  }, [detailsTemplates]);

  // Load product data
  useEffect(() => {
    if (!productData?.data || !categoriesData?.data) return;

    const product = productData.data;
    setProductTitle(product.title);
    setProductDescription(product.description || "");
    setSelectedImages(product.images);

    const category = categoriesData.data.items.find(
      (cat: ICategoryList) => cat.id === product.category_id
    );
    if (category) {
      setSelectedCategory(category);
    }

    if (product.details?.list) {
      const templates: TemplateData[] = product.details.list.map(
        (detailData: any, index: number) => {
          const formData: { [key: string]: any } = {};
          const staticFields = ["is_fake_product", "brand", "status", "platform", "product_class", "category_product_type", "fake_reason", "theme", "id_type", "general_mefa_id", "custom_id"];
          staticFields.forEach(field => {
            if (detailData[field] !== undefined) formData[field] = detailData[field];
          });
          if (detailData.bind) {
            const textFields = ["brand_model", "color_pattern", "warranty", "size", "weight", "material", "origin_country", "manufacturer", "model_number", "barcode", "package_dimensions", "special_features", "care_instructions"];
            textFields.forEach(fieldName => {
              if (detailData.bind[fieldName]?.value !== undefined) formData[fieldName] = detailData.bind[fieldName].value;
            });
          }
          return {
            id: detailData.template_id || index + 1000,
            title: detailData.template_title || `قالب ${index + 1}`,
            source: product.source,
            data: detailData,
            formData,
          };
        }
      );
      setDetailsTemplates(templates);
    }

    if (product.attributes?.list) {
      const templates: TemplateData[] = product.attributes.list.map(
        (attrData: any, index: number) => {
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
                        formData[fieldKey] = typeof attr.value === 'object' ? attr.value.original_text : attr.value;
                      }
                      break;
                    case "select":
                      const selectedValue = Object.entries(attr.values || {}).find(([_, v]: [string, any]) => v.selected)?.[0];
                      if (selectedValue) formData[fieldKey] = selectedValue;
                      break;
                    case "checkbox":
                      const selectedValues = Object.entries(attr.values || {}).filter(([_, v]: [string, any]) => v.selected).map(([k, _]) => k);
                      if (selectedValues.length > 0) formData[fieldKey] = selectedValues;
                      break;
                  }
                });
              }
            );
          }
          return {
            id: attrData.template_id || index + 2000,
            title: attrData.template_title || `قالب ${index + 1}`,
            source: product.source,
            data: attrData,
            formData,
          };
        }
      );
      setAttributesTemplates(templates);
    }
  }, [productData?.data, categoriesData?.data]);

  useEffect(() => {
    if (activeDetailsTemplateData?.data && activeDetailsTemplate && Object.keys(activeDetailsTemplate.data).length === 0) {
      const updatedTemplates = [...detailsTemplates];
      updatedTemplates[activeDetailsTab].data = activeDetailsTemplateData.data.data_json;
      setDetailsTemplates(updatedTemplates);
    }
  }, [activeDetailsTemplateData?.data, activeDetailsTemplate]);

  useEffect(() => {
    if (activeAttributesTemplateData?.data && activeAttributesTemplate && Object.keys(activeAttributesTemplate.data).length === 0) {
      const updatedTemplates = [...attributesTemplates];
      updatedTemplates[activeAttributesTab].data = activeAttributesTemplateData.data.data_json;
      setAttributesTemplates(updatedTemplates);
    }
  }, [activeAttributesTemplateData?.data, activeAttributesTemplate]);

  const handleDetailsFormDataChange = (fieldName: string, value: any) => {
    const updatedTemplates = [...detailsTemplates];
    updatedTemplates[activeDetailsTab].formData[fieldName] = value;
    setDetailsTemplates(updatedTemplates);
  };

  const handleAttributesFormDataChange = (fieldId: number | string, value: any) => {
    const updatedTemplates = [...attributesTemplates];
    const fieldKey = fieldId.toString();
    updatedTemplates[activeAttributesTab].formData[fieldKey] = value;
    setAttributesTemplates(updatedTemplates);
  };

  const handleRemoveDetailsTemplate = (index: number) => {
    const newTemplates = detailsTemplates.filter((_, i) => i !== index);
    setDetailsTemplates(newTemplates);
    setActiveDetailsTab(Math.max(0, newTemplates.length - 1));
  };

  const handleRemoveAttributesTemplate = (index: number) => {
    const newTemplates = attributesTemplates.filter((_, i) => i !== index);
    setAttributesTemplates(newTemplates);
    setActiveAttributesTab(Math.max(0, newTemplates.length - 1));
  };

  const handleSave = async () => {
    try {
        const detailsList = detailsTemplates.map(template => {
            const finalData = JSON.parse(JSON.stringify(template.data));
            const { formData } = template;

            const staticFields = ["is_fake_product", "brand", "status", "platform", "product_class", "category_product_type", "fake_reason", "theme", "id_type", "general_mefa_id", "custom_id"];
            staticFields.forEach(field => {
                if (formData[field] !== undefined && formData[field] !== null && formData[field] !== '') {
                    finalData[field] = formData[field];
                }
            });

            if (finalData.bind) {
                const { bind } = finalData;
                if (bind.brands && formData.brand) bind.brands.forEach((brand: any) => { brand.selected = brand.id === formData.brand; });
                if (bind.statuses && formData.status) bind.statuses.forEach((status: any) => { status.selected = status.value === formData.status; });
                if (bind.platforms && formData.platform) bind.platforms.forEach((platform: any) => { platform.selected = platform.value === formData.platform; });
                if (bind.product_classes && formData.product_class) bind.product_classes.forEach((productClass: any) => { productClass.selected = productClass.value === formData.product_class; });
                if (bind.category_product_types && formData.category_product_type) bind.category_product_types.forEach((cpt: any) => { cpt.selected = cpt.value === formData.category_product_type; });
                if (bind.fake_reasons && formData.fake_reason) bind.fake_reasons.forEach((reason: any) => { reason.selected = reason.text.toString() === formData.fake_reason; });
                if (bind.category_data?.themes && formData.theme) bind.category_data.themes.forEach((theme: any) => { theme.selected = theme.value === formData.theme; });

                const textFields = ["brand_model", "color_pattern", "warranty", "size", "weight", "material", "origin_country", "manufacturer", "model_number", "barcode", "package_dimensions", "special_features", "care_instructions"];
                textFields.forEach(fieldName => {
                    if (bind[fieldName] && formData[fieldName] !== undefined) {
                        bind[fieldName].value = formData[fieldName];
                    }
                });
            }
            return finalData;
        });

        const attributesList = attributesTemplates.map(template => {
            const finalData = JSON.parse(JSON.stringify(template.data));
            const { formData } = template;
            if (finalData.category_group_attributes) {
                Object.values(finalData.category_group_attributes).forEach((categoryData: any) => {
                    Object.values(categoryData.attributes).forEach((attr: any) => {
                        const fieldKey = attr.code || attr.id.toString();
                        const formValue = formData[fieldKey];
                        if (fieldKey in formData) {
                            switch (attr.type) {
                                case 'input':
                                    attr.value = formValue?.toString() ?? '';
                                    break;
                                case 'text':
                                    if (formValue) {
                                        const lines = formValue.toString().split('\n').filter((line: string) => line.trim() !== '');
                                        attr.value = { text_lines: lines, original_text: formValue.toString() };
                                    } else {
                                        attr.value = '';
                                    }
                                    break;
                                case 'select':
                                    Object.keys(attr.values).forEach(valueId => { attr.values[valueId].selected = false; });
                                    if (formValue && attr.values[formValue.toString()]) {
                                        attr.values[formValue.toString()].selected = true;
                                    }
                                    break;
                                case 'checkbox':
                                    Object.keys(attr.values).forEach(valueId => { attr.values[valueId].selected = false; });
                                    if (Array.isArray(formValue) && formValue.length > 0) {
                                        formValue.forEach((valueId: any) => {
                                            if (attr.values[valueId.toString()]) {
                                                attr.values[valueId.toString()].selected = true;
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

      const finalProductData = {
        category_id: selectedCategory?.id || productData?.data?.category_id || 0,
        title: productTitle,
        description: productDescription,
        details: { list: detailsList },
        attributes: { list: attributesList },
        images: selectedImages,
        source: productData?.data?.source || TemplateSource.App,
        tag: "test",
        variant_data: {},
      };

      const response = await editProduct({ id: productId, data: finalProductData as any });
      if (response?.status === "true") {
        enqueueSnackbar("محصول با موفقیت به‌روزرسانی شد", { variant: "success" });
        navigate("/products/list");
      } else {
        enqueueSnackbar("خطا در به‌روزرسانی محصول", { variant: "error" });
      }
    } catch (error: any) {
      enqueueSnackbar(error?.message || "خطا در به‌روزرسانی محصول", { variant: "error" });
    }
  };

  if (!productId) {
    return <Layout title="ویرایش محصول"><Alert severity="error">شناسه محصول نامعتبر است.</Alert></Layout>;
  }

  if (isProductLoading) {
    return <Layout title="ویرایش محصول"><CircularProgress /></Layout>;
  }

  if (productError || !productData?.data) {
    return <Layout title="ویرایش محصول"><Alert severity="error">خطا در بارگذاری اطلاعات محصول.</Alert></Layout>;
  }

  return (
    <Layout title="ویرایش محصول">
      <Box sx={{ p: 3 }}>
        <TitleCard title={`ویرایش محصول: ${productData.data.title}`} description="اطلاعات محصول را ویرایش کنید." />
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="اطلاعات اصلی محصول" avatar={<Chip label="اجباری" color="primary" size="small" />} />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <DynamicTitleBuilder value={productTitle} onChange={setProductTitle} attributesData={getAllAttributesData} detailsData={getAllDetailsData} label="عنوان محصول" />
                    {productInfoValidation.errors.title && <Typography variant="caption" color="error">{productInfoValidation.errors.title}</Typography>}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="توضیحات محصول" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} error={!!productInfoValidation.errors.description} helperText={productInfoValidation.errors.description} />
                  </Grid>
                  <Grid item xs={12}><Alert severity="info">دسته‌بندی محصول: <strong>{selectedCategory?.title}</strong> (قابل تغییر نیست)</Alert></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                {detailsTemplates.length === 0 ? <Alert severity="warning">هیچ قالب اطلاعاتی انتخاب نشده است.</Alert> :
                  <>
                    <Tabs value={activeDetailsTab} onChange={(_, newValue) => setActiveDetailsTab(newValue)} variant="scrollable" scrollButtons="auto">
                      {detailsTemplates.map((template, index) => <Tab key={index} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{template.title}<IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRemoveDetailsTemplate(index); }}><DeleteIcon fontSize="small" /></IconButton></Box>} />)}
                    </Tabs>
                    <Divider sx={{ my: 2 }} />
                    {activeDetailsTemplate?.data && Object.keys(activeDetailsTemplate.data).length > 0 &&
                      <ProductDetailsForm data={activeDetailsTemplate.data as ICategoryDetails} formData={activeDetailsTemplate.formData} onFormDataChange={handleDetailsFormDataChange} validationErrors={allDetailsValidationErrors} />}
                  </>
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                {attributesTemplates.length === 0 ? <Alert severity="warning">هیچ قالب ویژگی انتخاب نشده است.</Alert> :
                  <>
                    <Tabs value={activeAttributesTab} onChange={(_, newValue) => setActiveAttributesTab(newValue)} variant="scrollable" scrollButtons="auto">
                      {attributesTemplates.map((template, index) => <Tab key={index} label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>{template.title}<IconButton size="small" onClick={(e) => { e.stopPropagation(); handleRemoveAttributesTemplate(index); }}><DeleteIcon fontSize="small" /></IconButton></Box>} />)}
                    </Tabs>
                    <Divider sx={{ my: 2 }} />
                    {activeAttributesTemplate?.data && Object.keys(activeAttributesTemplate.data).length > 0 &&
                      <ProductAttributesForm data={activeAttributesTemplate.data as ICategoryAttr} formData={activeAttributesTemplate.formData} onFormDataChange={handleAttributesFormDataChange} validationErrors={allAttributesValidationErrors} />}
                  </>
                }
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <ImageSelector selectedImages={selectedImages} onImagesChange={setSelectedImages} />
              </CardContent>
            </Card>
          </Grid>
          {!isFormValid &&
            <Grid item xs={12}>
              <Alert severity="warning">
                لطفاً تمام فیلدهای الزامی را پر کنید:
                <ul style={{ margin: "8px 0", paddingRight: "20px" }}>
                  {!productInfoValidation.isValid && <li>عنوان و توضیحات محصول را به درستی وارد کنید</li>}
                  {selectedImages.length === 0 && <li>حداقل یک تصویر برای محصول انتخاب کنید</li>}
                  {selectedImages.length > 0 && !selectedImagesData?.data?.list?.some(img => img.product) && <li>حداقل یکی از تصاویر انتخاب شده باید عکس محصول باشد</li>}
                  {(detailsTemplates.length === 0 || attributesTemplates.length === 0) && <li>حداقل یک قالب برای جزئیات و ویژگی‌ها انتخاب کنید</li>}
                  {Object.keys(allDetailsValidationErrors).length > 0 && <li>فیلدهای الزامی در قالب‌های جزئیات را پر کنید</li>}
                  {Object.keys(allAttributesValidationErrors).length > 0 && <li>فیلدهای الزامی در قالب‌های ویژگی‌ها را پر کنید</li>}
                </ul>
              </Alert>
            </Grid>
          }
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => navigate("/products/list")} variant="outlined">بازگشت</Button>
              <Button onClick={handleSave} variant="contained" disabled={!isFormValid || isUpdating}>{isUpdating ? "در حال ذخیره..." : "ذخیره تغییرات"}</Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default EditProductPage;