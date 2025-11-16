import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addAttribute,
  editAttribute,
  getAttributes,
  getAttribute,
  removeAttr,
} from "../services/attributes.service";
import type {
  AddAttributeData,
  Attribute,
  AttributeListResponse,
  GetAttributesOptions,
} from "../types/interfaces/attributes.interface";

// Custom hook to get a list of attributes
export function useAttrs(options: GetAttributesOptions) {
  return useQuery<AttributeListResponse, Error>({
    queryKey: ["attributes", options],
    queryFn: () => getAttributes(options),
  });
}

// Custom hook to get a single attribute by ID
export function useAttr(id: number, enabled = true) {
  return useQuery<Attribute, Error>({
    queryKey: ["attribute", id],
    queryFn: () => getAttribute(id),
    enabled: !!id && enabled,
  });
}

// Custom hook to add a new attribute
export function useAddAttribute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddAttributeData) => addAttribute(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
    onError: (error: Error) => {
      //
    },
  });
}

// Custom hook to edit an existing attribute
export function useEditAttr() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; data: AddAttributeData }) =>
      editAttribute(vars.id, vars.data),
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      queryClient.invalidateQueries({ queryKey: ["attribute", vars.id] });
    },
    onError: (error: Error, vars) => {
      //
    },
  });
}

// Custom hook to remove an attribute by ID
export function useRemoveAttr() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeAttr(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
    },
    onError: (error: Error) => {
      //
    },
  });
}