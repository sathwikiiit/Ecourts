export interface CaseDetails {
  type: string;
  filingNumber: string;
  filingDate: string;
  registrationNumber: string;
  registrationDate: string;
}

export interface CaseStatus {
  firstHearingDate: string;
  nextHearingDate: string;
  decisionDate: string;
  natureOfDisposal: string;
  caseStage: string;
  courtNumberAndJudge: string;
}

export interface Parties {
  petitioners: string[];
  respondents: string[];
  petitionerAdvocates: string[];
  respondentAdvocates: string[];
}

export interface ActsAndSections {
  acts: string;
  sections: string;
}

export interface HistoryItem {
  judge: string;
  businessDate: string;
  nextDate: string;
  purpose: string;
  url: string;
}

export interface OrderItem {
  number: number;
  name: string;
  date: string;
  url: string;
}

export interface Case {
  id: string;
  case_number: string;
  title: string;
  description: string;
  status: string;
  cnr?: string;
  advocateName?: string;
  filingNumber?: string;
  filingYear?: string;
  details?: CaseDetails;
  statusDetails?: CaseStatus;
  parties?: Parties;
  actsAndSections?: ActsAndSections;
  history?: HistoryItem[];
  orders?: OrderItem[];
  firstInformationReport?: any; // Or a more specific type if known
  transfer?: any[]; // Or a more specific type if known
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