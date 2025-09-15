// This file contains static data that would typically be fetched from the API's static endpoints.
// For example, from /api/core/static/district-court/courts
// To keep the demo simple, we're hardcoding it here.

export const courts = [
    { id: '1', name: 'District Court - Tis Hazari' },
    { id: '2', name: 'District Court - Karkardooma' },
    { id: '3', name: 'District Court - Patiala House' },
    { id: '4', name: 'District Court - Rohini' },
    { id: '5', name: 'District Court - Dwarka' },
    { id: '6', name: 'District Court - Saket' },
    { id: '7', name: 'District Court - Rouse Avenue' },
];

// This is fallback data in case the API fails
export const states: {id: string, name: string}[] = [];

// This is fallback data in case the API fails
export const complexes: {id: string, name: string, districtId: string}[] = []

// This is fallback data in case the API fails
export const districts: {id: string, name: string, stateId: string}[] = []
