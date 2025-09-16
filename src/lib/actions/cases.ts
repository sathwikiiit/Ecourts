'use server';

import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import type { Case } from '@/lib/types';
import { API_BASE_URL, getAuthHeaders, API_KEY } from './utils';

// In-memory store for simplicity
let cases: Case[] = [];
let caseIdCounter = 1;

export async function getCases(): Promise<Case[]> {
  noStore();
  return Promise.resolve(cases);
}

export async function addCase(caseData: Omit<Case, 'id'>): Promise<{ success: boolean, message?: string }> {
  const newCase: Case = { ...caseData, id: String(caseIdCounter++) };
  cases.push(newCase);
  revalidatePath('/my-cases');
  return Promise.resolve({ success: true });
}

export async function searchCasesByAdvocate(advocateName: string): Promise<Case[]> {
    noStore();
    if (!API_KEY) {
      console.error("API Key is not configured. Please set COURT_API_KEY environment variable.");
      return [];
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/cases/search/advocate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ advocateName }),
      });
  
      if (!response.ok) {
        console.error('Failed to search cases by advocate:', response.status, await response.text());
        return [];
      }
  
      const result = await response.json();
      return result.cases.map((c: any) => ({
        id: c.cnr, // Assuming cnr is unique
        title: `${c.filingNumber} - ${c.advocateName}`,
        description: c.caseType,
        status: c.caseStatus,
        cnr: c.cnr,
        advocateName: c.advocateName,
        filingNumber: c.filingNumber,
        filingYear: c.filingYear,
      }));
    } catch (error) {
      console.error('Error searching cases by advocate:', error);
      return [];
    }
  }

  export async function searchCasesByFilingNumber(filingNumber: string): Promise<Case[]> {
    noStore();
    if (!API_KEY) {
      console.error("API Key is not configured. Please set COURT_API_KEY environment variable.");
      return [];
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/cases/search/filing-number`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ filingNumber }),
      });
  
      if (!response.ok) {
        console.error('Failed to search cases by filing number:', response.status, await response.text());
        return [];
      }
  
      const result = await response.json();
      return result.cases.map((c: any) => ({
        id: c.cnr, // Assuming cnr is unique
        title: `${c.filingNumber} - ${c.advocateName}`,
        description: c.caseType,
        status: c.caseStatus,
        cnr: c.cnr,
        advocateName: c.advocateName,
        filingNumber: c.filingNumber,
        filingYear: c.filingYear,
      }));
    } catch (error) {
      console.error('Error searching cases by filing number:', error);
      return [];
    }
  }

export async function lookupCaseByCnr(cnr: string): Promise<{ success: boolean, data?: any, message?: string}> {
    noStore();
    if (!API_KEY) {
      return { success: false, message: "API Key is not configured." };
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/cases/search/cnr`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ cnr }),
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Failed to lookup case by CNR:', response.status, errorBody);
        return { success: false, message: `Failed to lookup case: ${response.statusText}` };
      }
  
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error looking up case by CNR:', error);
      return { success: false, message: "An unexpected error occurred." };
    }
}
