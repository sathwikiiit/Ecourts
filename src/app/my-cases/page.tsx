'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Loader2 } from 'lucide-react';
import { getCases, lookupCaseByCnr } from '@/lib/actions/cases';
import { useEffect, useState } from 'react';
import type { Case } from '@/lib/types';

export default function MyCasesPage() {
  const [myCases, setMyCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCases() {
      const savedCases = await getCases();
      const updatedCases = await Promise.all(
        savedCases.map(async (caseItem) => {
          if (caseItem.cnr) {
            const result = await lookupCaseByCnr(caseItem.cnr);
            if (result.success) {
              return { ...caseItem, ...result.data, status: result.data.status.caseStage, case_number: result.data.details.filingNumber };
            }
          }
          return caseItem;
        })
      );
      setMyCases(updatedCases);
      setLoading(false);
    }

    fetchCases();
  }, []);

  return (
    <div className="flex justify-center items-start min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Briefcase /> My Cases
          </CardTitle>
          <CardDescription>A list of cases you have saved.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">Loading cases...</p>
            </div>
          ) : myCases.length > 0 ? (
            <div className="space-y-4">
              {myCases.map((caseItem) => (
                <Card key={caseItem.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{caseItem.title}</p>
                      <p className="text-sm text-muted-foreground">{caseItem.case_number}</p>
                    </div>
                    <span className="text-sm font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{caseItem.status}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
                <p className="text-muted-foreground">You have not added any cases yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
