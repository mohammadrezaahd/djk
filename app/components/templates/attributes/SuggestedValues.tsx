import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { 
  AttributeType, 
  type IAttr, 
  type IAttributeValue 
} from "~/types/interfaces/attributes.interface";

interface SuggestedValuesProps {
  attr: IAttr;
  currentValue?: any;
  onSuggestionClick: (suggestion: any) => void;
}

const SuggestedValues: React.FC<SuggestedValuesProps> = ({
  attr,
  currentValue,
  onSuggestionClick,
}) => {
  // بررسی وجود گزینه‌های پیشنهادی
  if (!attr.suggest_values) {
    return null;
  }

  // اگر suggest_values یک رشته است، آن را به فرمت مناسب تبدیل می‌کنیم
  let suggestValues: { [valueId: string]: IAttributeValue };
  
  if (typeof attr.suggest_values === 'string') {
    // اگر رشته است، یک آبجکت با یک مقدار ایجاد می‌کنیم
    suggestValues = {
      "suggested": { text: attr.suggest_values, selected: false }
    };
  } else if (typeof attr.suggest_values === 'object' && attr.suggest_values !== null) {
    // اگر آبجکت است، همان را استفاده می‌کنیم
    suggestValues = attr.suggest_values;
  } else {
    return null;
  }

  // بررسی اینکه آیا گزینه‌ای وجود دارد یا نه
  if (Object.keys(suggestValues).length === 0) {
    return null;
  }

  const handleSuggestionClick = (valueId: string, valueData: IAttributeValue) => {
    switch (attr.type) {
      case AttributeType.Input:
        // برای فیلدهای عددی، مقدار را از متن استخراج می‌کنیم
        const numericValue = parseFloat(valueData.text);
        if (!isNaN(numericValue)) {
          onSuggestionClick(numericValue);
        } else {
          onSuggestionClick(valueData.text);
        }
        break;

      case AttributeType.Text:
      case AttributeType.MultiText:
        // برای فیلدهای متنی، مستقیماً متن را تنظیم می‌کنیم
        onSuggestionClick(valueData.text);
        break;

      case AttributeType.Select:
        // برای انتخاب تکی، ID گزینه را تنظیم می‌کنیم
        onSuggestionClick(valueId);
        break;

      case AttributeType.Checkbox:
        // برای انتخاب چندگانه، ID را به آرایه اضافه می‌کنیم
        onSuggestionClick((prevValue: string[] | undefined) => {
          const currentValues = prevValue || [];
          if (currentValues.includes(valueId)) {
            // اگر قبلاً انتخاب شده، آن را حذف می‌کنیم
            return currentValues.filter(id => id !== valueId);
          } else {
            // اگر انتخاب نشده، اضافه می‌کنیم
            return [...currentValues, valueId];
          }
        });
        break;

      default:
        onSuggestionClick(valueData.text);
    }
  };

  const getSuggestionLabel = (valueData: IAttributeValue): string => {
    switch (attr.type) {
      case AttributeType.Input:
        return `${valueData.text}${attr.postfix || attr.unit || ''}`;
      default:
        return valueData.text;
    }
  };

  const isSelected = (valueId: string, valueData: IAttributeValue): boolean => {
    switch (attr.type) {
      case AttributeType.Input:
        const numericValue = parseFloat(valueData.text);
        return !isNaN(numericValue) && currentValue == numericValue;
      
      case AttributeType.Text:
      case AttributeType.MultiText:
        return currentValue === valueData.text;
      
      case AttributeType.Select:
        return currentValue === valueId;
      
      case AttributeType.Checkbox:
        return Array.isArray(currentValue) && currentValue.includes(valueId);
      
      default:
        return false;
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        پیشنهادات:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {Object.entries(suggestValues).map(([valueId, valueData]) => {
          const selected = isSelected(valueId, valueData);
          return (
            <Chip
              key={valueId}
              label={getSuggestionLabel(valueData)}
              variant={selected ? "filled" : "outlined"}
              size="small"
              clickable
              onClick={() => handleSuggestionClick(valueId, valueData)}
              sx={{
                fontSize: '0.75rem',
                height: '24px',
                borderColor: selected ? 'primary.main' : 'primary.main',
                color: selected ? 'primary.contrastText' : 'primary.main',
                backgroundColor: selected ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: selected ? 'primary.dark' : 'primary.main',
                  color: 'primary.contrastText',
                  borderColor: selected ? 'primary.dark' : 'primary.main',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer',
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default SuggestedValues;