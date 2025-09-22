import { getRequestContext } from "@cloudflare/next-on-pages";

export const API_BASE_URL = 'https://court-api.kleopatra.io/api/core';

export const getAuthHeaders = () => {
    //@ts-expect-error -- IGNORE ---
    const API_KEY = getRequestContext().env.COURT_API_KEY;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
    }
    return headers;
}
