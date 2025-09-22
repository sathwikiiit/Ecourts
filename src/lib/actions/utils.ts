import { getRequestContext } from "@cloudflare/next-on-pages";

export const API_BASE_URL = 'https://court-api.kleopatra.io/api/core';
//@ts-expect-error -- IGNORE ---
export const API_KEY = getRequestContext().env.COURT_API_KEY;

export const getAuthHeaders = () => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
    }
    return headers;
}
