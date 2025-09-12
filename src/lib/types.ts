export interface Case {
  id: number;
  case_number: string;
  title: string;
  description: string;
  status: 'Open' | 'Closed' | 'Pending';
}

export interface Hearing {
  id: number;
  case_id: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  type: string;
  case_title?: string;
  case_number?: string;
}
