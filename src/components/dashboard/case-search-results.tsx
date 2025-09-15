'use client';

import { useState } from 'react';
import { Clock, Loader2, MapPin, CalendarPlus, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { getCaseHearings } from '@/lib/actions/hearings';
import type { Case, Hearing } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { format } from 'date-fns';
import SyncDialog from './sync-dialog';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addCase } from '@/lib/actions/cases';

type CaseSearchResultsProps = {
    loading: boolean;
    results: any[];
    searched: boolean;
}

export default function CaseSearchResults({ loading, results, searched }: CaseSearchResultsProps) {
  const [hearings, setHearings] = useState<Record<string, Hearing[]>>({});
  const [hearingsLoading, setHearingsLoading] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAccordionChange = async (caseId: string) => {
    if (!caseId) return;
    if (!hearings[caseId]) {
      setHearingsLoading((prev) => ({ ...prev, [caseId]: true }));
      const caseHearings = await getCaseHearings(caseId);
      setHearings((prev) => ({ ...prev, [caseId]: caseHearings }));
      setHearingsLoading((prev) => ({ ...prev, [caseId]: false }));
    }
  };

  const handleAddCase = (caseItem: Case) => {
    startTransition(async () => {
        try {
            await addCase(caseItem);
            toast({
                title: "Case Added",
                description: `Case "${caseItem.title}" has been added to your cases.`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add case. Please try again.",
                variant: "destructive"
            })
        }
    });
  }

  if (loading) {
    return (
        <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    );
  }

  if (searched && results.length === 0) {
    return (
        <p className="text-center text-sm text-muted-foreground pt-4">No cases found.</p>
    );
  }

    const caseResults = results as Case[];
    return (
        <Accordion type="single" collapsible className="w-full" onValueChange={handleAccordionChange}>
        {caseResults.map((caseItem) => (
          <AccordionItem value={String(caseItem.id)} key={caseItem.id}>
            <AccordionTrigger className="hover:no-underline">
                <div className="text-left flex-1">
                    <p className="font-semibold truncate">{caseItem.title}</p>
                    <p className="text-sm text-muted-foreground">{caseItem.case_number}</p>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="mr-2 shrink-0" 
                    onClick={(e) => { e.stopPropagation(); handleAddCase(caseItem); }}
                    disabled={isPending}
                    >
                    <PlusCircle className="h-4 w-4" />
                </Button>
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
                !hearingsLoading[caseItem.id] && <p className="text-sm text-muted-foreground p-4">No upcoming hearings found for this case.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  

  return null;
}


function HearingItem({ hearing }: { hearing: Hearing }) {
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
