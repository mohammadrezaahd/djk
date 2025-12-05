import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useAttr, useEditAttr } from "~/api/attributes.api";
import { useDetail, useEditDetail } from "~/api/details.api";

import AppLayout from "~/components/layout/AppLayout";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  setAttributesData,
  resetAttributes,
  getFinalAttributesObject,
  loadTemplateData,
} from "~/store/slices/attributesSlice";
import {
  setDetailsData,
  resetDetails,
  updateFormField,
  getFinalDetailsObject,
  setImages as setDetailsImages,
} from "~/store/slices/detailsSlice";
import ActionButtons from "~/components/templates/ActionButtons";
import AttributesTab from "~/components/templates/attributes/AttributesTab";
import DetailsTab from "~/components/templates/details/DetailsTab";
import { useSnackbar } from "notistack";
import { ApiStatus } from "~/types";
import { TitleCard } from "~/components/common";

export function meta() {
  return [
    { title: "ویرایش قالب" },
    { name: "description", content: "صفحه ویرایش قالب فروشگاه" },
  ];
}

type TemplateType = "attributes" | "details";

const EditTemplatePage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();

  const attributesStore = useAppSelector((state) => state.attributes);
  const detailsStore = useAppSelector((state) => state.details);

  // URL parameters
  const templateId = parseInt(searchParams.get("id") || "0");
  const templateType = (searchParams.get("type") ||
    "attributes") as TemplateType;

  // Form validation states
  const [isAttributesValid, setIsAttributesValid] = useState(false);
  const [isDetailsValid, setIsDetailsValid] = useState(false);

  // Current form validity based on template type
  const isCurrentFormValid =
    templateType === "attributes" ? isAttributesValid : isDetailsValid;

  // React Query hooks for template data only
  const {
    data: attributeData,
    isLoading: attributeLoading,
    error: attributeError,
  } = useAttr(templateType === "attributes" ? templateId : 0);

  const {
    data: detailData,
    isLoading: detailLoading,
    error: detailError,
  } = useDetail(templateType === "details" ? templateId : 0);

  const {
    mutateAsync: editAttribute,
    isPending: isAttributesSaving,
    error: attributesError,
    isSuccess: attributesSuccess,
  } = useEditAttr();

  const {
    mutateAsync: editDetail,
    isPending: isDetailsSaving,
    error: detailsError,
    isSuccess: detailsSuccess,
  } = useEditDetail();

  // State to control when to show the form (after data is loaded)
  const [isFormReady, setIsFormReady] = useState(false);

  // Load template data and populate form
  useEffect(() => {
    if (
      templateType === "attributes" &&
      attributeData?.status === ApiStatus.SUCCEEDED &&
      attributeData.data
    ) {
      // Load the category data for this template if it has data_json
      if (attributeData.data.data_json) {
        dispatch(
          setAttributesData({
            categoryId: attributeData.data.category_id,
            data: attributeData.data.data_json,
          })
        );

        // Use the new loadTemplateData action to properly handle all field types including text fields
        dispatch(
          loadTemplateData({
            templateData: attributeData.data.data_json,
            title: attributeData.data.title,
            description: attributeData.data.description || "",
            images: attributeData.data.images || [],
          })
        );

        // Mark form as ready after a small delay to ensure store updates are complete
        setTimeout(() => setIsFormReady(true), 100);
      }
    }
  }, [attributeData, dispatch, templateType]);

  useEffect(() => {
    if (
      templateType === "details" &&
      detailData?.status === ApiStatus.SUCCEEDED &&
      detailData.data
    ) {
      // Set template data in store
      console.log("🔍 Setting details title:", detailData.data.title);

      // Load images from template
      if (detailData.data.images && Array.isArray(detailData.data.images)) {
        dispatch(setDetailsImages(detailData.data.images));
      }

      // Use setTimeout to ensure store update happens after current execution
      setTimeout(() => {
        if (detailData.data) {
          dispatch(
            updateFormField({
              fieldName: "title",
              value: detailData.data.title,
            })
          );
          dispatch(
            updateFormField({
              fieldName: "description",
              value: detailData.data.description || "",
            })
          );

          // Cast to access tag property if it exists
          const detailWithTag = detailData.data as any;
          if (detailWithTag.tag) {
            dispatch(
              updateFormField({ fieldName: "tag", value: detailWithTag.tag })
            );
          }
        }
      }, 50);

      // Load the category data for this template if it has data_json
      if (detailData.data.data_json) {
        dispatch(
          setDetailsData({
            categoryId: detailData.data.category_id || 1,
            data: detailData.data.data_json,
          })
        );

        // Populate form data from stored values
        const templateData = detailData.data.data_json;

        // Populate various form fields from the template data
        if (templateData.brand) {
          dispatch(
            updateFormField({ fieldName: "brand", value: templateData.brand })
          );
        }
        if (templateData.status) {
          dispatch(
            updateFormField({ fieldName: "status", value: templateData.status })
          );
        }
        if (templateData.platform) {
          dispatch(
            updateFormField({
              fieldName: "platform",
              value: templateData.platform,
            })
          );
        }
        if (templateData.product_class) {
          dispatch(
            updateFormField({
              fieldName: "product_class",
              value: templateData.product_class,
            })
          );
        }
        if (templateData.category_product_type) {
          dispatch(
            updateFormField({
              fieldName: "category_product_type",
              value: templateData.category_product_type,
            })
          );
        }
        if (templateData.theme) {
          dispatch(
            updateFormField({ fieldName: "theme", value: templateData.theme })
          );
        }
        if (templateData.id_type) {
          dispatch(
            updateFormField({
              fieldName: "id_type",
              value: templateData.id_type,
            })
          );
        }
        if (templateData.general_mefa_id) {
          dispatch(
            updateFormField({
              fieldName: "general_mefa_id",
              value: templateData.general_mefa_id,
            })
          );
        }
        if (templateData.custom_id) {
          dispatch(
            updateFormField({
              fieldName: "custom_id",
              value: templateData.custom_id,
            })
          );
        }
        if (templateData.is_fake_product !== undefined) {
          dispatch(
            updateFormField({
              fieldName: "is_fake_product",
              value: templateData.is_fake_product,
            })
          );
        }
        if (templateData.fake_reason) {
          dispatch(
            updateFormField({
              fieldName: "fake_reason",
              value: templateData.fake_reason,
            })
          );
        }

        // Load text field values from bind (IStringField type fields)
        if (templateData.bind) {
          const bind = templateData.bind as any;
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
            if (bind[fieldName]?.value) {
              dispatch(
                updateFormField({
                  fieldName: fieldName,
                  value: bind[fieldName].value,
                })
              );
            }
          });
        }

        // Mark form as ready for details
        if (templateType === "details") {
          setTimeout(() => setIsFormReady(true), 100);
        }
      }
    }
  }, [detailData, dispatch, templateType]);

  const handleSubmit = async () => {
    // Prepare final data for PUT request
    if (templateType === "attributes") {
      const finalData = getFinalAttributesObject({
        attributes: attributesStore,
      });

      if (!finalData) {
        enqueueSnackbar("خطا در آماده‌سازی داده‌ها", { variant: "error" });
        return;
      }

      const res = await editAttribute({ id: templateId, data: finalData });
      if (res.status === ApiStatus.SUCCEEDED) {
        enqueueSnackbar("ویژگی با موفقیت ویرایش شد", { variant: "success" });
      } else {
        enqueueSnackbar("خطا در ویرایش ویژگی", { variant: "error" });
      }
    } else {
      const finalData = getFinalDetailsObject({
        details: detailsStore,
      });

      if (!finalData) {
        enqueueSnackbar("خطا در آماده‌سازی داده‌ها", { variant: "error" });
        return;
      }

      const res = await editDetail({ id: templateId, data: finalData });
      if (res.status === ApiStatus.SUCCEEDED) {
        enqueueSnackbar("ویژگی با موفقیت ویرایش شد", { variant: "success" });
      } else {
        enqueueSnackbar("خطا در ویرایش ویژگی", { variant: "error" });
      }
    }
  };

  const handleReset = () => {
    if (templateType === "attributes") {
      dispatch(resetAttributes());
    } else {
      dispatch(resetDetails());
    }
  };

  // Loading state
  const isLoading =
    templateType === "attributes" ? attributeLoading : detailLoading;
  const dataError =
    templateType === "attributes" ? attributeError : detailError;

  // Error handling
  if (dataError) {
    return (
      <AppLayout title="ویرایش قالب">
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت اطلاعات قالب: {dataError.message}
        </Alert>
      </AppLayout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <AppLayout title="ویرایش قالب">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            در حال بارگذاری اطلاعات قالب...
          </Typography>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="ویرایش قالب">
      <Container maxWidth="lg">
      <TitleCard title="ویرایش قالب " description="ویرایش اطلاعات قالب‌" />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 12 }}>
            <Grid container spacing={3}>
              {/* Form Section */}
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {templateType === "attributes"
                        ? "فرم ویژگی‌ها"
                        : "فرم اطلاعات"}
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                      {isFormReady ? (
                        <Grid container spacing={3}>
                          {templateType === "attributes" && (
                            <AttributesTab
                              onValidationChange={setIsAttributesValid}
                              isLoading={attributeLoading}
                            />
                          )}
                          {templateType === "details" && (
                            <DetailsTab
                              onValidationChange={setIsDetailsValid}
                              isLoading={detailLoading}
                            />
                          )}
                        </Grid>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "200px",
                          }}
                        >
                          <CircularProgress size={30} />
                          <Typography sx={{ ml: 2 }}>
                            در حال آماده‌سازی فرم...
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Action Buttons */}
              {isFormReady && (
                <ActionButtons
                  activeTab={templateType === "attributes" ? 0 : 1}
                  onSubmit={handleSubmit}
                  onReset={handleReset}
                  isFormValid={isCurrentFormValid}
                  isEditMode={true}
                  loading={
                    templateType === "attributes"
                      ? isAttributesSaving
                      : isDetailsSaving
                  }
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AppLayout>
  );
};

export default EditTemplatePage;
