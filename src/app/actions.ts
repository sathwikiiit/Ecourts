'use server';

import type { Case, Hearing } from '@/lib/types';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

    // The API returns a different structure. Let's assume we need to adapt it.
    // Based on the spec, the response is not defined. I'll assume it returns an array of cases.
    const searchResults = await response.json();
    
    // Since we don't know the exact response structure, we'll try to map it.
    // This is a guess based on the previous structure.
    if (Array.isArray(searchResults)) {
        return searchResults.map((item: any, index: number) => ({
            id: item.cnr || index, // cnr seems like a good unique id
            case_number: item.case_number || 'N/A',
            title: item.party_name || 'N/A',
            description: item.description || '',
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
  // Returning empty array.
  return [];
}

export async function getUpcomingHearings(): Promise<Hearing[]> {
  noStore();
  // The new API spec does not provide an endpoint for upcoming hearings.
  // Returning empty array.
  return [];
}

export async function addCase(formData: Omit<Case, 'id'>) {
    console.log('Adding new case:', formData);
    // In a real app, you would post this to an API endpoint.
    // For this demo, we'll just log it and simulate success.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // After adding, we can revalidate paths to show new data if needed
    // revalidatePath('/'); 
    // And redirect the user
    redirect('/');
  }
