import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addDetail,
  editDetail,
  getDetails,
  getDetail,
  removeDetail,
} from "../services/details.service";
import type {
  AddDetailData,
  Detail,
  DetailListResponse,
  GetDetailsOptions,
} from "../types/interfaces/details.interface";
import { ApiStatus } from "../types";

// Custom hook to get a list of details
export function useDetails() {
  const queryClient = useQueryClient();
  return useMutation<DetailListResponse, Error, GetDetailsOptions>({
    mutationFn: (options: GetDetailsOptions) => getDetails(options),
    onSuccess: (data) => {
      // You might want to update the cache here if needed
      // For example, if you want to store the fetched list in the cache
    },
  });
}

// Custom hook to get a single detail by ID
export function useDetail(id: number, enabled = true) {
  return useQuery<Detail, Error>({
    queryKey: ["detail", id],
    queryFn: () => getDetail(id),
    enabled: !!id && enabled,
  });
}

// Custom hook to add a new detail
export function useAddDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddDetailData) => addDetail(data),
    onSuccess: (data) => {
      if (data.status === ApiStatus.SUCCEEDED) {
        queryClient.invalidateQueries({ queryKey: ["details"] });
      }
    },
    onError: (error: Error) => {
      //
    },
  });
}

// Custom hook to edit an existing detail
export function useEditDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; data: AddDetailData }) =>
      editDetail(vars.id, vars.data),
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["details"] });
      queryClient.invalidateQueries({ queryKey: ["detail", vars.id] });
    },
    onError: (error: Error, vars) => {
      //
    },
  });
}

// Custom hook to remove a detail by ID
export function useRemoveDetail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeDetail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["details"] });
    },
    onError: (error: Error) => {
      //
    },
  });
}