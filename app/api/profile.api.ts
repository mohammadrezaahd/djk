import { authorizedGet, authorizedPatch } from "~/utils/authorizeReq";
import { apiUtils } from "./apiUtils.api";
import type { IUserProfile } from "~/types/interfaces/profile.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getProfile = async () => {
  return apiUtils<IUserProfile>(async () => {
    const response = await authorizedGet(`/v1/users/profile`);
    return response.data;
  });
};

const updateProfile = async (data: Partial<Pick<IUserProfile, 'email' | 'first_name' | 'last_name'>>) => {
  return apiUtils<IUserProfile>(async () => {
    // Build query parameters only for provided fields
    const queryParams: string[] = [];
    
    if (data.email !== undefined) {
      queryParams.push(`email=${encodeURIComponent(data.email)}`);
    }
    if (data.first_name !== undefined) {
      queryParams.push(`first_name=${encodeURIComponent(data.first_name)}`);
    }
    if (data.last_name !== undefined) {
      queryParams.push(`last_name=${encodeURIComponent(data.last_name)}`);
    }
    
    const queryString = queryParams.join('&');
    const response = await authorizedPatch(`/v1/users/profile?${queryString}`);
    return response.data;
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfile(),
    enabled: true,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      // Optionally update the cache directly
      if (data?.data) {
        queryClient.setQueryData(["profile"], data);
      }
    },
  });
};
