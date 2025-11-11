import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAttr, useEditAttr } from "~/api/attributes.api";
import { useDetail, useEditDetail } from "~/api/details.api";

import AppLayout from "~/components/layout/AppLayout";

import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  setAttributesData,
  resetAttributes,
  getFinalAttributesObject,
  loadTemplateData,
  updateFormField as updateAttributeFormField,
} from "~/store/slices/attributesSlice";
import {
  setDetailsData,
  resetDetails,
  getFinalDetailsObject,
  updateFormField as updateDetailFormField,
  setImages as setDetailsImages,
} from "~/store/slices/detailsSlice";
import ActionButtons from "~/components/templates/ActionButtons";
import AttributesTab from "~/components/templates/attributes/AttributesTab";
import DetailsTab from "~/components/templates/details/DetailsTab";
import { useSnackbar } from "notistack";
import { ApiStatus } from "~/types";
import { TitleCard } from "~/components/common";
import {
  createDetailsSchema,
  createAttributesSchema,
} from "~/validation/schemas/productSchema";
import type { ICategoryDetails } from "~/types/interfaces/details.interface";
import type { ICategoryAttr } from "~/types/interfaces/attributes.interface";

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
  const formRef = useRef<any>(null);

  const attributesStore = useAppSelector((state) => state.attributes);
  const detailsStore = useAppSelector((state) => state.details);

  const templateId = parseInt(searchParams.get("id") || "0");
  const templateType = (searchParams.get("type") || "attributes") as TemplateType;

  const [isFormReady, setIsFormReady] = useState(false);

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

  const { mutateAsync: editAttribute, isPending: isAttributesSaving } = useEditAttr();
  const { mutateAsync: editDetail, isPending: isDetailsSaving } = useEditDetail();

  useEffect(() => {
    if (templateType === "attributes" && attributeData?.data) {
      if (attributeData.data.data_json) {
        dispatch(
          setAttributesData({
            categoryId: attributeData.data.category_id,
            data: attributeData.data.data_json,
          })
        );
        dispatch(
          loadTemplateData({
            templateData: attributeData.data.data_json,
            title: attributeData.data.title,
            description: attributeData.data.description || "",
            images: attributeData.data.images || [],
          })
        );
        setTimeout(() => setIsFormReady(true), 100);
      }
    }
  }, [attributeData, dispatch, templateType]);

  useEffect(() => {
    if (templateType === "details" && detailData?.data) {
        if(detailData.data.images) dispatch(setDetailsImages(detailData.data.images));

        setTimeout(() => {
            if (detailData.data) {
                dispatch(updateDetailFormField({ fieldName: "title", value: detailData.data.title }));
                dispatch(updateDetailFormField({ fieldName: "description", value: detailData.data.description || "" }));
                if ((detailData.data as any).tag) {
                    dispatch(updateDetailFormField({ fieldName: "tag", value: (detailData.data as any).tag }));
                }
            }
        }, 50)

        if (detailData.data.data_json) {
            dispatch(
                setDetailsData({
                    categoryId: detailData.data.category_id || 1,
                    data: detailData.data.data_json,
                })
            );
            setTimeout(() => setIsFormReady(true), 100);
      }
    }
  }, [detailData, dispatch, templateType]);

  const detailsSchema = useMemo(() => {
    return createDetailsSchema(detailsStore.detailsData as ICategoryDetails);
  }, [detailsStore.detailsData]);

  const attributesSchema = useMemo(() => {
    return createAttributesSchema(attributesStore.attributesData as ICategoryAttr);
  }, [attributesStore.attributesData]);

  const handleDetailsSubmit = async (data: any) => {
    Object.entries(data).forEach(([fieldName, value]) => {
        dispatch(updateDetailFormField({ fieldName, value }));
    });

    const finalData = getFinalDetailsObject({ details: detailsStore });
    if (!finalData) {
      enqueueSnackbar("خطا در آماده‌سازی داده‌ها", { variant: "error" });
      return;
    }

    try {
        await editDetail({ id: templateId, data: finalData });
        enqueueSnackbar("ویژگی با موفقیت ویرایش شد", { variant: "success" });
    } catch(e: any) {
        enqueueSnackbar(`خطا: ${e.message}`, { variant: "error" });
    }
  };

  const handleAttributesSubmit = async (data: any) => {
    Object.entries(data).forEach(([fieldId, value]) => {
        dispatch(updateAttributeFormField({ fieldId, value }));
    });

    const finalData = getFinalAttributesObject({ attributes: attributesStore });
    if (!finalData) {
      enqueueSnackbar("خطا در آماده‌سازی داده‌ها", { variant: "error" });
      return;
    }

    try {
        await editAttribute({ id: templateId, data: finalData });
        enqueueSnackbar("ویژگی با موفقیت ویرایش شد", { variant: "success" });
    } catch(e: any) {
        enqueueSnackbar(`خطا: ${e.message}`, { variant: "error" });
    }
  };

  const handleReset = () => {
    if (templateType === "attributes") dispatch(resetAttributes());
    else dispatch(resetDetails());
  };

  const triggerSubmit = () => {
      if(formRef.current) {
          formRef.current.submit();
      }
  }

  const isLoading = templateType === "attributes" ? attributeLoading : detailLoading;
  const dataError = templateType === "attributes" ? attributeError : detailError;

  if (dataError) return <AppLayout title="ویرایش قالب"><Alert severity="error">خطا: {dataError.message}</Alert></AppLayout>;
  if (isLoading) return <AppLayout title="ویرایش قالب"><CircularProgress /></AppLayout>;

  return (
    <AppLayout title="ویرایش قالب">
      <TitleCard title="ویرایش قالب" description="ویرایش اطلاعات قالب‌" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              {isFormReady ? (
                <Grid container spacing={3}>
                  {templateType === "attributes" ? (
                    <AttributesTab
                      formRef={formRef}
                      onSubmit={handleAttributesSubmit}
                      validationSchema={attributesSchema}
                      isLoading={attributeLoading}
                    />
                  ) : (
                    <DetailsTab
                      formRef={formRef}
                      onSubmit={handleDetailsSubmit}
                      validationSchema={detailsSchema}
                      isLoading={detailLoading}
                    />
                  )}
                </Grid>
              ) : (
                <CircularProgress />
              )}
            </CardContent>
          </Card>
        </Grid>
        {isFormReady && (
          <ActionButtons
            onSubmit={triggerSubmit}
            onReset={handleReset}
            isFormValid={true}
            isEditMode={true}
            loading={templateType === "attributes" ? isAttributesSaving : isDetailsSaving}
          />
        )}
      </Grid>
    </AppLayout>
  );
};

export default EditTemplatePage;
