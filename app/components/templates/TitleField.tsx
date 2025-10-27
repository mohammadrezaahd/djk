import { TextField, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { setTitle } from "~/store/slices/attributesSlice";

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

const TitleField = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.attributes.title);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  return (
    <SectionCard title="عنوان قالب">
      <TextField
        fullWidth
        label="عنوان قالب ویژگی‌ها"
        placeholder="عنوان قالب را وارد کنید..."
        value={title}
        onChange={handleTitleChange}
        required
        helperText="این عنوان برای شناسایی قالب استفاده خواهد شد"
      />
    </SectionCard>
  );
};

export default TitleField;
