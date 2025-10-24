import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Box,
  Typography,
  Paper,
  Autocomplete,
  Chip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { categoriesApi } from "~/api/categories.api";

import AppLayout from "~/components/AppLayout";
import { ApiStatus } from "~/types";
import type {
  IAttr,
  IAttributeValue,
  ICategoryList,
} from "~/types/interfaces/categories.interface";
import { AttributeType } from "~/types/interfaces/categories.interface";

export function meta() {
  return [
    { title: "ایجاد قالب محصول جدید" },
    { name: "description", content: "صفحه ایجاد قالب محصول جدید" },
  ];
}

export default function NewProductTemplate() {
  const [attributes, setAttributes] = useState<IAttr[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalCategoryData, setOriginalCategoryData] = useState<any>(null);
  const [categories, setCategories] = useState<ICategoryList[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategoryList | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(false);

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
      if (res.status === ApiStatus.TRUE && res.data) {
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

  const fetcher = async () => {
    if (!selectedCategory) {
      alert("ابتدا یک دسته‌بندی انتخاب کنید.");
      return;
    }

    setLoading(true);
    try {
      const res = await categoriesApi.getCategories(selectedCategory.id);
      if (res.status === ApiStatus.TRUE && res.data) {
        const data = res.data;
        const categoryGroupAttributes =
          data.item.attributes.category_group_attributes;

        // ذخیره داده‌های اصلی برای استفاده در handleSubmit
        setOriginalCategoryData(categoryGroupAttributes);

        // استخراج تمام attributes از تمام گروه‌ها
        const allAttributes: IAttr[] = [];
        const initialFormData: { [key: string]: any } = {};

        Object.values(categoryGroupAttributes).forEach((categoryData) => {
          Object.values(categoryData.attributes).forEach((attr) => {
            allAttributes.push(attr);

            // تنظیم مقادیر پیش‌فرض بر اساس selected values
            const selectedValues = Object.entries(attr.values)
              .filter(([_, valueData]) => valueData.selected)
              .map(([valueId, _]) => valueId);

            if (selectedValues.length > 0) {
              if (attr.type === AttributeType.Select) {
                initialFormData[attr.id] = selectedValues[0]; // اولین مقدار selected
              } else if (attr.type === AttributeType.Checkbox) {
                initialFormData[attr.id] = selectedValues; // تمام مقادیر selected
              }
            }
          });
        });

        setAttributes(allAttributes);
        setFormData((prev) => ({ ...prev, ...initialFormData }));
        console.log("Loaded attributes for category:", selectedCategory.title);
        console.log("Attributes:", allAttributes);
        console.log("Initial form data:", initialFormData);
      }
    } catch (error) {
      console.error("Error loading attributes:", error);
      alert("خطا در بارگیری ویژگی‌ها. لطفاً دوباره تلاش کنید.");
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

  return (
    <AppLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          ایجاد قالب محصول جدید
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            انتخاب دسته‌بندی محصول
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Autocomplete
              fullWidth
              options={categories}
              getOptionLabel={(option) => option.title}
              value={selectedCategory}
              onChange={(_, newValue) => {
                setSelectedCategory(newValue);
                // پاک کردن داده‌های قبلی هنگام تغییر دسته‌بندی
                if (newValue !== selectedCategory) {
                  setAttributes([]);
                  setFormData({});
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
                  label="جستجو و انتخاب دسته‌بندی *"
                  placeholder="نام دسته‌بندی را تایپ کنید..."
                  helperText="ابتدا دسته‌بندی مورد نظر را انتخاب کنید"
                />
              )}
              noOptionsText="دسته‌بندی‌ای یافت نشد"
              loadingText="در حال جستجو..."
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={fetcher}
            disabled={loading || !selectedCategory}
            fullWidth
          >
            {loading 
              ? "در حال بارگیری ویژگی‌ها..." 
              : selectedCategory 
                ? `لود ویژگی‌های ${selectedCategory.title}`
                : "ابتدا دسته‌بندی را انتخاب کنید"
            }
          </Button>
        </Box>

        {attributes.length > 0 && (
          <Paper sx={{ p: 3 }}>
            {/* <Typography variant="h6" gutterBottom>
              فرم ویژگی‌های محصول ({attributes.length} مورد)
            </Typography> */}

            {/* فیلد جستجو */}
            {/* <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="جستجو در ویژگی‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: "🔍"
                }}
              />
              {searchTerm && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  {filteredAttributes.length} نتیجه یافت شد
                </Typography>
              )}
            </Box> */}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {filteredAttributes.map((attr) => (
                <Box key={attr.id}>{renderField(attr)}</Box>
              ))}
            </Box>

            {filteredAttributes.length === 0 && searchTerm && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body2" color="textSecondary">
                  هیچ ویژگی‌ای با عبارت "{searchTerm}" یافت نشد
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                ذخیره فرم
              </Button>
              <Button variant="outlined" onClick={() => setFormData({})}>
                پاک کردن فرم
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSearchTerm("")}
                disabled={!searchTerm}
              >
                پاک کردن جستجو
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </AppLayout>
  );
}
