'use server';

import type { Hearing } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';
import { format } from 'date-fns';
import { courts, complexes as staticComplexes } from '@/app/data';
import { API_BASE_URL, getAuthHeaders, API_KEY } from './utils';

async function getUpcomingHearingsForCourt(courtId: string, type: 'CIVIL' | 'CRIMINAL', date: Date): Promise<Hearing[]> {
    if (!API_KEY) {
        // Silently fail if no API key is present for this internal function
        return [];
    }
    const response = await fetch(`${API_BASE_URL}/live/district-court/cause-list`, {
        method: 'POST',
        headers: getAuthHeaders(),
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
          location: courts.find(court => court.id === courtId)?.name || staticComplexes.find(cx => cx.id === list.complexId)?.name || 'N/A',
          type: list.purpose || 'Hearing',
          case_title: `${c.petitioner} vs ${c.respondent}`,
          case_number: c.caseNo,
        }))
      );
}

export async function getCaseHearings(caseId: string): Promise<Hearing[]> {
    noStore();
    // The API spec does not provide an endpoint to get hearings for a case.
    // We can get a "cause list" for a court, which is a list of hearings.
    // We will simulate this by filtering the cause list.
    // This is not ideal, but it's a workaround given the API.
    if (!API_KEY) {
      return [];
    }
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
