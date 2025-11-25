import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authorizedGet, authorizedPost } from "~/utils/authorizeReq";
import { apiUtils } from "~/api/apiUtils.api";
import type {
  IAddMessage,
  IPostTicket,
  IPostTicketResponse,
} from "~/types/dtos/ticketing.dto";
import type {
  IDepartments,
  ITicket,
  ITicketsList,
} from "~/types/interfaces/ticketing.interface";

const creatNewTicket = async (data: IPostTicket) => {
  return apiUtils<{ data: IPostTicketResponse }>(async () => {
    // Always use FormData for all data
    const formData = new FormData();

    // Add all form fields to FormData
    formData.append("subject", data.subject);
    formData.append("department_id", String(data.department_id));
    formData.append("priority", String(data.priority));
    formData.append("first_message", data.first_message);

    // Add files if they exist
    if (data.files && data.files.length > 0) {
      data.files.forEach((file, index) => {
        formData.append("files", file);
      });
    }

    const response = await authorizedPost("/v1/ticketing/create", formData, {
      headers: {
        // Don't set Content-Type, let browser set it with boundary for FormData
      },
    });

    return response.data;
  });
};

const addNewMessage = async (data: IAddMessage) => {
  return apiUtils<{ data: IPostTicketResponse }>(async () => {
    // Always use FormData for all data
    const formData = new FormData();

    // Add all form fields to FormData

    formData.append("is_admin", "false");
    formData.append("message", data.message);
    // Add files if they exist
    if (data.files && data.files.length > 0) {
      data.files.forEach((file, index) => {
        formData.append("files", file);
      });
    }

    const response = await authorizedPost(
      `/v1/ticketing/message/add/${data.ticket_id}`,
      formData,
      {
        headers: {
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
      }
    );

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

const closeTicket = async (ticket_id: number) => {
  return apiUtils<any>(async () => {
    const response = await authorizedPost(`/v1/ticketing/close/${ticket_id}`);

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

export const useNewMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
      queryClient.invalidateQueries({ queryKey: ["tickets list"] });
    },
    onError: (error) => {
      console.error("❌ Error adding ticket message:", error);
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

export const useCloseTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
      queryClient.invalidateQueries({ queryKey: ["tickets list"] });
    },
    onError: (error) => {
      console.error("❌ Error closing ticket:", error);
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
