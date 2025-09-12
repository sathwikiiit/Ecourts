'use server';

import type { Case, Hearing } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';

const API_BASE_URL = 'https://court-api.kleopatra.io';

export async function searchCases(keyword: string): Promise<Case[]> {
  noStore();
  if (!keyword) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/cases/search/?keyword=${encodeURIComponent(keyword)}`);
    if (!response.ok) {
      console.error('Failed to fetch cases:', response.statusText);
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error searching cases:', error);
    return [];
  }
}

export async function getCaseHearings(caseId: number): Promise<Hearing[]> {
  noStore();
  try {
    const response = await fetch(`${API_BASE_URL}/cases/${caseId}/hearings`);
    if (!response.ok) {
      console.error('Failed to fetch hearings:', response.statusText);
      return [];
    }
    return response.json();
  } catch (error) {
    console.error('Error getting case hearings:', error);
    return [];
  }
}

export async function getUpcomingHearings(): Promise<Hearing[]> {
  noStore();
  try {
    const response = await fetch(`${API_BASE_URL}/hearings/upcoming`);
    if (!response.ok) {
      console.error('Failed to fetch upcoming hearings:', response.statusText);
      return [];
    }
    const hearings = await response.json();
    
    // The API doesn't include case info in this endpoint, so we fetch it for each hearing.
    // In a real app, this would be inefficient and the API should be improved.
    const hearingsWithCaseInfo = await Promise.all(
      hearings.map(async (hearing: Hearing) => {
        const caseResponse = await fetch(`${API_BASE_URL}/cases/${hearing.case_id}`);
        if(caseResponse.ok) {
          const caseInfo: Case = await caseResponse.json();
          return {
            ...hearing,
            case_title: caseInfo.title,
            case_number: caseInfo.case_number
          };
        }
        return hearing;
      })
    );
    
    return hearingsWithCaseInfo;
  } catch (error) {
    console.error('Error getting upcoming hearings:', error);
    return [];
  }
}
