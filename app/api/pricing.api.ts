import type {
  IPricing,
  ITrxStatus,
} from "~/types/interfaces/pricing.interface";
import { apiUtils } from "./apiUtils.api";
import { authorizedGet, authorizedPost } from "~/utils/authorizeReq";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getPricingList = async () => {
  return apiUtils<{ list: IPricing[] }>(async () => {
    const response = await authorizedGet(`/v1/payments/plans`);
    return response.data;
  });
};

const initPayment = async (plan_id: number) => {
  return apiUtils<any>(async () => {
    const response = await authorizedPost(`/v1/payments/create`, {
      plan_id: plan_id,
    });

    return response.data;
  });
};

const getTrxStatus = async (trxId: number) => {
  return apiUtils<ITrxStatus>(async () => {
    const response = await authorizedGet(`/v1/payments/status/${trxId}`);
    return response.data;
  });
};

export const usePricing = () => {
  return useQuery({
    queryKey: ["pricing"],
    queryFn: () => getPricingList(),
    enabled: true,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const useInitPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pricing"] });
    },
    onError: (error) => {
      console.error("❌ Error initiating payment:", error);
    },
  });
};

export const useTrxStatus = (trxId: number, options?: { enabled?: boolean; retry?: number; retryDelay?: number }) => {
  return useQuery({
    queryKey: ["trx", trxId],
    queryFn: () => getTrxStatus(trxId),
    enabled: options?.enabled ?? !!trxId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: options?.retry ?? 3,
    retryDelay: options?.retryDelay ?? 1000,
  });
};
