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
  setAttributesData,
  resetAttributes,
  getFinalAttributesObject,
} from "../../store/slices/attributesSlice";
import { useAttr, useEditAttr, useAddAttribute } from "../../api/attributes.api";
import { useCategory } from "../../api/categories.api";
import AttributesTab from "./attributes/AttributesTab";
import ActionButtons from "./ActionButtons";
import { useSnackbar } from "notistack";
import { ApiStatus } from "../../types";

interface AttributesFormWrapperProps {
  categoryId?: number;
  templateId?: number;
  onSuccess?: () => void;
}

const AttributesFormWrapper: React.FC<AttributesFormWrapperProps> = ({
  categoryId,
  templateId,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const attributesStore = useAppSelector((state) => state.attributes);

  const [isAttributesValid, setIsAttributesValid] = useState(false);
  const [isFormReady, setIsFormReady] = useState(!templateId);

  // API Hooks
  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategory(categoryId || 0, { attributes: true, details: false }, !!categoryId);

  const {
    data: attributeData,
    isLoading: attributeLoading,
    error: attributeError,
  } = useAttr(templateId || 0, !!templateId);

  const { mutateAsync: addAttribute, isPending: isAdding } = useAddAttribute();
  const { mutateAsync: editAttribute, isPending: isEditing } = useEditAttr();

  // Load initial data for editing
  useEffect(() => {
    if (templateId && attributeData?.status === ApiStatus.SUCCEEDED && attributeData.data) {
      const data = attributeData.data;
      if (data.data_json) {
        dispatch(
          setAttributesData({
            categoryId: data.category_id,
            data: data.data_json,
          })
        );
        setTimeout(() => setIsFormReady(true), 100);
      }
    }
  }, [attributeData, dispatch, templateId]);

  // Load category data for creating
  useEffect(() => {
    if (categoryId && categoryData?.status === ApiStatus.SUCCEEDED && categoryData.data) {
        if (categoryData.data.item.attributes?.category_group_attributes) {
            dispatch(
                setAttributesData({
                    categoryId: categoryId,
                    data: categoryData.data.item.attributes,
                })
            );
        }
    }
  }, [categoryData, categoryId, dispatch]);

  const handleSubmit = async () => {
    if (!isAttributesValid) {
        enqueueSnackbar("لطفا خطاهای فرم را برطرف کنید.", { variant: "warning" });
        return;
    }

    const postData = getFinalAttributesObject({ attributes: attributesStore });
    if (!postData) {
      enqueueSnackbar("اطلاعات قالب در دسترس نیست", { variant: "error" });
      return;
    }

    try {
      if (templateId) {
        await editAttribute({ id: templateId, data: postData });
        enqueueSnackbar("قالب ویژگی با موفقیت ویرایش شد", { variant: "success" });
      } else {
        await addAttribute(postData);
        enqueueSnackbar("قالب ویژگی با موفقیت ذخیره شد", { variant: "success" });
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      enqueueSnackbar(error.message || "خطا در ذخیره‌سازی", { variant: "error" });
    }
  };

  const handleReset = () => {
    dispatch(resetAttributes());
  };

  const isLoading = categoryLoading || attributeLoading;
  const error = categoryError || attributeError;

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
              <AttributesTab onValidationChange={setIsAttributesValid} isLoading={false} />
            )}
          </CardContent>
        </Card>
      </Grid>
      {isFormReady && (
        <ActionButtons
          onSubmit={handleSubmit}
          onReset={handleReset}
          isFormValid={isAttributesValid}
          loading={isAdding || isEditing}
          isEditMode={!!templateId}
          activeTab={1} // Assuming attributes is the second tab
        />
      )}
    </Grid>
  );
};

export default AttributesFormWrapper;