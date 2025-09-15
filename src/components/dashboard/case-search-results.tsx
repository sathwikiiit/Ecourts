'use client';

import { Loader2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import type { Case } from '@/lib/types';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addCase } from '@/lib/actions/cases';

type CaseSearchResultsProps = {
    loading: boolean;
    results: any[];
    searched: boolean;
}

export default function CaseSearchResults({ loading, results, searched }: CaseSearchResultsProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
        <Accordion type="single" collapsible className="w-full">
        {caseResults.map((caseItem) => (
          <AccordionItem value={String(caseItem.id)} key={caseItem.id}>
            <div className="flex items-center w-full py-2">
                <AccordionTrigger className="flex-1 py-2 hover:no-underline">
                    <div className="text-left flex-1 pr-4">
                        <p className="font-semibold truncate">{caseItem.title}</p>
                        <p className="text-sm text-muted-foreground">{caseItem.case_number}</p>
                    </div>
                </AccordionTrigger>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="mr-2 shrink-0" 
                    onClick={() => handleAddCase(caseItem)}
                    disabled={isPending}
                    >
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </div>
            <AccordionContent>
              <p className="text-sm text-muted-foreground p-4">Case details will appear here.</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
}