'use server';

import type { Case } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addCase(formData: Omit<Case, 'id'>) {
    console.log('Adding new case:', formData);
    // In a real app, you would post this to an API endpoint.
    // For this demo, we'll just log it and simulate success.
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // After adding, we can revalidate paths to show new data if needed
    revalidatePath('/'); 
    // And redirect the user
    redirect('/');
  }
