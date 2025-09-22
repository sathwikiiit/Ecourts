import { getRequestContext } from "@cloudflare/next-on-pages";

export const API_BASE_URL = 'https://court-api.kleopatra.io/api/core';

interface Env {
    COURT_API_KEY: string;
}

export const getAuthHeaders = () => {
    const { COURT_API_KEY: API_KEY } = getRequestContext().env as Env;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
    }
    return headers;
}
