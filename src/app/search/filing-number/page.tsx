'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { searchCasesByFilingNumber } from '@/lib/actions/cases';
import type { Case } from '@/lib/types';
import CaseSearchResults from '@/components/dashboard/case-search-results';

const formSchema = z.object({
  filingNumber: z.string().min(1, 'Filing number is required.'),
});

export default function SearchByFilingNumberPage() {
  const [searchResults, setSearchResults] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filingNumber: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setSearched(true);
    const results = await searchCasesByFilingNumber(values.filingNumber);
    setSearchResults(results);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Search by Filing Number</CardTitle>
          <CardDescription>Find cases by filing number.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="filingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filing Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 12345/2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </Form>
          <div className="mt-8">
            <CaseSearchResults results={searchResults} loading={loading} searched={searched} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
