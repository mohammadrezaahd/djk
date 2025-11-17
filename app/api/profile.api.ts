import { authorizedGet } from "~/utils/authorizeReq";
import { apiUtils } from "./apiUtils.api";
import type { IUserProfile } from "~/types/interfaces/profile.interface";
import { useQuery } from "@tanstack/react-query";

const getProfile = async () => {
  return apiUtils<IUserProfile>(async () => {
    const response = await authorizedGet(`/v1/users/profile`);
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
