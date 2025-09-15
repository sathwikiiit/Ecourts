'use server';

import type { District, Complex, State } from '@/lib/types';
import { API_BASE_URL, getAuthHeaders, API_KEY } from './utils';
import { districts as staticDistricts, complexes as staticComplexes, states as staticStates } from '@/app/data';

export async function getStates(): Promise<State[]> {
    if (!API_KEY) return staticStates;
    try {
        const response = await fetch(`${API_BASE_URL}/static/district-court/states`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            console.error('Failed to fetch states, falling back to static data', response.status, await response.text());
            return staticStates;
        }
        const data = await response.json();
        return data.states || staticStates;
    } catch (error) {
        console.error('Error fetching states:', error);
        return staticStates;
    }
}


export async function getDistricts(stateId?: string): Promise<District[]> {
    if (!API_KEY) return staticDistricts.filter(d => !stateId || d.stateId === stateId);
    try {
        const body: { all?: boolean, stateId?: string } = stateId ? { stateId } : { all: true };
        const response = await fetch(`${API_BASE_URL}/static/district-court/districts`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            console.error('Failed to fetch districts, falling back to static data', response.status, await response.text());
            return staticDistricts.filter(d => !stateId || d.stateId === stateId);
        }
        const data = await response.json();
        return data.districts || staticDistricts.filter(d => !stateId || d.stateId === stateId);
    } catch (error) {
        console.error('Error fetching districts:', error);
        return staticDistricts.filter(d => !stateId || d.stateId === stateId);
    }
}

export async function getComplexes(districtId?: string): Promise<Complex[]> {
    if (!API_KEY) return staticComplexes.filter(c => !districtId || c.districtId === districtId);
    try {
        const body: { all?: boolean, districtId?: string } = districtId ? { districtId } : { all: true };
        const response = await fetch(`${API_BASE_URL}/static/district-court/complexes`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            console.error('Failed to fetch complexes, falling back to static data', response.status, await response.text());
            return staticComplexes.filter(c => !districtId || c.districtId === districtId);
        }
        const data = await response.json();
        return data.complexes || staticComplexes.filter(c => !districtId || c.districtId === districtId);
    } catch (error) {
        console.error('Error fetching complexes:', error);
        return staticComplexes.filter(c => !districtId || c.districtId === districtId);
    }
}
