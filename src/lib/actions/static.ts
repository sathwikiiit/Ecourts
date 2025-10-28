'use server';

import type { State, District, Complex } from '@/lib/types';
import { getAuthHeaders } from './utils';
import { API_BASE_URL } from '../constants';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getDb, Env } from '../db';

async function fetchFromAPI<T>(endpoint: string, method: 'GET' | 'POST', body?: any): Promise<T | null> {
    if (!getAuthHeaders().Authorization) return null;

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: getAuthHeaders(),
            body: method === 'POST' ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            console.error(`❌ API ${endpoint} failed`, response.status, await response.text());
            return null;
        }

        return (await response.json()) as T;
    } catch (err) {
        console.error(`❌ API error (${endpoint}):`, err);
        return null;
    }
}

// ---------- STATES ----------
export async function getStates(): Promise<State[]> {
    try {
        const db = getDb(getRequestContext().env as Env);
        const dbStates = await db.prepare('SELECT * FROM states').all<State>();
        console.log(dbStates);
        if (dbStates.results.length > 0) return dbStates.results;

        const data = await fetchFromAPI<{ states: State[] }>('/static/district-court/states', 'GET');
        if (!data?.states?.length) return [];

        // Insert fetched states into DB
        console.log(data)
        const insert = db.prepare('INSERT INTO states (id, name) VALUES (?1, ?2)');
        for (const s of data.states) {
            await insert.bind(s.id, s.name).run();
        }

        return data.states;
    } catch (err) {
        console.error('Error in getStates:', err);
        return [];
    }
}

// ---------- DISTRICTS ----------
export async function getDistricts(stateId?: string): Promise<District[]> {
    if (!stateId) return [];

    try {
        const db = getDb(getRequestContext().env as Env);
        const dbDistricts = await db.prepare('SELECT * FROM districts WHERE stateId = ?1').bind(stateId).all<District>();
        if (dbDistricts.results.length > 0) return dbDistricts.results;

        const data = await fetchFromAPI<{ districts: District[] }>('/static/district-court/districts', 'POST', { stateId: stateId });
        if (!data?.districts?.length) return [];
        const insert = db.prepare('INSERT INTO districts (id, name, stateId) VALUES (?1, ?2, ?3)');
        for (const d of data.districts) {
            await insert.bind(d.id, d.name, stateId).run();
        }

        return data.districts;
    } catch (err) {
        console.error('Error in getDistricts:', err);
        return [];
    }
}

// ---------- COMPLEXES ----------
export async function getComplexes(districtId?: string): Promise<Complex[]> {
    if (!districtId) return [];

    try {
        const db = getDb(getRequestContext().env as Env);
        const dbComplexes = await db.prepare('SELECT * FROM complexes WHERE districtId = ?1').bind(districtId).all<Complex>();
        if (dbComplexes.results.length > 0) return dbComplexes.results;

        const data = await fetchFromAPI<{ complexes: Complex[] }>('/static/district-court/complexes', 'POST', { districtId });
        if (!data?.complexes?.length) return [];

        const insert = db.prepare('INSERT INTO complexes (id, name, districtId) VALUES (?1, ?2, ?3)');
        for (const c of data.complexes) {
            await insert.bind(c.id, c.name, districtId).run();
        }

        return data.complexes;
    } catch (err) {
        console.error('Error in getComplexes:', err);
        return [];
    }
}
