"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, ArrowLeft, Eye } from 'lucide-react';
import { getCases } from '@/lib/actions/cases';
import { SyncButton } from '@/components/dashboard/sync-button';
import { RemoveCaseButton } from '@/components/dashboard/remove-case-button';
import { getCalendarText } from '@/lib/actions/calender';
import { useEffect, useState } from 'react';
import { Case } from '@/lib/types';
export const runtime = 'edge';
export default function MyCasesPage() {
  const [myCases, setMyCases] = useState<Case[]>([]);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    async function fetchCases() {
      const cases = await getCases();
      setMyCases(cases);
    }
    fetchCases();
  }, []);
  const handleCopyCalendarUrl = async () => {
    const url = new URL(window.location.origin);
    url.pathname = '/api/calender';
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

return (
  <div className="container mx-auto p-4">
    <div className="w-full max-w-4xl mx-auto mb-4">
      <Link href="/" passHref>
        <Button variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>

    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Briefcase /> My Cases
        </CardTitle>
        <CardDescription>
          A list of cases you have saved. Click on a case to view details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* --- Calendar Copy Button Section --- */}
        <div className="flex flex-col items-start mb-6">
          <Button variant="outline" onClick={handleCopyCalendarUrl}>
            {copied ? "Copied!" : "Copy Calendar Link"}
          </Button>
        </div>

        {/* --- Case List Section --- */}
        {myCases.length > 0 ? (
          <div className="space-y-4">
            {myCases.map((caseItem) => (
              <Card key={caseItem.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex-grow">
                    <p className="font-semibold">{caseItem.title}</p>
                    <p className="text-sm text-muted-foreground">{caseItem.cnr}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {caseItem.cnr && <SyncButton cnr={caseItem.cnr} />}
                    {caseItem.cnr && <RemoveCaseButton cnr={caseItem.cnr} />}
                    <Button asChild size="sm">
                      <Link href={`/my-cases/${caseItem.cnr}`}>
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Link>
                    </Button>
                  </div>
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
