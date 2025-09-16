'use server';

import type { Case } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { z } from 'zod';

const AddCaseSchema = z.object({
  cnr: z.string(),
  title: z.string(),
  details: z.object({
    type: z.string(),
    filingNumber: z.string(),
    filingDate: z.string(),
    registrationNumber: z.string(),
    registrationDate: z.string(),
  }),
  status: z.object({
    firstHearingDate: z.string(),
    nextHearingDate: z.string(),
    decisionDate: z.string().nullable(),
    natureOfDisposal: z.string(),
    caseStage: z.string(),
    courtNumberAndJudge: z.string(),
  }),
});

export async function lookupCaseByCnr(cnr: string) {
    try {
        const response = await fetch('https://court-api.kleopatra.io/api/core/live/district-court/case', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ cnr }),
        });

        if (!response.ok) {
            return { success: false, message: "Failed to lookup case." };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error: any) {
        console.error("Failed to lookup case:", error);
        return { success: false, message: error.message };
    }
}

export async function addCase(caseData: any) {
    const parsedData = AddCaseSchema.parse(caseData);

    const stmt = db.prepare(`
        INSERT INTO cases (case_number, title, description, status, cnr, advocate_name, filing_number, filing_year)
        VALUES (@case_number, @title, @description, @status, @cnr, @advocateName, @filingNumber, @filingYear)
    `);

    try {
        stmt.run({
            case_number: parsedData.details.filingNumber,
            title: parsedData.title,
            description: `Type: ${parsedData.details.type}`,
            status: parsedData.status.caseStage,
            cnr: parsedData.cnr,
            advocateName: null,
            filingNumber: parseInt(parsedData.details.filingNumber.split('/')[0]),
            filingYear: new Date(parsedData.details.filingDate).getFullYear()
        });
        revalidatePath('/my-cases');
        return { success: true, message: `Case "${parsedData.title}" has been added.` };
    } catch (error: any) {
        console.error("Failed to add case:", error);
        return { success: false, message: error.message };
    }
}

export async function getCases(): Promise<Case[]> {
    try {
        const stmt = db.prepare("SELECT id, case_number, title, description, status, cnr, advocate_name as advocateName, filing_number as filingNumber, filing_year as filingYear FROM cases ORDER BY id DESC");
        const cases = stmt.all() as Case[];
        return cases;
    } catch (error) {
        console.error("Failed to get cases:", error);
        return [];
    }
}
