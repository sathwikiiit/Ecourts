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
export const states = [
    { id: '1', name: 'Andhra Pradesh' },
    { id: '2', name: 'Arunachal Pradesh' },
    { id: '3', name: 'Assam' },
    { id: '4', name: 'Bihar' },
    { id: '5', name: 'Chandigarh' },
    { id: '6', name: 'Chhattisgarh' },
    { id: '7', name: 'Dadra and Nagar Haveli' },
    { id: '8', name: 'Daman and Diu' },
    { id: '9', name: 'Delhi' },
    { id: '10', name: 'Goa' },
    { id: '11', name: 'Gujarat' },
    { id: '12', name: 'Haryana' },
    { id: '13', name: 'Himachal Pradesh' },
    { id: '14', name: 'Jammu and Kashmir' },
    { id: '15', name: 'Jharkhand' },
    { id: '16', name: 'Karnataka' },
    { id: '17', name: 'Kerala' },
    { id: '18', name: 'Madhya Pradesh' },
    { id: '19', name: 'Maharashtra' },
    { id: '20', name: 'Manipur' },
    { id: '21', name: 'Meghalaya' },
    { id: '22', name: 'Mizoram' },
    { id: '23', name: 'Nagaland' },
    { id: '24', name: 'Odisha' },
    { id: '25', name: 'Puducherry' },
    { id: '26', name: 'Punjab' },
    { id: '27', name: 'Rajasthan' },
    { id: '28', name: 'Sikkim' },
    { id: '29', name: 'Tamil Nadu' },
    { id: '30', name: 'Telangana' },
    { id: '31', name: 'Tripura' },
    { id: '32', name: 'Uttar Pradesh' },
    { id: '33', name: 'Uttarakhand' },
    { id: '34', name: 'West Bengal' }
];

// This is fallback data in case the API fails
export const complexes = [
    {id: '1', name: 'Tis Hazari Court Complex', districtId: '1' },
    {id: '2', name: 'Karkardooma Court Complex', districtId: '2'},
    {id: '3', name: 'Patiala House Court Complex', districtId: '3'},
    {id: '4', name: 'Rohini Court Complex', districtId: '4'},
    {id: '5', name: 'Dwarka Court Complex', districtId: '5'},
    {id: '6', name: 'Saket Court Complex', districtId: '6'},
    {id: '7', name: 'Rouse Avenue Court Complex', districtId: '7'},
]

// This is fallback data in case the API fails
export const districts = [
    {id: '1', name: 'Central Delhi', stateId: '1'},
    {id: '2', name: 'East Delhi', stateId: '1'},
    {id: '3', name: 'New Delhi', stateId: '1'},
    {id: '4', name: 'North West Delhi', stateId: '1'},
    {id: '5', name: 'South West Delhi', stateId: '1'},
    {id: '6', name: 'South East Delhi', stateId: '1'},
    {id: '7', name: 'Rouse Avenue', stateId: '1'},
]
