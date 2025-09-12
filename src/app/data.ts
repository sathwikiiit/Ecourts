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

export const complexes = [
    {id: '1', name: 'Tis Hazari Court Complex', districtId: '1' },
    {id: '2', name: 'Karkardooma Court Complex', districtId: '2'},
    {id: '3', name: 'Patiala House Court Complex', districtId: '3'},
    {id: '4', name: 'Rohini Court Complex', districtId: '4'},
    {id: '5', name: 'Dwarka Court Complex', districtId: '5'},
    {id: '6', name: 'Saket Court Complex', districtId: '6'},
    {id: '7', name: 'Rouse Avenue Court Complex', districtId: '7'},
]

export const districts = [
    {id: '1', name: 'Central Delhi'},
    {id: '2', name: 'East Delhi'},
    {id: '3', name: 'New Delhi'},
    {id: '4', name: 'North West Delhi'},
    {id: '5', name: 'South West Delhi'},
    {id: '6', name: 'South East Delhi'},
    {id: '7', name: 'Rouse Avenue'},
]
