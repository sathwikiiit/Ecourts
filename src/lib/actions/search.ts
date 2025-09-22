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
            id: `${item.cnr || item.case_number}-${index}`,
            case_number: item.case_number || 'N/A',
            title: item.party_name || item.title || 'N/A',
            description: item.petitioner || '',
            status: 'Pending',
            cnr: item.cnr,
            advocateName: item.advocate,
            filingNumber: item.filing?.number,
            filingYear: item.filing?.year,
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
                    id: `${c.cnr}-${index}`,
                    case_number: c.caseNumber || 'N/A',
                    title: c.title || 'N/A',
                    description: `Advocate: ${c.advocateName || 'N/A'}`,
                    status: 'Pending',
                    cnr: c.cnr,
                    advocateName: c.advocateName,
                    filingNumber: c.filing?.number,
                    filingYear: c.filing?.year,
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
      
      const searchResult: Case = await response.json();
      console.log('Search by Filing Number Results:', JSON.stringify(searchResult, null, 2));

      if (searchResult && (searchResult.cnr || searchResult.case_number)) {
        return [{
            id: searchResult.cnr || `${searchResult.case_number}-0`,
            case_number: searchResult.case_number || 'N/A', 
            title: `${searchResult.petitioner} vs ${searchResult.respondent}`,
            description: `Filing Date: ${searchResult.date_of_filing || 'N/A'}`,
            status: 'Pending',
            cnr: searchResult.cnr,
            advocateName: searchResult.advocate, 
            filingNumber: searchResult.filing?.number,
            filingYear: searchResult.filing?.year,
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
export async function lookupCaseByCnr(cnr: string): Promise<{ success: boolean, data?: Case, message?: string}> {
    noStore();
    if (!API_KEY) {
      return { success: false, message: "API Key is not configured." };
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/live/district-court/case`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ cnr }),
      });
  
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Failed to lookup case by CNR:', response.status, errorBody);
        return { success: false, message: `Failed to lookup case: ${response.statusText}` };
      }
  
      const responseText = await response.text();
      if (!responseText) {
        return { success: false, message: `No data returned for CNR: ${cnr}` };
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON response:', responseText);
        return { success: false, message: 'Invalid response from the server.' };
      }

      // Transform the raw result into our Case type
      const caseData: Case = {
        id: result.cnr, // Assuming cnr is unique and can be used as an id
        cnr: result.cnr,
        title: result.title,
        case_number: result.details.filingNumber, // Or another appropriate field
        description: `Case type: ${result.details.type}`,
        status: result.status.caseStage,
        details: result.details,
        statusDetails: result.status,
        parties: result.parties,
        actsAndSections: result.actsAndSections,
        history: result.history,
        orders: result.orders,
        firstInformationReport: result.firstInformationReport,
        transfer: result.transfer,
      };

      return { success: true, data: caseData };
    } catch (error) {
      console.error('Error looking up case by CNR:', error);
      return { success: false, message: "An unexpected error occurred." };
    }
}
