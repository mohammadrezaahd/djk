import type { IPostAttr } from "~/types/dtos/attributes.dto";
import { apiUtils } from "./apiUtils.api";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// تابع کمکی برای گرفتن توکن از localStorage
const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

// افزودن ویژگی جدید با Authorization header خودکار
const addNewAttr = async (data: IPostAttr) => {
  return apiUtils<{ data: { id: number } }>(async () => {
    const token = getToken();

    const response = await axios.post(`${apiUrl}/v1/attributes/save`, data, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return {
      status: "true" as any,
      code: response.status as any,
      data: response.data.data,
    };
  });
};

export const attrsApi = { addNewAttr };
