import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import React from "react";
import type { IAttr } from "~/types/interfaces/attributes.interface";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { updateFormField } from "~/store/slices/attributesSlice";
import AttributeField from "./AttributeField";

const SectionCard = ({ title, children, ...props }: any) => (
  <Card sx={{ p: 2, ...props.sx }} {...props}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

interface AttributesTabProps {
  // حالا props نیازی نداریم چون همه چیز از store می‌آید
}

export default function AttributesTab({}: AttributesTabProps) {
  const dispatch = useAppDispatch();
  const { attributesData, formData, loading } = useAppSelector(state => state.attributes);

  // استخراج attributes از store data
  const attributes: IAttr[] = React.useMemo(() => {
    if (!attributesData?.category_group_attributes) return [];
    
    const allAttributes: IAttr[] = [];
    Object.values(attributesData.category_group_attributes).forEach((categoryData) => {
      Object.values(categoryData.attributes).forEach((attr) => {
        allAttributes.push(attr);
      });
    });
    
    return allAttributes;
  }, [attributesData]);

  const handleInputChange = (attrId: number, value: any) => {
    dispatch(updateFormField({ fieldId: attrId.toString(), value }));
  };

  if (loading) {
    return (
      <Grid size={{ xs: 12 }}>
        <SectionCard title="اطلاعات محصول">
          <Typography variant="body1" color="text.secondary">
            در حال بارگیری اطلاعات...
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  if (attributes.length === 0) {
    return (
      <Grid size={{ xs: 12 }}>
        <SectionCard title="اطلاعات محصول">
          <Typography variant="body1" color="text.secondary">
            اطلاعات محصول در دسترس نیست
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  return (
    <Grid size={{ xs: 12 }}>
      <SectionCard title="اطلاعات محصول">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {attributes.map((attr) => (
            <Box key={attr.id}>
              <AttributeField
                attr={attr}
                value={formData[attr.id]}
                onChange={handleInputChange}
              />
            </Box>
          ))}
        </Box>
      </SectionCard>
    </Grid>
  );
}