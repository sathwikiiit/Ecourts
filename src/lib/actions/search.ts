'use server';

import type { Case } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';
import { API_BASE_URL, getAuthHeaders, API_KEY } from './utils';

type CaseSearchOptions = {
    name: string;
    year?: string;
    stage?: 'PENDING' | 'DISPOSED' | 'BOTH';
    districtId?: string;
    complexId?: string;
};

export async function searchCases(options: CaseSearchOptions): Promise<Case[]> {
  noStore();
  if (!options.name) return [];
  if (!API_KEY) {
    console.error("API Key is not configured. Please set COURT_API_KEY environment variable.");
    return [{ id: '1', case_number: 'Error', title: 'API Key Not Configured', description: '', status: 'Pending' }];
  }
  try {
    const body: any = {
        name: options.name,
        stage: options.stage || 'PENDING',
        year: options.year || new Date().getFullYear().toString(),
    };

    if (options.districtId) body.districtId = options.districtId;
    if (options.complexId) body.complexId = options.complexId;

    const response = await fetch(`${API_BASE_URL}/live/district-court/search/party`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      console.error('Failed to fetch cases:', response.status, await response.text());
      return [];
    }

    const searchResults = await response.json();
    console.log('Search by Party Results:', JSON.stringify(searchResults, null, 2));
    
    if (Array.isArray(searchResults)) {
        return searchResults.map((item: any, index: number) => ({
            id: `${item.cnr}-${index}`,
            case_number: item.case_number || 'N/A',
            title: item.party_name || 'N/A',
            description: item.petitioner || '',
            status: 'Pending',
        }));
    } else {
        console.warn('Search by party did not return an array:', searchResults);
    }

    return [];

  } catch (error) {
    console.error('Error searching cases:', error);
    return [];
  }
}

type AdvocateSearchOptions = {
    name: string;
    stage?: 'PENDING' | 'DISPOSED' | 'BOTH';
    districtId?: string;
    complexId?: string;
};

export async function searchCasesByAdvocate(options: AdvocateSearchOptions): Promise<Case[]> {
    noStore();
    if (!options.name) return [];
    if (!API_KEY) {
        console.error("API Key is not configured.");
        return [{ id: '1', case_number: 'Error', title: 'API Key Not Configured', description: '', status: 'Pending' }];
    }
    try {
        const body: any = {
            name: options.name,
            stage: options.stage || 'PENDING',
        };

        if (options.districtId) body.districtId = options.districtId;
        if (options.complexId) body.complexId = options.complexId;

        const response = await fetch(`${API_BASE_URL}/live/district-court/search/advocate`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.error('Failed to fetch cases by advocate:', response.status, await response.text());
            return [];
        }

        const searchResults = await response.json();
        console.log('Search by Advocate Results:', JSON.stringify(searchResults, null, 2));

        if (Array.isArray(searchResults)) {
            return searchResults.flatMap((complex: any) => {
                if (!complex || !Array.isArray(complex.cases)) {
                    console.warn('Unexpected complex object format in advocate search:', complex);
                    return [];
                }
                return (complex.cases || []).map((c:any, index: number) => ({
                    id: `${c.cnr}-${index}`, // Create a unique ID
                    case_number: c.caseNumber || 'N/A',
                    title: c.title || 'N/A',
                    description: `Advocate: ${c.advocateName || 'N/A'}`,
                    status: 'Pending'
                }))
            });
        } else {
            console.warn('Search by advocate did not return an array:', searchResults);
        }
        return [];
    } catch (error) {
        console.error('Error searching cases by advocate:', error);
        return [];
    }
}

type FilingSearchOptions = {
    filingNumber: string;
    filingYear: string;
    districtId?: string;
    complexId?: string;
};

export async function searchCasesByFilingNumber(options: FilingSearchOptions): Promise<Case[]> {
  noStore();
  if (!options.filingNumber || !options.filingYear) return [];
  if (!API_KEY) {
      console.error("API Key is not configured.");
      return [{ id: '1', case_number: 'Error', title: 'API Key Not Configured', description: '', status: 'Pending' }];
  }
  try {
    const body: any = {
        filingNumber: options.filingNumber,
        filingYear: options.filingYear,
    };
    if (options.districtId) body.districtId = options.districtId;
    if (options.complexId) body.complexId = options.complexId;
    
      const response = await fetch(`${API_BASE_URL}/live/district-court/search/filing`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(body),
      });

      if (!response.ok) {
          console.error('Failed to fetch cases by filing number:', response.status, await response.text());
          return [];
      }
      
      const searchResult = await response.json();
      console.log('Search by Filing Number Results:', JSON.stringify(searchResult, null, 2));

      // The API seems to return a single object, not an array for filing search
      if (searchResult && searchResult.cnr) {
        return [{
            id: searchResult.cnr, // This should be unique for a single result
            case_number: searchResult.case_number || 'N/A',
            title: `${searchResult.petitioner} vs ${searchResult.respondent}`,
            description: `Filing Date: ${searchResult.date_of_filing || 'N/A'}`,
            status: 'Pending',
        }];
      } else {
        console.warn('Search by filing number returned unexpected format:', searchResult);
      }

      return [];
  } catch (error) {
      console.error('Error searching cases by filing number:', error);
      return [];
  }
}