'use server';

import type { District, Complex } from '@/lib/types';
import { unstable_noStore as noStore } from 'next/cache';
import { API_BASE_URL, getAuthHeaders, API_KEY } from './utils';
import { districts as staticDistricts, complexes as staticComplexes } from '@/app/data';

export async function getDistricts(): Promise<District[]> {
    noStore();
    if (!API_KEY) return staticDistricts; // Fallback to static data
    try {
        const response = await fetch(`${API_BASE_URL}/static/district-court/districts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ all: true }),
        });
        if (!response.ok) {
            console.error('Failed to fetch districts, falling back to static data', response.status, await response.text());
            return staticDistricts;
        }
        const data = await response.json();
        return data.districts || staticDistricts;
    } catch (error) {
        console.error('Error fetching districts:', error);
        return staticDistricts;
    }
}

export async function getComplexes(): Promise<Complex[]> {
    noStore();
    if (!API_KEY) return staticComplexes; // Fallback to static data
    try {
        const response = await fetch(`${API_BASE_URL}/static/district-court/complexes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ all: true }),
        });
        if (!response.ok) {
            console.error('Failed to fetch complexes, falling back to static data', response.status, await response.text());
            return staticComplexes;
        }
        const data = await response.json();
        return data.complexes || staticComplexes;
    } catch (error) {
        console.error('Error fetching complexes:', error);
        return staticComplexes;
    }
}
