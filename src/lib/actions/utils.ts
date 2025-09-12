
export const API_BASE_URL = 'https://court-api.kleopatra.io/api/core';
export const API_KEY = process.env.COURT_API_KEY;

export const getAuthHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
    }
    return headers;
}
