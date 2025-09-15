'use server';

import type { Case } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { z } from 'zod';

const AddCaseSchema = z.object({
  id: z.string().optional(),
  case_number: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['Open', 'Closed', 'Pending']),
  cnr: z.string().optional().nullable(),
  advocateName: z.string().optional().nullable(),
  filingNumber: z.string().optional().nullable(),
  filingYear: z.string().optional().nullable(),
});

export async function addCase(caseData: Omit<Case, 'id'>) {
    const parsedData = AddCaseSchema.parse(caseData);

    const stmt = db.prepare(`
        INSERT INTO cases (case_number, title, description, status, cnr, advocate_name, filing_number, filing_year)
        VALUES (@case_number, @title, @description, @status, @cnr, @advocateName, @filingNumber, @filingYear)
    `);

    try {
        stmt.run({
            case_number: parsedData.case_number,
            title: parsedData.title,
            description: parsedData.description || '',
            status: parsedData.status,
            cnr: parsedData.cnr,
            advocateName: parsedData.advocateName,
            filingNumber: parsedData.filingNumber,
            filingYear: parsedData.filingYear
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
