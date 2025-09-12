'use client';

import { useState } from 'react';
import { Briefcase, Clock, Loader2, MapPin, Search, CalendarPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { getCaseHearings, searchCases } from '@/app/actions';
import type { Case, Hearing } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { format } from 'date-fns';
import SyncDialog from './sync-dialog';

export default function CaseSearch() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<Case[]>([]);
  const [hearings, setHearings] = useState<Record<number, Hearing[]>>({});
  const [loading, setLoading] = useState(false);
  const [hearingsLoading, setHearingsLoading] = useState<Record<number, boolean>>({});

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;
    setLoading(true);
    setResults([]);
    setHearings({});
    const searchResults = await searchCases(keyword);
    setResults(searchResults);
    setLoading(false);
  };

  const handleAccordionChange = async (caseId: string) => {
    const id = parseInt(caseId, 10);
    if (!hearings[id]) {
      setHearingsLoading((prev) => ({ ...prev, [id]: true }));
      const caseHearings = await getCaseHearings(id);
      setHearings((prev) => ({ ...prev, [id]: caseHearings }));
      setHearingsLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="p-2 space-y-4">
      <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="Search by keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="bg-card"
        />
        <Button type="submit" size="icon" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : <Search />}
        </Button>
      </form>

      {loading && (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {results.length > 0 && (
        <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
          {results.map((caseItem) => (
            <AccordionItem value={String(caseItem.id)} key={caseItem.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  <p className="font-semibold truncate">{caseItem.title}</p>
                  <p className="text-sm text-muted-foreground">{caseItem.case_number}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {hearingsLoading[caseItem.id] && <p className="text-sm text-muted-foreground p-4">Loading hearings...</p>}
                {hearings[caseItem.id] && hearings[caseItem.id].length > 0 ? (
                  <div className="space-y-2">
                    {hearings[caseItem.id].map((hearing) => (
                      <HearingItem key={hearing.id} hearing={{...hearing, case_title: caseItem.title, case_number: caseItem.case_number }} />
                    ))}
                  </div>
                ) : (
                  !hearingsLoading[caseItem.id] && <p className="text-sm text-muted-foreground p-4">No hearings found for this case.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {!loading && results.length === 0 && keyword && (
        <p className="text-center text-sm text-muted-foreground pt-4">No cases found.</p>
      )}
    </div>
  );
}


function HearingItem({ hearing }: { hearing: Hearing }) {
    const [isSyncing, setIsSyncing] = useState(false);
  
    return (
      <Card className="bg-card/50">
        <CardContent className="p-3">
            <p className="font-semibold text-sm">{hearing.type}</p>
            <div className="text-sm text-muted-foreground space-y-1 mt-1">
                <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{format(new Date(`${hearing.date}T${hearing.time}`), 'PPpp')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{hearing.location}</span>
                </div>
            </div>
            <SyncDialog hearing={hearing}>
                <Button variant="ghost" size="sm" className="w-full justify-start mt-2 h-8 px-2">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Sync to Calendar
                </Button>
            </SyncDialog>
        </CardContent>
      </Card>
    );
  }
