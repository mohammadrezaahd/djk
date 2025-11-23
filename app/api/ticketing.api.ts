import { authorizedGet, authorizedPost } from "~/utils/authorizeReq";
import { apiUtils } from "./apiUtils.api";
import type {
  IPostTicket,
  IPostTicketResponse,
} from "~/types/dtos/ticketing.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  IDepartments,
  ITicket,
  ITicketsList,
} from "~/types/interfaces/ticketing.interface";

const creatNewTicket = async (data: IPostTicket) => {
  return apiUtils<{ data: IPostTicketResponse }>(async () => {
    const response = await authorizedPost("/v1/ticketing/create", data);

    return response.data;
  });
};

const getTicketsList = async ({
  skip = 0,
  limit = 50,
  search = "",
  status_filter,
  department_id,
}: {
  skip?: number;
  limit?: number;
  search?: string;
  status_filter?: string;
  department_id?: number;
}) => {
  return apiUtils<{ list: ITicketsList[] }>(async () => {
    let url = `/v1/ticketing/list?skip=${skip}&limit=${limit}`;
    if (search && search.trim().length > 0) {
      url += `&search_title=${encodeURIComponent(search)}`;
    }
    if (status_filter !== undefined) {
      url += `&status_filter=${status_filter}`;
    }
    if (department_id !== undefined) {
      url += `&department_id=${department_id}`;
    }
    const response = await authorizedPost(url);
    return response.data;
  });
};

const getTicket = async ({
  page = 1,
  per_page = 5,
  ticket_id,
}: {
  page?: number;
  per_page?: number;
  ticket_id: number;
}) => {
  return apiUtils<{ list: ITicket }>(async () => {
    const response = await authorizedGet(
      `/v1/ticketing/get/${ticket_id}?page=${page}&per_page=${per_page}`
    );
    return response.data;
  });
};

const getDepartments = async () => {
  return apiUtils<{ list: IDepartments[] }>(async () => {
    const response = await authorizedGet("/v1/ticketing/departments");
    return response.data;
  });
};

export const useNewTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: creatNewTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets new"] });
      // console.log("✅ Attribute added successfully:", data);
    },
    onError: (error) => {
      console.error("❌ Error adding ticket:", error);
    },
  });
};

export const useTickets = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getTicketsList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets list"] });
    },
    onError: (error) => {
      console.error("❌ Error fetching tickets list:", error);
    },
  });
};

export const useTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
    },
    onError: (error) => {
      console.error("❌ Error fetching ticket:", error);
    },
  });
};

export const useDepartments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getDepartments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments list"] });
    },
    onError: (error) => {
      console.error("❌ Error fetching departments list:", error);
    },
  });
};
