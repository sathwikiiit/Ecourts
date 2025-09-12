'use server';

import type { Case, Hearing } from '@/lib/types';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { courts } from './data';

const API_BASE_URL = 'https://court-api.kleopatra.io/api/core/live/district-court';

export async function searchCases(keyword: string): Promise<Case[]> {
  noStore();
  if (!keyword) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/search/party`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: keyword,
        stage: 'PENDING',
        year: new Date().getFullYear().toString(),
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to fetch cases:', response.status, await response.text());
      return [];
    }

    const searchResults = await response.json();
    
    // Assuming the API returns a list of cases with a similar structure
    if (Array.isArray(searchResults)) {
        return searchResults.map((item: any, index: number) => ({
            id: item.cnr || index,
            case_number: item.case_number || 'N/A',
            title: item.party_name || 'N/A',
            description: item.petitioner || '', // using petitioner as description
            status: 'Pending',
        }));
    }

    return [];

  } catch (error) {
    console.error('Error searching cases:', error);
    return [];
  }
}

export async function getCaseHearings(caseId: number | string): Promise<Hearing[]> {
  noStore();
  // The new API spec does not provide an endpoint to get hearings for a case.
  // We can get a "cause list" for a court, which is a list of hearings.
  // We will simulate this by filtering the cause list.
  // This is not ideal, but it's a workaround given the API.
  try {
    const today = new Date();
    // We'll fetch for both Civil and Criminal and merge
    const [civilHearings, criminalHearings] = await Promise.all([
      getUpcomingHearingsForCourt(courts[0].id, 'CIVIL', today),
      getUpcomingHearingsForCourt(courts[0].id, 'CRIMINAL', today)
    ]);
    
    const allHearings = [...civilHearings, ...criminalHearings];

    // The API doesn't let us filter by case ID, so we are filtering client-side
    // This is inefficient and just for demonstration with the current API
    // The cnr is a guess for the caseId
    return allHearings.filter(h => h.case_id === caseId);

  } catch (error) {
    console.error(`Error getting hearings for case ${caseId}:`, error);
    return [];
  }
}

async function getUpcomingHearingsForCourt(courtId: string, type: 'CIVIL' | 'CRIMINAL', date: Date): Promise<Hearing[]> {
    const response = await fetch(`${API_BASE_URL}/cause-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courtId: courtId,
          type: type,
          date: format(date, 'dd-MM-yyyy'),
        }),
      });

      if (!response.ok) {
        // Not finding a cause list for a given day is normal
        if (response.status === 404) return [];
        console.error(`Failed to fetch ${type} cause list:`, response.status, await response.text());
        return [];
      }

      const result = await response.json();
      const causeList = result?.causeList || [];
      
      return causeList.flatMap((list: any) => 
        (list.cases || []).map((c: any, index: number) => ({
          id: `${c.cnr}-${index}`,
          case_id: c.cnr,
          date: format(date, 'yyyy-MM-dd'),
          time: '09:00', // API doesn't provide time, using a default
          location: courts.find(court => court.id === courtId)?.name || 'N/A',
          type: list.purpose || 'Hearing',
          case_title: `${c.petitioner} vs ${c.respondent}`,
          case_number: c.caseNo,
        }))
      );
}

export async function getUpcomingHearings(): Promise<Hearing[]> {
  noStore();
  try {
    const today = new Date();
    // For simplicity, we'll fetch from the first court in our static data.
    // In a real app, the user would select a court.
    const courtId = courts[0].id; 
    
    const [civilHearings, criminalHearings] = await Promise.all([
      getUpcomingHearingsForCourt(courtId, 'CIVIL', today),
      getUpcomingHearingsForCourt(courtId, 'CRIMINAL', today)
    ]);
    
    return [...civilHearings, ...criminalHearings];
  } catch (error) {
    console.error('Error fetching upcoming hearings:', error);
    return [];
  }
}

export async function addCase(formData: Omit<Case, 'id'>) {
    console.log('Adding new case:', formData);
    // In a real app, you would post this to an API endpoint.
    // For this demo, we'll just log it and simulate success.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // After adding, we can revalidate paths to show new data if needed
    revalidatePath('/'); 
    // And redirect the user
    redirect('/');
  }