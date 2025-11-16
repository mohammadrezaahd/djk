import { useState, useEffect } from "react";
import { useDetail } from "../api/details.api";
import { useAttr } from "../api/attributes.api";
import { useCategory } from "../api/categories.api";
import { ApiStatus } from "../types";
import type { ICategoryDetails } from "../types/interfaces/details.interface";
import type { ICategoryAttr } from "../types/interfaces/attributes.interface";

type TemplateType = "details" | "attributes";

export const useTemplateData = (
  type: TemplateType,
  templateId?: number,
  categoryId?: number
) => {
  const [data, setData] = useState<ICategoryDetails | ICategoryAttr | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    data: detailData,
    isLoading: detailLoading,
    error: detailError,
  } = useDetail(templateId && type === "details" ? templateId : 0);

  const {
    data: attrData,
    isLoading: attrLoading,
    error: attrError,
  } = useAttr(templateId && type === "attributes" ? templateId : 0);

  const {
    data: categoryData,
    isLoading: categoryLoading,
    error: categoryError,
  } = useCategory(
    categoryId || 0,
    {
      details: type === "details",
      attributes: type === "attributes",
    },
    !!categoryId
  );

  useEffect(() => {
    setIsLoading(detailLoading || attrLoading || categoryLoading);
    setError(detailError || attrError || categoryError);

    if (templateId) {
      if (type === "details" && detailData?.status === ApiStatus.SUCCEEDED) {
        setData(detailData.data.data_json);
      } else if (
        type === "attributes" &&
        attrData?.status === ApiStatus.SUCCEEDED
      ) {
        setData(attrData.data.data_json);
      }
    } else if (categoryId) {
      if (
        type === "details" &&
        categoryData?.status === ApiStatus.SUCCEEDED &&
        categoryData.data.item.details
      ) {
        setData(categoryData.data.item.details);
      } else if (
        type === "attributes" &&
        categoryData?.status === ApiStatus.SUCCEEDED &&
        categoryData.data.item.attributes
      ) {
        setData(categoryData.data.item.attributes);
      }
    }
  }, [
    detailData,
    attrData,
    categoryData,
    detailLoading,
    attrLoading,
    categoryLoading,
    detailError,
    attrError,
    categoryError,
    type,
    templateId,
    categoryId,
  ]);

  return { data, isLoading, error };
};