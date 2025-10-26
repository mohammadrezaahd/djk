import {
  Button,
  TextField,
  // Select,
  // MenuItem,
  // FormControl,
  // InputLabel,
  // Checkbox,
  // FormControlLabel,
  // FormGroup,
  Box,
  Typography,
  Paper,
  Autocomplete,
  Chip,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { categoriesApi } from "~/api/categories.api";

import AppLayout from "~/components/AppLayout";
import { ApiStatus } from "~/types";
import {
  AttributeType,
  type IAttr,
} from "~/types/interfaces/attributes.interface";
import type { ICategoryList } from "~/types/interfaces/categories.interface";

export function meta() {
  return [
    { title: "افزودن محصول جدید" },
    { name: "description", content: "صفحه افزودن محصول جدید به فروشگاه" },
  ];
}

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

export default function NewProductTemplate() {
  const [attributes, setAttributes] = useState<IAttr[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalCategoryData, setOriginalCategoryData] = useState<any>(null);
  const [categories, setCategories] = useState<ICategoryList[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<ICategoryList | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [activeTab, setActiveTab] = useState(0); // 0 for ویژگی ها، 1 for اطلاعات
  
  // States for details tab
  const [detailsData, setDetailsData] = useState<any>(null);
  const [detailsFormData, setDetailsFormData] = useState<{ [key: string]: any }>({});

  // فیلتر کردن attributes بر اساس جستجو
  const filteredAttributes = attributes.filter(
    (attr) =>
      attr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attr.hint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // لود کردن لیست دسته‌بندی‌ها
  const loadCategories = async (search: string = "") => {
    setLoadingCategories(true);
    try {
      const res = await categoriesApi.getCategoriesList(search, 1, 50);
      if (res.status === ApiStatus.SUCCEEDED && res.data) {
        setCategories(res.data.items);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // بارگذاری اولیه دسته‌بندی‌ها
  useEffect(() => {
    loadCategories();
  }, []);

  const fetcher = async (
    categoryId: number,
    includeOptions?: { attributes?: boolean; details?: boolean }
  ) => {
    if (!categoryId) {
      return;
    }

    setLoading(true);
    try {
      const defaultOptions = { attributes: true, details: false };
      const options = includeOptions || defaultOptions;

      const res = await categoriesApi.getCategories(categoryId, options);
      if (res.status === ApiStatus.SUCCEEDED && res.data) {
        const data = res.data;

        // اگر attributes درخواست شده باشد
        if (
          options.attributes &&
          data.item.attributes?.category_group_attributes
        ) {
          const categoryGroupAttributes =
            data.item.attributes.category_group_attributes;
          setOriginalCategoryData(categoryGroupAttributes);

          const allAttributes: IAttr[] = [];
          const initialFormData: { [key: string]: any } = {};

          Object.values(categoryGroupAttributes).forEach((categoryData) => {
            Object.values(categoryData.attributes).forEach((attr) => {
              allAttributes.push(attr);

              const selectedValues = Object.entries(attr.values)
                .filter(([_, valueData]) => valueData.selected)
                .map(([valueId, _]) => valueId);

              if (selectedValues.length > 0) {
                if (attr.type === AttributeType.Select) {
                  initialFormData[attr.id] = selectedValues[0];
                } else if (attr.type === AttributeType.Checkbox) {
                  initialFormData[attr.id] = selectedValues;
                }
              }
            });
          });

          setAttributes(allAttributes);
          setFormData((prev) => ({ ...prev, ...initialFormData }));
        }

        // اگر details درخواست شده باشد، می‌تونی اینجا کارهای مربوط به details رو انجام بدی
        if (options.details) {
          // برای آینده - کارهای مربوط به details
          console.log("Details loaded:", data.item);
          setDetailsData(data.item.details);
        }
      }
    } catch (error) {
      console.error("Error loading category data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (attrId: number, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [attrId]: value,
    }));
  };

  const handleDetailsChange = (fieldName: string, value: any) => {
    setDetailsFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // تشخیص اینکه آیا یک attribute چندانتخابه است یا خیر
  const isMultiSelect = (attr: IAttr): boolean => {
    return attr.type === AttributeType.Checkbox;
  };

  // تشخیص اینکه آیا یک attribute باید Autocomplete استفاده کند یا خیر
  const shouldUseAutocomplete = (attr: IAttr): boolean => {
    const valuesCount = Object.keys(attr.values).length;
    return (
      (attr.type === AttributeType.Select ||
        attr.type === AttributeType.Checkbox) &&
      valuesCount > 0
    );
  };

  const renderDetailsField = (fieldName: string, fieldData: any, label: string) => {
    if (!fieldData || !Array.isArray(fieldData)) return null;

    const options = fieldData.map((item: any, index: number) => {
      // برای fake_reasons منطق متفاوت است
      if (fieldName === 'fake_reason') {
        return {
          id: item.text || index.toString(), // text همان id است
          label: item.value || `${label} ${index + 1}`, // value همان متن قابل نمایش است
          value: item.text || index.toString(),
          data: item
        };
      }
      
      // برای بقیه فیلدها منطق قبلی
      return {
        id: item.value || item.id || index.toString(),
        label: item.text || item.title || item.labeel || `${label} ${index + 1}`,
        value: item.value || item.id || index.toString(),
        data: item
      };
    });

    const selectedOption = options.find(
      (option) => option.id === detailsFormData[fieldName]
    ) || null;

    // Custom render for brands with logo
    const renderBrandOption = (props: any, option: any) => {
      const { key, ...otherProps } = props;
      return (
        <Box 
          component="li" 
          key={key}
          {...otherProps} 
          sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
        >
          <Typography variant="body2" sx={{ flex: 1 }}>{option.label}</Typography>
          {option.data.logo_id && (
            <Box
              component="img"
              src={option.data.logo_id}
              alt={option.label}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                objectFit: 'contain',
                border: '1px solid #e0e0e0'
              }}
              onError={(e: any) => {
                e.target.style.display = 'none';
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
                objectFit: 'contain',
                ml: 1,
                border: '1px solid #e0e0e0'
              }}
              onError={(e: any) => {
                e.target.style.display = 'none';
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
          renderOption={fieldName === 'brand' ? renderBrandOption : undefined}
          renderInput={fieldName === 'brand' ? renderBrandInput : (params) => (
            <TextField
              {...params}
              label={label}
              placeholder="انتخاب کنید..."
            />
          )}
          noOptionsText="گزینه‌ای یافت نشد"
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </Box>
    );
  };

  const renderField = (attr: IAttr) => {
    const fieldId = attr.id.toString();

    switch (attr.type) {
      case AttributeType.Input:
        return (
          <TextField
            key={attr.id}
            fullWidth
            type="number"
            label={attr.title + (attr.required ? " *" : "")}
            helperText={attr.hint}
            value={formData[fieldId] || ""}
            onChange={(e) => handleInputChange(attr.id, e.target.value)}
            required={attr.required}
            InputProps={{
              endAdornment: attr.postfix || attr.unit,
            }}
          />
        );

      case AttributeType.Select:
      case AttributeType.Checkbox:
        if (shouldUseAutocomplete(attr)) {
          const options = Object.entries(attr.values).map(
            ([valueId, valueData]) => ({
              id: valueId,
              label: valueData.text,
              value: valueId,
            })
          );

          const isMulti = isMultiSelect(attr);

          // برای single select
          if (!isMulti) {
            const selectedOption =
              options.find((option) => option.id === formData[fieldId]) || null;

            return (
              <Box key={attr.id}>
                <Autocomplete
                  fullWidth
                  options={options}
                  getOptionLabel={(option) => option.label}
                  value={selectedOption}
                  onChange={(_, newValue) => {
                    handleInputChange(attr.id, newValue?.id || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={attr.title + (attr.required ? " *" : "")}
                      required={attr.required}
                      helperText={attr.hint}
                      placeholder="انتخاب کنید..."
                    />
                  )}
                  noOptionsText="گزینه‌ای یافت نشد"
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                />
              </Box>
            );
          } else {
            // برای multi select
            const selectedOptions = options.filter(
              (option) => formData[fieldId]?.includes(option.id) || false
            );

            return (
              <Box key={attr.id}>
                <Autocomplete
                  multiple
                  fullWidth
                  options={options}
                  getOptionLabel={(option) => option.label}
                  value={selectedOptions}
                  onChange={(_, newValues) => {
                    const selectedIds = newValues.map((item) => item.id);
                    handleInputChange(attr.id, selectedIds);
                  }}
                  disableCloseOnSelect
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option.label}
                        {...getTagProps({ index })}
                        key={option.id}
                        size="small"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={attr.title + (attr.required ? " *" : "")}
                      required={attr.required}
                      helperText={attr.hint}
                      placeholder="انتخاب کنید..."
                    />
                  )}
                  noOptionsText="گزینه‌ای یافت نشد"
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  filterSelectedOptions
                  limitTags={3}
                  getLimitTagsText={(more) => `+${more} بیشتر`}
                />
              </Box>
            );
          }
        }
        return null;

      case AttributeType.Text:
        return (
          <TextField
            key={attr.id}
            fullWidth
            multiline
            rows={3}
            label={attr.title + (attr.required ? " *" : "")}
            helperText={attr.hint}
            value={formData[fieldId] || ""}
            onChange={(e) => handleInputChange(attr.id, e.target.value)}
            required={attr.required}
          />
        );

      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    if (!originalCategoryData) {
      console.error("داده‌های اصلی موجود نیست. ابتدا ویژگی‌ها را لود کنید.");
      alert("ابتدا ویژگی‌ها را لود کنید.");
      return;
    }

    // اعتبارسنجی فیلدهای required
    const requiredFields = attributes.filter((attr) => attr.required);
    const missingFields = requiredFields.filter((attr) => {
      const value = formData[attr.id];
      return !value || (Array.isArray(value) && value.length === 0);
    });

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map((field) => field.title).join(", ");
      console.error("فیلدهای ضروری خالی:", fieldNames);
      alert(`لطفاً فیلدهای ضروری زیر را تکمیل کنید:\n${fieldNames}`);
      return;
    }

    try {
      // کپی عمیق از ساختار اصلی
      const postData: any = JSON.parse(JSON.stringify(originalCategoryData));

      // به‌روزرسانی داده‌ها بر اساس فرم
      Object.keys(postData).forEach((categoryId) => {
        const categoryData = postData[categoryId];

        Object.keys(categoryData.attributes).forEach((attributeId) => {
          const attr = categoryData.attributes[attributeId];
          const formValue = formData[attr.id];

          if (
            formValue !== undefined &&
            formValue !== null &&
            formValue !== ""
          ) {
            switch (attr.type) {
              case AttributeType.Input:
              case AttributeType.Text:
                // برای Input و Text، مقدار value را تنظیم می‌کنیم
                attr.value = formValue.toString();
                break;

              case AttributeType.Select:
                // برای Select، فقط گزینه انتخاب شده را نگه می‌داریم
                if (formValue && attr.values[formValue]) {
                  const selectedValue = attr.values[formValue];
                  attr.values = {
                    [formValue]: {
                      ...selectedValue,
                      selected: true,
                    },
                  };
                }
                break;

              case AttributeType.Checkbox:
                // برای Checkbox، فقط گزینه‌های انتخاب شده را نگه می‌داریم
                if (Array.isArray(formValue) && formValue.length > 0) {
                  const newValues: any = {};
                  formValue.forEach((valueId: string) => {
                    if (attr.values[valueId]) {
                      newValues[valueId] = {
                        ...attr.values[valueId],
                        selected: true,
                      };
                    }
                  });
                  attr.values = newValues;
                } else {
                  // اگر هیچ مقداری انتخاب نشده، values را خالی می‌کنیم
                  attr.values = {};
                }
                break;
            }
          } else {
            // اگر مقداری وارد نشده، values را خالی می‌کنیم (برای select و checkbox)
            if (
              attr.type === AttributeType.Select ||
              attr.type === AttributeType.Checkbox
            ) {
              attr.values = {};
            } else if (
              attr.type === AttributeType.Input ||
              attr.type === AttributeType.Text
            ) {
              attr.value = "";
            }
          }
        });
      });

      console.log("✅ فرم با موفقیت آماده شد!");
      console.log("📤 داده‌های آماده برای ارسال:");
      console.log(JSON.stringify(postData, null, 2));

      // اینجا می‌تونید داده‌ها رو به API ارسال کنید
      // await someApi.postFormData(postData);

      alert("فرم با موفقیت آماده شد! داده‌ها در کنسول قابل مشاهده هستند.");
    } catch (error) {
      console.error("خطا در آماده‌سازی داده‌های فرم:", error);
      alert("خطا در آماده‌سازی فرم. لطفاً دوباره تلاش کنید.");
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    // اگر دسته‌بندی انتخاب شده باشد، بر اساس تب جدید API کال کن
    if (selectedCategory) {
      if (newValue === 0) {
        // تب ویژگی‌ها - attributes: true, details: false
        fetcher(selectedCategory.id, { attributes: true, details: false });
      } else if (newValue === 1) {
        // تب اطلاعات - attributes: false, details: true
        fetcher(selectedCategory.id, { attributes: false, details: true });
      }
    }
  };

  const renderAttributesTab = () => {
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
            {filteredAttributes.map((attr) => (
              <Box key={attr.id}>{renderField(attr)}</Box>
            ))}
          </Box>
        </SectionCard>
      </Grid>
    );
  };

  const renderInformationTab = () => {
    if (!detailsData || !detailsData.bind) {
      return (
        <Grid size={{ xs: 12 }}>
          <SectionCard title="اطلاعات محصول">
            <Typography variant="body1" color="text.secondary">
              {loading ? "در حال بارگیری اطلاعات..." : "اطلاعات محصول در دسترس نیست"}
            </Typography>
          </SectionCard>
        </Grid>
      );
    }

    const { bind } = detailsData;

    return (
      <Grid container spacing={3}>
        {/* برندها */}
        {bind.brands && bind.brands.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="برند محصول">
              {renderDetailsField("brand", bind.brands, "برند")}
            </SectionCard>
          </Grid>
        )}

        {/* وضعیت محصول */}
        {bind.statuses && bind.statuses.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="وضعیت محصول">
              {renderDetailsField("status", bind.statuses, "وضعیت")}
            </SectionCard>
          </Grid>
        )}

        {/* پلتفرم‌ها */}
        {bind.platforms && bind.platforms.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="پلتفرم">
              {renderDetailsField("platform", bind.platforms, "پلتفرم")}
            </SectionCard>
          </Grid>
        )}

        {/* کلاس محصول */}
        {bind.product_classes && bind.product_classes.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="کلاس محصول">
              {renderDetailsField("product_class", bind.product_classes, "کلاس محصول")}
            </SectionCard>
          </Grid>
        )}

        {/* نوع محصول دسته‌بندی */}
        {bind.category_product_types && bind.category_product_types.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="نوع محصول">
              {renderDetailsField("category_product_type", bind.category_product_types, "نوع محصول")}
            </SectionCard>
          </Grid>
        )}

        {/* دلایل تقلبی */}
        {bind.fake_reasons && bind.fake_reasons.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="دلایل تقلبی">
              {renderDetailsField("fake_reason", bind.fake_reasons, "دلیل تقلبی")}
            </SectionCard>
          </Grid>
        )}

        {/* تم‌های دسته‌بندی */}
        {bind.category_data?.themes && bind.category_data.themes.length > 0 && (
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard title="تم دسته‌بندی">
              {renderDetailsField("theme", bind.category_data.themes, "تم")}
            </SectionCard>
          </Grid>
        )}

        {/* اطلاعات اضافی */}
        <Grid size={{ xs: 12 }}>
          <SectionCard title="تنظیمات اضافی">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {bind.allow_fake !== undefined && (
                <Typography variant="body2">
                  <strong>اجازه محصول تقلبی:</strong> {bind.allow_fake ? "بله" : "خیر"}
                </Typography>
              )}
              {bind.show_colors !== undefined && (
                <Typography variant="body2">
                  <strong>نمایش رنگ‌ها:</strong> {bind.show_colors ? "بله" : "خیر"}
                </Typography>
              )}
              {bind.dimension_level && (
                <Typography variant="body2">
                  <strong>سطح ابعاد:</strong> {bind.dimension_level}
                </Typography>
              )}
              {bind.category_mefa_type && (
                <Typography variant="body2">
                  <strong>نوع MEFA دسته‌بندی:</strong> {bind.category_mefa_type}
                </Typography>
              )}
            </Box>
          </SectionCard>
        </Grid>
      </Grid>
    );
  };

  return (
    <AppLayout>
      <Typography variant="h4" gutterBottom>
        افزودن قالب جدید به فروشگاه
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <SectionCard title="دسته‌بندی قالب">
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Autocomplete
                      fullWidth
                      options={categories}
                      getOptionLabel={(option) => option.title}
                      value={selectedCategory}
                      onChange={(_, newValue) => {
                        setSelectedCategory(newValue);
                        if (newValue) {
                          // پیش‌فرض تب ویژگی‌ها - attributes: true, details: false
                          fetcher(newValue.id, {
                            attributes: true,
                            details: false,
                          });
                        } else {
                          setAttributes([]);
                          setFormData({});
                          setDetailsFormData({});
                          setDetailsData(null);
                          setOriginalCategoryData(null);
                        }
                      }}
                      onInputChange={(_, newInputValue) => {
                        loadCategories(newInputValue);
                      }}
                      loading={loadingCategories}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="قالب اطلاعاتی محصول"
                          placeholder="جستجو در قالب‌ها..."
                        />
                      )}
                      noOptionsText="قالب‌ای یافت نشد"
                      loadingText="در حال جستجو..."
                    />
                  </Grid>
                </Grid>
              </SectionCard>
            </Grid>

            {/* Tabs Section */}
            {selectedCategory && (
              <Grid size={{ xs: 12 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        aria-label="product template tabs"
                      >
                        <Tab label="ویژگی ها" />
                        <Tab label="اطلاعات" />
                      </Tabs>
                    </Box>

                    <Box sx={{ mt: 3 }}>
                      <Grid container spacing={3}>
                        {activeTab === 0 && renderAttributesTab()}
                        {activeTab === 1 && renderInformationTab()}
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Action Buttons */}
            {selectedCategory && (
              <Grid size={{ xs: 12 }}>
                <SectionCard>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      size="large"
                    >
                      {activeTab === 0 ? "ذخیره قالب ویژگی‌ها" : "ذخیره قالب اطلاعات"}
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      onClick={() => {
                        setFormData({});
                        setDetailsFormData({});
                        setProductName("");
                        setSku("");
                        setAttributes([]);
                        setDetailsData(null);
                        setSelectedCategory(null);
                        setActiveTab(0);
                      }}
                    >
                      انصراف از افزودن
                    </Button>
                  </Box>
                </SectionCard>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </AppLayout>
  );
}
