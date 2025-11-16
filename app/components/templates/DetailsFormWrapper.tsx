import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setDetailsData,
  resetDetails,
  getFinalDetailsObject,
  updateFormField,
  setImages as setDetailsImages,
} from "../../store/slices/detailsSlice";
import { useDetail, useEditDetail, useAddDetail } from "../../api/details.api";
import { useCategory } from "../../api/categories.api";
import DetailsTab from "./details/DetailsTab";
import ActionButtons from "./ActionButtons";
import { useSnackbar } from "notistack";
import { ApiStatus } from "../../types";

interface DetailsFormWrapperProps {
  categoryId?: number;
  templateId?: number;
  onSuccess?: () => void;
}

const DetailsFormWrapper: React.FC<DetailsFormWrapperProps> = ({
  categoryId,
  templateId,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const detailsStore = useAppSelector((state) => state.details);

  const [isDetailsValid, setIsDetailsValid] = useState(false);
  const [isFormReady, setIsFormReady] = useState(!templateId);

  // API Hooks
  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategory(categoryId || 0, { details: true, attributes: false }, !!categoryId);

  const {
    data: detailData,
    isLoading: detailLoading,
    error: detailError,
  } = useDetail(templateId || 0, !!templateId);

  const { mutateAsync: addDetail, isPending: isAdding } = useAddDetail();
  const { mutateAsync: editDetail, isPending: isEditing } = useEditDetail();

  // Load initial data for editing
  useEffect(() => {
    if (templateId && detailData?.status === ApiStatus.SUCCEEDED && detailData.data) {
      const data = detailData.data;
      if (data.data_json) {
        dispatch(
          setDetailsData({
            categoryId: data.category_id || 1,
            data: data.data_json,
          })
        );
        // Populate form fields from the template data
        // This part is complex and needs careful implementation based on `edit.tsx`
        // For now, setting a timeout to ensure store updates
        setTimeout(() => setIsFormReady(true), 100);
      }
    }
  }, [detailData, dispatch, templateId]);

  // Load category data for creating
  useEffect(() => {
    if (categoryId && categoryData?.status === ApiStatus.SUCCEEDED && categoryData.data) {
        if (categoryData.data.item.details) {
            dispatch(
                setDetailsData({
                    categoryId: categoryId,
                    data: categoryData.data.item.details,
                })
            );
        }
    }
  }, [categoryData, categoryId, dispatch]);

  const handleSubmit = async () => {
    if (!isDetailsValid) {
        enqueueSnackbar("لطفا خطاهای فرم را برطرف کنید.", { variant: "warning" });
        return;
    }

    const postData = getFinalDetailsObject({ details: detailsStore });
    if (!postData) {
      enqueueSnackbar("اطلاعات قالب در دسترس نیست", { variant: "error" });
      return;
    }

    try {
      if (templateId) {
        await editDetail({ id: templateId, data: postData });
        enqueueSnackbar("قالب اطلاعات با موفقیت ویرایش شد", { variant: "success" });
      } else {
        await addDetail(postData);
        enqueueSnackbar("قالب اطلاعات با موفقیت ذخیره شد", { variant: "success" });
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      enqueueSnackbar(error.message || "خطا در ذخیره‌سازی", { variant: "error" });
    }
  };

  const handleReset = () => {
    dispatch(resetDetails());
  };

  const isLoading = categoryLoading || detailLoading;
  const error = categoryError || detailError;

  if (error) {
    return (
      <Alert severity="error">خطا در بارگذاری اطلاعات: {error.message}</Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {!isFormReady || isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>درحال بارگذاری فرم...</Typography>
              </Box>
            ) : (
              <DetailsTab onValidationChange={setIsDetailsValid} isLoading={false} />
            )}
          </CardContent>
        </Card>
      </Grid>
      {isFormReady && (
        <ActionButtons
          onSubmit={handleSubmit}
          onReset={handleReset}
          isFormValid={isDetailsValid}
          loading={isAdding || isEditing}
          isEditMode={!!templateId}
        />
      )}
    </Grid>
  );
};

export default DetailsFormWrapper;