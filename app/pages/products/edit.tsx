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
import { TemplateSource } from "~/types/dtos/templates.dto";
import Layout from "~/components/layout/Layout";
import { TitleCard } from "~/components/common";
import { useProduct, useEditProduct } from "~/api/product.api";
import { useCategoriesList } from "~/api/categories.api";
import { useDetails, useDetail } from "~/api/details.api";
import { useAttrs, useAttr } from "~/api/attributes.api";
import type { ICategoryList } from "~/types/interfaces/categories.interface";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import DynamicTitleBuilder from "~/components/products/DynamicTitleBuilder";
import { useProductInfoValidation } from "~/validation";
import { DetailsForm, AttributesForm } from "~/components/forms";
import {
  createDetailsSchema,
  createAttributesSchema,
} from "~/validation/schemas/productSchema";
import { useSelectedImages } from "~/api/gallery.api";
import ImageSelector from "~/components/templates/ImageSelector";
import { MediaType } from "~/components/MediaManager/FileUpload";

interface TemplateData {
  id: number;
  title: string;
  source: TemplateSource;
  data: ICategoryDetails | ICategoryAttr;
  formData: { [key: string]: any };
  isValid: boolean;
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

  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategoryList | null>(null);
  const [detailsTemplates, setDetailsTemplates] = useState<TemplateData[]>([]);
  const [attributesTemplates, setAttributesTemplates] = useState<TemplateData[]>([]);
  const [activeDetailsTab, setActiveDetailsTab] = useState(0);
  const [activeAttributesTab, setActiveAttributesTab] = useState(0);

  const { data: productData, isLoading: isProductLoading, error: productError } = useProduct(productId);
  const { mutateAsync: editProduct, isPending: isUpdating } = useEditProduct();
  const { data: categoriesData } = useCategoriesList("", 1, 50);

  const activeDetailsTemplate = detailsTemplates[activeDetailsTab];
  const activeAttributesTemplate = attributesTemplates[activeAttributesTab];

  const { data: activeDetailsTemplateData } = useDetail(activeDetailsTemplate?.id || 0);
  const { data: activeAttributesTemplateData } = useAttr(activeAttributesTemplate?.id || 0);

  const productInfoValidation = useProductInfoValidation(productTitle, productDescription);
  const { data: selectedImagesData } = useSelectedImages(selectedImages);

  const isFormValid = useMemo(() => {
    if (!productInfoValidation.isValid) return false;
    if (selectedImages.length === 0) return false;
    const hasProductImage = selectedImagesData?.data?.list?.some((img) => img.product === true) || false;
    if (!hasProductImage) return false;
    if (detailsTemplates.some(t => !t.isValid)) return false;
    if (attributesTemplates.some(t => !t.isValid)) return false;
    return true;
  }, [productInfoValidation.isValid, selectedImages.length, selectedImagesData, detailsTemplates, attributesTemplates]);

    useEffect(() => {
    if (!productData?.data || !categoriesData?.data) return;

    const product = productData.data;

    setProductTitle(product.title);
    setProductDescription(product.description || "");
    setSelectedImages(product.images);

    const category = categoriesData.data.items.find((cat: ICategoryList) => cat.id === product.category_id);
    if (category) setSelectedCategory(category);

    if (product.details?.list) {
      const templates: TemplateData[] = product.details.list.map((detailData: ICategoryDetails, index: number) => ({
          id: (detailData as any).template_id || index + 1000,
          title: (detailData as any).template_title || `قالب ${index + 1}`,
          source: product.source,
          data: detailData,
          formData: {}, // This will be populated later
          isValid: false,
        }));
      setDetailsTemplates(templates);
    }

    if (product.attributes?.list) {
        const templates: TemplateData[] = product.attributes.list.map((attrData: ICategoryAttr, index: number) => ({
            id: (attrData as any).template_id || index + 2000,
            title: (attrData as any).template_title || `قالب ${index + 1}`,
            source: product.source,
            data: attrData,
            formData: {}, // This will be populated later
            isValid: false,
        }));
        setAttributesTemplates(templates);
    }
  }, [productData?.data, categoriesData?.data]);

  const detailsSchema = useMemo(() => activeDetailsTemplate?.data ? createDetailsSchema(activeDetailsTemplate.data as ICategoryDetails) : null, [activeDetailsTemplate]);
  const attributesSchema = useMemo(() => activeAttributesTemplate?.data ? createAttributesSchema(activeAttributesTemplate.data as ICategoryAttr) : null, [activeAttributesTemplate]);

  const handleDetailsSubmit = (data: any) => {
    const updatedTemplates = [...detailsTemplates];
    updatedTemplates[activeDetailsTab].formData = data;
    setDetailsTemplates(updatedTemplates);
    enqueueSnackbar("اطلاعات ذخیره موقت شد.", { variant: "info" });
  };

  const handleAttributesSubmit = (data: any) => {
    const updatedTemplates = [...attributesTemplates];
    updatedTemplates[activeAttributesTab].formData = data;
    setAttributesTemplates(updatedTemplates);
    enqueueSnackbar("ویژگی‌ها ذخیره موقت شد.", { variant: "info" });
  };

  const handleDetailsValidationChange = (isValid: boolean) => {
      setDetailsTemplates(prev => {
          const newTemplates = [...prev];
          if(newTemplates[activeDetailsTab]) newTemplates[activeDetailsTab].isValid = isValid;
          return newTemplates;
      })
  }

  const handleAttributesValidationChange = (isValid: boolean) => {
      setAttributesTemplates(prev => {
          const newTemplates = [...prev];
          if(newTemplates[activeAttributesTab]) newTemplates[activeAttributesTab].isValid = isValid;
          return newTemplates;
      })
  }

  const handleSave = async () => { /* ... same as before ... */ };

  if (!productId) return <Layout title="ویرایش محصول"><Alert severity="error">شناسه محصول نامعتبر است.</Alert></Layout>;
  if (isProductLoading) return <Layout title="ویرایش محصول"><CircularProgress /></Layout>;
  if (productError || !productData?.data) return <Layout title="ویرایش محصول"><Alert severity="error">خطا در بارگذاری اطلاعات محصول.</Alert></Layout>;

  return (
    <Layout title="ویرایش محصول">
      <Box sx={{ p: 3 }}>
        <TitleCard title={`ویرایش محصول: ${productData.data.title}`} description="اطلاعات محصول را ویرایش کنید." />
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}><Card><CardHeader title="اطلاعات اصلی محصول" avatar={<Chip label="اجباری" color="primary" size="small" />} /><CardContent>
              {/* ... Product Info fields ... */}
          </CardContent></Card></Grid>

          <Grid item xs={12}><Card><CardContent>
              {detailsTemplates.length === 0 ? <Alert severity="warning">هیچ قالب اطلاعاتی انتخاب نشده است.</Alert> : <>
                  <Tabs value={activeDetailsTab} onChange={(_, newValue) => setActiveDetailsTab(newValue)} variant="scrollable" scrollButtons="auto">
                      {detailsTemplates.map((template, index) => (
                          <Tab key={index} label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{template.title}<IconButton size="small" onClick={(e) => { e.stopPropagation(); /* ... */ }}><DeleteIcon fontSize="small" /></IconButton></Box>} />
                      ))}
                  </Tabs>
                  <Divider sx={{ my: 2 }} />
                  {activeDetailsTemplate && activeDetailsTemplate.data && Object.keys(activeDetailsTemplate.data).length > 0 && detailsSchema && (
                      <DetailsForm
                          detailsData={activeDetailsTemplate.data as ICategoryDetails}
                          onSubmit={handleDetailsSubmit}
                          validationSchema={detailsSchema}
                          defaultValues={activeDetailsTemplate.formData}
                          onValidationChange={handleDetailsValidationChange}
                      />
                  )}
              </>}
          </CardContent></Card></Grid>

          <Grid item xs={12}><Card><CardContent>
              {attributesTemplates.length === 0 ? <Alert severity="warning">هیچ قالب ویژگی انتخاب نشده است.</Alert> : <>
                  <Tabs value={activeAttributesTab} onChange={(_, newValue) => setActiveAttributesTab(newValue)} variant="scrollable" scrollButtons="auto">
                      {attributesTemplates.map((template, index) => (
                          <Tab key={index} label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>{template.title}<IconButton size="small" onClick={(e) => { e.stopPropagation(); /* ... */ }}><DeleteIcon fontSize="small" /></IconButton></Box>} />
                      ))}
                  </Tabs>
                  <Divider sx={{ my: 2 }} />
                  {activeAttributesTemplate && activeAttributesTemplate.data && Object.keys(activeAttributesTemplate.data).length > 0 && attributesSchema && (
                      <AttributesForm
                          attributesData={activeAttributesTemplate.data as ICategoryAttr}
                          onSubmit={handleAttributesSubmit}
                          validationSchema={attributesSchema}
                          defaultValues={activeAttributesTemplate.formData}
                          onValidationChange={handleAttributesValidationChange}
                      />
                  )}
              </>}
          </CardContent></Card></Grid>

          <Grid item xs={12}><Card><CardContent>
              <ImageSelector selectedImages={selectedImages} onImagesChange={setSelectedImages} />
          </CardContent></Card></Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => navigate("/products/list")} variant="outlined">بازگشت</Button>
              <Button onClick={handleSave} variant="contained" disabled={!isFormValid || isUpdating}>
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
