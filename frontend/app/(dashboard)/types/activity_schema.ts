export interface Activity {
  id: string;
  type: 'new_customer' | 'new_ticket' | 'assign_ticket' | 'complete_ticket';
  user: string;
  details: string;
  timestamp: string;
}
