import type { IPostProduct } from "~/types/dtos/product.dto";
import { apiUtils } from "./apiUtils.api";
import { authorizedPost } from "~/utils/authorizeReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addNewProduct = async (data: IPostProduct) => {
  return apiUtils<{ data: { id: number } }>(async () => {
    const response = await authorizedPost("/v1/cp_products/save", data);

    return {
      status: "true" as any,
      code: response.status as any,
      data: response.data.data,
    };
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewProduct,
    onSuccess: (data) => {
      // Invalidate related queries after successful creation
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      console.log("✅ Product added successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error adding product:", error);
    },
  });
};
