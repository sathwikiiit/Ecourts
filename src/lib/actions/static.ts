'use server';

import type { District, Complex, State } from '@/lib/types';
import { API_BASE_URL, getAuthHeaders} from './utils';

export async function getStates(): Promise<State[]> {
    if (!getAuthHeaders().Authorization) return [];
    try {
        const response = await fetch(`${API_BASE_URL}/static/district-court/states`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            console.error('Failed to fetch states, falling back to empty array', response.status, await response.text());
            return [];
        }
        const data: { states: State[] } = await response.json();
        return data.states || [];
    } catch (error) {
        console.error('Error fetching states:', error);
        return [];
    }
}


export async function getDistricts(stateId?: string): Promise<District[]> {
    if (!getAuthHeaders().Authorization || !stateId) return [];
    try {
        const body: { all?: boolean, stateId?: string } = stateId ? { stateId } : { all: true };
        const response = await fetch(`${API_BASE_URL}/static/district-court/districts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            console.error('Failed to fetch districts, falling back to empty array', response.status, await response.text());
            return [];
        }
        const data: { districts: District[] } = await response.json();
        return data.districts || [];
    } catch (error) {
        console.error('Error fetching districts:', error);
        return [];
    }
}

export async function getComplexes(districtId?: string): Promise<Complex[]> {
    if (!getAuthHeaders().Authorization || !districtId) return [];
    try {
        const body: { all?: boolean, districtId?: string } = districtId ? { districtId } : { all: true };
        const response = await fetch(`${API_BASE_URL}/static/district-court/complexes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            console.error('Failed to fetch complexes, falling back to empty array', response.status, await response.text());
            return [];
        }
        const data: { complexes: Complex[] } = await response.json();
        return data.complexes || [];
    } catch (error) {
        console.error('Error fetching complexes:', error);
        return [];
    }
}
