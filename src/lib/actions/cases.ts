'use server';

import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import type { Case } from '@/lib/types';
import { db } from '@/lib/db';
import { lookupCaseByCnr } from './search';

// Helper to parse case from DB row
function parseCaseFromRow(row: any): Case {
    return {
        id: row.id.toString(),
        case_number: row.case_number,
        title: row.title,
        description: row.description,
        status: row.status,
        cnr: row.cnr,
        advocateName: row.advocate_name,
        filingNumber: row.filing_number,
        filingYear: row.filing_year,
        details: row.details ? JSON.parse(row.details) : undefined,
        statusDetails: row.status_details ? JSON.parse(row.status_details) : undefined,
        parties: row.parties ? JSON.parse(row.parties) : undefined,
        actsAndSections: row.acts_and_sections ? JSON.parse(row.acts_and_sections) : undefined,
        history: row.history ? JSON.parse(row.history) : undefined,
        orders: row.orders ? JSON.parse(row.orders) : undefined,
    };
}

export async function getCases(): Promise<Case[]> {
  noStore();
  try {
    const stmt = db.prepare('SELECT * FROM cases ORDER BY created_at DESC');
    const rows = stmt.all() as any[];
    return rows.map(parseCaseFromRow);
  } catch (error) {
    console.error("Failed to get cases:", error);
    return [];
  }
}

export async function getCaseByCnr(cnr: string): Promise<Case | null> {
    noStore();
    try {
        const stmt = db.prepare('SELECT * FROM cases WHERE cnr = ?');
        const row = stmt.get(cnr) as any;
        return row ? parseCaseFromRow(row) : null;
    } catch (error) {
        console.error(`Failed to get case with CNR ${cnr}:`, error);
        return null;
    }
}

async function upsertCase(cnr: string): Promise<{ success: boolean, message: string }> {
    const lookupResult = await lookupCaseByCnr(cnr);

    if (!lookupResult.success || !lookupResult.data) {
        return { success: false, message: lookupResult.message || `Could not find details for CNR ${cnr}.` };
    }

    const caseData = lookupResult.data;

    try {
        const stmt = db.prepare(`
            INSERT INTO cases (
                cnr, title, case_number, description, status, 
                details, status_details, parties, acts_and_sections, history, orders
            )
            VALUES (
                @cnr, @title, @case_number, @description, @status,
                @details, @status_details, @parties, @acts_and_sections, @history, @orders
            )
            ON CONFLICT(cnr) DO UPDATE SET
                title = excluded.title,
                case_number = excluded.case_number,
                description = excluded.description,
                status = excluded.status,
                details = excluded.details,
                status_details = excluded.status_details,
                parties = excluded.parties,
                acts_and_sections = excluded.acts_and_sections,
                history = excluded.history,
                orders = excluded.orders
        `);

        const info = stmt.run({
            cnr: caseData.cnr,
            title: caseData.title,
            case_number: caseData.case_number,
            description: caseData.description,
            status: caseData.status,
            details: JSON.stringify(caseData.details),
            status_details: JSON.stringify(caseData.statusDetails),
            parties: JSON.stringify(caseData.parties),
            acts_and_sections: JSON.stringify(caseData.actsAndSections),
            history: JSON.stringify(caseData.history),
            orders: JSON.stringify(caseData.orders),
        });

        revalidatePath('/my-cases');
        if (caseData.cnr) {
            revalidatePath(`/my-cases/${caseData.cnr}`);
        }
        
        const message = info.changes > 0 ? `Case ${cnr} has been successfully added or updated.` : `Case ${cnr} is already up to date.`;
        return { success: true, message };

    } catch (error) {
        console.error(`Failed to add or update case ${cnr}:`, error);
        return { success: false, message: "Failed to save case details to the database." };
    }
}

export async function addOrUpdateCase(prevState: any, formData: FormData): Promise<{ success: boolean, message: string }> {
    const cnr = formData.get('cnr') as string;
    if (!cnr) {
        return { success: false, message: 'CNR cannot be empty.' };
    }
    return upsertCase(cnr);
}

export async function syncCase(cnr: string): Promise<{ success: boolean, message: string }> {
    if (!cnr) {
        return { success: false, message: 'CNR cannot be empty.' };
    }
    return upsertCase(cnr);
}

export async function addCaseFromSearch(cnr: string): Promise<{ success: boolean, message?: string }> {
    if (!cnr) {
        return { success: false, message: 'CNR cannot be empty.' };
    }

    const existingCase = await getCaseByCnr(cnr);
    if (existingCase) {
        return { success: false, message: `Case with CNR ${cnr} already exists.` };
    }

    return upsertCase(cnr);
}
