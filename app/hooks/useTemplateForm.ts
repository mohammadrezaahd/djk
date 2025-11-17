import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import { useAppDispatch } from "~/store/hooks";

// A generic function to build a Zod schema from dynamic field data
const buildSchema = (fields: any[], isValidationEnabled: boolean) => {
  if (!isValidationEnabled) {
    return z.object({});
  }

  const schemaShape = fields.reduce((shape, field) => {
    let fieldSchema;

    switch (field.type) {
      case "text":
      case "textarea":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = fieldSchema.min(1, { message: `${field.label} is required` });
        }
        break;
      case "number":
        fieldSchema = z.number();
        if (field.required) {
          fieldSchema = fieldSchema.min(0, { message: `${field.label} must be a positive number` });
        }
        break;
      case "select":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = fieldSchema.min(1, { message: `Please select a ${field.label}` });
        }
        break;
      case "multiselect":
        fieldSchema = z.array(z.string());
        if (field.required) {
          fieldSchema = fieldSchema.nonempty({ message: `Please select at least one ${field.label}` });
        }
        break;
      default:
        fieldSchema = z.any();
    }

    shape[field.name] = fieldSchema;
    return shape;
  }, {} as Record<string, z.ZodTypeAny>);

  return z.object(schemaShape);
};

interface UseTemplateFormProps<T> {
  fields: any[];
  formData: T;
  onFormChange: (data: Partial<T>) => void;
  isValidationEnabled?: boolean;
}

export const useTemplateForm = <T extends Record<string, any>>({
  fields,
  formData,
  onFormChange,
  isValidationEnabled = true,
}: UseTemplateFormProps<T>) => {
  const dispatch = useAppDispatch();

  const validationSchema = useMemo(
    () => buildSchema(fields, isValidationEnabled),
    [fields, isValidationEnabled]
  );

  const form = useForm<T>({
    resolver: zodResolver(validationSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(formData);
  }, [formData, form.reset]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      dispatch(onFormChange(value as Partial<T>));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, dispatch, onFormChange]);

  return {
    form,
    isFormValid: form.formState.isValid,
  };
};
