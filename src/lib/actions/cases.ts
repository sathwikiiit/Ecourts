'use server';

import type { Case } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addCase(caseData: Omit<Case, 'status'> | Case) {
    console.log('Adding case to "My Cases":', caseData);
    // In a real app, you would save this to a database.
    // For this demo, we'll just log it and simulate success.
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // After adding, we can revalidate paths to show new data if needed
    revalidatePath('/my-cases'); 
    // And redirect the user
    redirect('/my-cases');
  }
