import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
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
  setTitle,
  setDescription,
  updateFormField as updateAttributeFormField,
  getFinalAttributesObject,
} from "~/store/slices/attributesSlice";
import {
  setDetailsData,
  resetDetails,
  updateFormField,
  getFinalDetailsObject,
} from "~/store/slices/detailsSlice";
import ActionButtons from "~/components/templates/ActionButtons";
import AttributesTab from "~/components/templates/attributes/AttributesTab";
import DetailsTab from "~/components/templates/details/DetailsTab";
import { useSnackbar } from "notistack";
import { ApiStatus } from "~/types";

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
      // Set template data in store
      dispatch(setTitle(attributeData.data.title));
      dispatch(setDescription(attributeData.data.description || ""));

      // Load the category data for this template if it has data_json
      if (attributeData.data.data_json) {
        dispatch(
          setAttributesData({
            categoryId: 1, // We'll use a placeholder categoryId since we're in edit mode
            data: attributeData.data.data_json,
          })
        );

        // Populate form data from stored values if they exist
        // We need to extract the form values from data_json and populate them
        const templateData = attributeData.data.data_json;
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
                  dispatch(
                    updateAttributeFormField({
                      fieldId: attr.id.toString(),
                      value: numericValue,
                    })
                  );
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
                    dispatch(
                      updateAttributeFormField({
                        fieldId: attr.id.toString(),
                        value,
                      })
                    );
                  }
                }
              });
            }
          );
        }

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
            categoryId: 1, // We'll use a placeholder categoryId since we're in edit mode
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
      <AppLayout>
        <Alert severity="error" sx={{ mb: 2 }}>
          خطا در دریافت اطلاعات قالب: {dataError.message}
        </Alert>
      </AppLayout>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <AppLayout>
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
    <AppLayout>
      <Typography variant="h4" gutterBottom>
        ویرایش قالب {templateType === "attributes" ? "ویژگی‌ها" : "اطلاعات"}
      </Typography>

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
                    ? attributeLoading
                    : detailLoading
                }
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default EditTemplatePage;
