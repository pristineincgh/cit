export interface TicketPublic {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface TicketShortDetails {
  id: string;
  title: string;
  description: string | null;
  customer: string;
  created_by: string;
  assigned_to: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface TicketList {
  total: number;
  tickets: TicketShortDetails[];
}
