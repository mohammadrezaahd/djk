import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Autocomplete,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "~/store/hooks";
import { updateFormField } from "~/store/slices/detailsSlice";
import type { RootState } from "~/store";

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

interface InformationTabProps {
  // حالا props نیازی نداریم چون همه چیز از store می‌آید
}

export default function InformationTab({}: InformationTabProps) {
  const dispatch = useAppDispatch();
  const detailsData = useAppSelector((state: RootState) => (state.details as any)?.detailsData);
  const detailsFormData = useAppSelector((state: RootState) => (state.details as any)?.formData || {});
  const loading = useAppSelector((state: RootState) => (state.details as any)?.loading || false);
  
  const handleDetailsChange = (fieldName: string, value: any) => {
    dispatch(updateFormField({ fieldName, value }));
  };

  // منطق کنترل allow_fake و auto select برند متفرقه
  const isFakeProduct = detailsFormData?.is_fake_product === true;
  const bind = detailsData?.bind;

  // تمام useEffect ها باید قبل از هر گونه conditional return باشند
  useEffect(() => {
    // اگر کاربر کالای غیر اصل را انتخاب کند، برند به متفرقه تغییر کند
    if (isFakeProduct && bind?.brands) {
      const miscBrand = bind.brands.find((brand: any) => brand.id === "719");
      if (miscBrand) {
        handleDetailsChange("brand", "719");
      }
    }
  }, [isFakeProduct, bind?.brands, handleDetailsChange]);

  // منطق کنترل نوع شناسه کالا و مقداردهی اولیه از category_mefa_type
  useEffect(() => {
    // تنظیم مقدار اولیه id_type بر اساس category_mefa_type
    if (bind?.category_mefa_type && !detailsFormData?.id_type) {
      handleDetailsChange("id_type", bind.category_mefa_type);
    }
  }, [bind?.category_mefa_type, detailsFormData?.id_type, handleDetailsChange]);

  const isGeneralId = (detailsFormData?.id_type || bind?.category_mefa_type) === "general";

  const renderDetailsField = (
    fieldName: string,
    fieldData: any,
    label: string
  ) => {
    if (!fieldData || !Array.isArray(fieldData)) return null;

    const options = fieldData.map((item: any, index: number) => {
      // برای fake_reasons منطق متفاوت است
      if (fieldName === "fake_reason") {
        return {
          id: item.text || index.toString(), // text همان id است
          label: item.value || `${label} ${index + 1}`, // value همان متن قابل نمایش است
          value: item.text || index.toString(),
          data: item,
        };
      }

      // برای بقیه فیلدها منطق قبلی
      return {
        id: item.value || item.id || index.toString(),
        label:
          item.text || item.title || item.labeel || `${label} ${index + 1}`,
        value: item.value || item.id || index.toString(),
        data: item,
      };
    });

    const selectedOption =
      options.find((option) => option.id === detailsFormData[fieldName]) ||
      null;

    // Custom render for brands with logo
    const renderBrandOption = (props: any, option: any) => {
      const { key, ...otherProps } = props;
      return (
        <Box
          component="li"
          key={key}
          {...otherProps}
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          <Typography variant="body2" sx={{ flex: 1 }}>
            {option.label}
          </Typography>
          {option.data.logo_id && (
            <Box
              component="img"
              src={option.data.logo_id}
              alt={option.label}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                objectFit: "contain",
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
              onError={(e: any) => {
                e.target.style.display = "none";
              }}
            />
          )}
        </Box>
      );
    };

    // Custom render for selected brand in input
    const renderBrandInput = (params: any) => (
      <TextField
        {...params}
        label={label}
        placeholder="انتخاب کنید..."
        InputProps={{
          ...params.InputProps,
          endAdornment: selectedOption?.data?.logo_id ? (
            <Box
              component="img"
              src={selectedOption.data.logo_id}
              alt={selectedOption.label}
              sx={{
                width: 24,
                height: 24,
                borderRadius: 0.5,
                objectFit: "contain",
                ml: 1,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
              onError={(e: any) => {
                e.target.style.display = "none";
              }}
            />
          ) : null,
        }}
      />
    );

    return (
      <Box key={fieldName} sx={{ mb: 3 }}>
        <Autocomplete
          fullWidth
          options={options}
          getOptionLabel={(option) => option.label}
          value={selectedOption}
          onChange={(_, newValue) => {
            handleDetailsChange(fieldName, newValue?.id || "");
          }}
          renderOption={fieldName === "brand" ? renderBrandOption : undefined}
          renderInput={
            fieldName === "brand"
              ? renderBrandInput
              : (params) => (
                  <TextField
                    {...params}
                    label={label}
                    placeholder="انتخاب کنید..."
                  />
                )
          }
          noOptionsText="گزینه‌ای یافت نشد"
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </Box>
    );
  };

  if (!detailsData || !detailsData.bind) {
    return (
      <Grid size={{ xs: 12 }}>
        <SectionCard title="اطلاعات محصول">
          <Typography variant="body1" color="text.secondary">
            {loading
              ? "در حال بارگیری اطلاعات..."
              : "اطلاعات محصول در دسترس نیست"}
          </Typography>
        </SectionCard>
      </Grid>
    );
  }

  // گزینه‌های نوع شناسه
  const renderIdTypeSection = () => {
    if (!bind?.general_mefa || Object.keys(bind.general_mefa).length === 0) {
      return null;
    }

    const generalMefaOptions = Object.entries(bind.general_mefa).map(
      ([key, value]: [string, any]) => ({
        id: key,
        label: value.text || key,
        value: key,
        data: value,
      })
    );

    return (
      <Grid size={{ xs: 12 }}>
        <SectionCard title="شناسه کالا">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* انتخاب نوع شناسه */}
            <FormControl component="fieldset">
              <FormLabel component="legend">نوع شناسه کالا</FormLabel>
              <RadioGroup
                row
                value={detailsFormData?.id_type || bind?.category_mefa_type || "general"}
                onChange={(e) => {
                  handleDetailsChange("id_type", e.target.value);
                  // پاک کردن مقادیر قبلی
                  handleDetailsChange("general_mefa_id", "");
                  handleDetailsChange("custom_id", "");
                }}
              >
                <FormControlLabel
                  value="general"
                  control={<Radio />}
                  label="شناسه عمومی"
                />
                <FormControlLabel
                  value="custom"
                  control={<Radio />}
                  label="شناسه خصوصی"
                />
              </RadioGroup>
            </FormControl>

            {/* انتخاب شناسه عمومی */}
            {isGeneralId && (
              <Autocomplete
                fullWidth
                options={generalMefaOptions}
                getOptionLabel={(option) => option.label}
                value={
                  generalMefaOptions.find(
                    (option) => option.id === detailsFormData?.general_mefa_id
                  ) || null
                }
                onChange={(_, newValue) => {
                  handleDetailsChange("general_mefa_id", newValue?.id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="شناسه عمومی"
                    placeholder="انتخاب کنید..."
                  />
                )}
                noOptionsText="گزینه‌ای یافت نشد"
              />
            )}

            {/* ورودی شناسه خصوصی */}
            {!isGeneralId && (
              <TextField
                fullWidth
                label="شناسه خصوصی"
                placeholder="شناسه خصوصی را وارد کنید..."
                value={detailsFormData?.custom_id || ""}
                onChange={(e) => {
                  handleDetailsChange("custom_id", e.target.value);
                }}
              />
            )}
          </Box>
        </SectionCard>
      </Grid>
    );
  };

  return (
    <Grid container spacing={3}>
      {/* نوع کالا (اصل/غیر اصل) */}
      {bind?.allow_fake && (
        <Grid size={{ xs: 12 }}>
          <SectionCard title="نوع کالا">
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={
                  detailsFormData?.is_fake_product === true
                    ? "fake"
                    : "original"
                }
                onChange={(e) => {
                  const isFake = e.target.value === "fake";
                  handleDetailsChange("is_fake_product", isFake);
                }}
              >
                <FormControlLabel
                  value="original"
                  control={<Radio />}
                  label="فروش کالای اصل"
                />
                <FormControlLabel
                  value="fake"
                  control={<Radio />}
                  label="فروش کالای غیر اصل"
                />
              </RadioGroup>
            </FormControl>
          </SectionCard>
        </Grid>
      )}

      {/* برندها */}
      {bind?.brands && bind.brands.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="برند محصول">
            <Box key="brand" sx={{ mb: 3 }}>
              <Autocomplete
                fullWidth
                disabled={isFakeProduct} // غیر قابل ویرایش اگر کالای غیر اصل انتخاب شده
                options={bind.brands.map((item: any, index: number) => ({
                  id: item.value || item.id || index.toString(),
                  label:
                    item.text ||
                    item.title ||
                    item.labeel ||
                    `برند ${index + 1}`,
                  value: item.value || item.id || index.toString(),
                  data: item,
                }))}
                getOptionLabel={(option) => option.label}
                value={
                  bind.brands
                    .map((item: any, index: number) => ({
                      id: item.value || item.id || index.toString(),
                      label:
                        item.text ||
                        item.title ||
                        item.labeel ||
                        `برند ${index + 1}`,
                      value: item.value || item.id || index.toString(),
                      data: item,
                    }))
                    .find(
                      (option: any) => option.id === detailsFormData?.brand
                    ) || null
                }
                onChange={(_, newValue) => {
                  if (!isFakeProduct) {
                    handleDetailsChange("brand", newValue?.id || "");
                  }
                }}
                renderOption={(props: any, option: any) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box
                      component="li"
                      key={key}
                      {...otherProps}
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {option.label}
                      </Typography>
                      {option.data.logo_id && (
                        <Box
                          component="img"
                          src={option.data.logo_id}
                          alt={option.label}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            objectFit: "contain",
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                          }}
                          onError={(e: any) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                    </Box>
                  );
                }}
                renderInput={(params) => {
                  const selectedOption = bind.brands
                    .map((item: any, index: number) => ({
                      id: item.value || item.id || index.toString(),
                      label:
                        item.text ||
                        item.title ||
                        item.labeel ||
                        `برند ${index + 1}`,
                      value: item.value || item.id || index.toString(),
                      data: item,
                    }))
                    .find(
                      (option: any) => option.id === detailsFormData?.brand
                    );

                  return (
                    <TextField
                      {...params}
                      label={
                        isFakeProduct
                          ? "برند (متفرقه - غیر قابل ویرایش)"
                          : "برند"
                      }
                      placeholder="انتخاب کنید..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: selectedOption?.data?.logo_id ? (
                          <Box
                            component="img"
                            src={selectedOption.data.logo_id}
                            alt={selectedOption.label}
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 0.5,
                              objectFit: "contain",
                              ml: 1,
                              border: (theme) => `1px solid ${theme.palette.divider}`,
                            }}
                            onError={(e: any) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : null,
                      }}
                    />
                  );
                }}
                noOptionsText="گزینه‌ای یافت نشد"
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Box>
          </SectionCard>
        </Grid>
      )}

      {/* وضعیت محصول */}
      {bind?.statuses && bind.statuses.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="وضعیت محصول">
            {renderDetailsField("status", detailsData?.bind?.statuses, "وضعیت")}
          </SectionCard>
        </Grid>
      )}

      {/* پلتفرم‌ها */}
      {detailsData?.bind?.platforms && detailsData?.bind?.platforms.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="پلتفرم">
            {renderDetailsField("platform", detailsData?.bind?.platforms, "پلتفرم")}
          </SectionCard>
        </Grid>
      )}

      {/* کلاس محصول */}
      {detailsData?.bind?.product_classes && detailsData?.bind?.product_classes.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="کلاس محصول">
            {renderDetailsField(
              "product_class",
              detailsData?.bind?.product_classes,
              "کلاس محصول"
            )}
          </SectionCard>
        </Grid>
      )}

      {/* نوع محصول دسته‌بندی */}
      {detailsData?.bind?.category_product_types &&
        detailsData?.bind?.category_product_types.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="نوع محصول">
              {renderDetailsField(
                "category_product_type",
                detailsData?.bind?.category_product_types,
                "نوع محصول"
              )}
            </SectionCard>
          </Grid>
        )}

      {/* دلایل تقلبی */}
      {detailsData?.bind?.fake_reasons && detailsData?.bind?.fake_reasons.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="دلایل تقلبی">
            {renderDetailsField("fake_reason", detailsData?.bind?.fake_reasons, "دلیل تقلبی")}
          </SectionCard>
        </Grid>
      )}

      {/* تم‌های دسته‌بندی */}
      {detailsData?.bind?.category_data?.themes && detailsData?.bind?.category_data.themes.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard title="تم دسته‌بندی">
            {renderDetailsField("theme", detailsData?.bind?.category_data.themes, "تم")}
          </SectionCard>
        </Grid>
      )}

      {/* شناسه کالا */}
      {renderIdTypeSection()}

      {/* اطلاعات اضافی */}
      <Grid size={{ xs: 12 }}>
        <SectionCard title="تنظیمات اضافی">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {detailsData?.bind?.allow_fake !== undefined && (
              <Typography variant="body2">
                <strong>اجازه محصول تقلبی:</strong>{" "}
                {detailsData?.bind?.allow_fake ? "بله" : "خیر"}
              </Typography>
            )}
            {detailsData?.bind?.show_colors !== undefined && (
              <Typography variant="body2">
                <strong>نمایش رنگ‌ها:</strong>{" "}
                {detailsData?.bind?.show_colors ? "بله" : "خیر"}
              </Typography>
            )}
            {detailsData?.bind?.dimension_level && (
              <Typography variant="body2">
                <strong>سطح ابعاد:</strong> {detailsData?.bind?.dimension_level}
              </Typography>
            )}
            {detailsData?.bind?.category_mefa_type && (
              <Typography variant="body2">
                <strong>نوع MEFA دسته‌بندی:</strong> {detailsData?.bind?.category_mefa_type}
              </Typography>
            )}
          </Box>
        </SectionCard>
      </Grid>
    </Grid>
  );
}

