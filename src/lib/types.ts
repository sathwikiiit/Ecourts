export interface Case {
  id: string;
  case_number: string;
  title: string;
  description: string;
  status: 'Open' | 'Closed' | 'Pending';
  cnr?: string;
  advocateName?: string;
  filingNumber?: string;
  filingYear?: string;
}

export interface Hearing {
  id: string;
  case_id: string; // CNR
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  type: string;
  case_title?: string;
  case_number?: string;
}

export interface State {
    id: string;
    name: string;
}

export interface District {
  id: string;
  name: string;
  stateId: string;
}

export interface Complex {
  id: string;
  name: string;
  districtId: string;
}
