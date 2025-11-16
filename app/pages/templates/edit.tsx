import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { TitleCard } from "../../components/common";
import DetailsFormWrapper from "../../components/templates/DetailsFormWrapper";
import AttributesFormWrapper from "../../components/templates/AttributesFormWrapper";

export function meta() {
  return [
    { title: "ویرایش قالب" },
    { name: "description", content: "صفحه ویرایش قالب فروشگاه" },
  ];
}

type TemplateType = "attributes" | "details";

const EditTemplatePage = () => {
  const [searchParams] = useSearchParams();

  const templateId = parseInt(searchParams.get("id") || "0");
  const templateType = (searchParams.get("type") || "attributes") as TemplateType;

  return (
    <AppLayout title="ویرایش قالب">
      <TitleCard title="ویرایش قالب" description="ویرایش اطلاعات قالب‌" />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {templateType === "details" ? (
            <DetailsFormWrapper templateId={templateId} />
          ) : (
            <AttributesFormWrapper templateId={templateId} />
          )}
        </Grid>
      </Grid>
    </AppLayout>
  );
};

export default EditTemplatePage;