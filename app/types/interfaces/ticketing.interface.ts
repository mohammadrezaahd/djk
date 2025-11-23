import type { TicketPriority } from "../dtos/ticketing.dto";

export interface ITicketsList {
  id: number;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  department_id: number;
}

export interface ITicket {
  id: number;
  user_id: number;
  subject: string;
  priority: string;
  status: TicketStatus;
  department: IDepartments;
  created_at: Date | string;
  messages: ITicketMessage;
}

export interface ITicketMessage {
  id: number;
  sender_id: number;
  message: string;
  is_admin: boolean;
  created_at: Date | string;
  attachments: any;
}

export interface IMessageattachment {
  file_name: string;
  file_type: string;
  file_path: string;
  size: number;
}

export interface IDepartments {
  id: number;
  name: string;
}

export enum TicketStatus {
  OPEN = "open",
  CLOSE = "closed",
}
