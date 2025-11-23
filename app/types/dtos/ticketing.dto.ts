export interface IPostTicket {
  subject: string;
  department_id: number;
  priority: TicketPriority;
  first_message: string;
  files?: File[];
}

export interface IPostTicketResponse {
  ticket_id: number;
  priority: TicketPriority;
  message_id: number;
  files: { file_name: string; file_type: string; path: string; size: number }[];
}

export interface IAddMessage {
  message: string;
  // is_admin: boolean;
  files?: File[];
  ticket_id: number;
}

export enum TicketPriority {
  HIGH = 0,
  MEDIUM = 1,
  LOW = 2,
}
