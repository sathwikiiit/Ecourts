'use client';

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import type { Case } from '@/lib/types';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addCaseFromSearch } from '@/lib/actions/cases';
import { useRouter } from 'next/navigation';

type CaseSearchResultsProps = {
    loading: boolean;
    results: any[];
    searched: boolean;
}

function CaseDetailItem({ label, value }: { label: string, value?: string | number | null }) {
    if (!value) return null;
    return (
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold">{value}</p>
        </div>
    );
}

export default function CaseSearchResults({ loading, results, searched }: CaseSearchResultsProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleAddCase = (cnr: string, title: string) => {
    startTransition(async () => {
        const result = await addCaseFromSearch(cnr);
        if (result.success) {
            toast({
                title: "Case Added",
                description: `Case with CNR ${cnr} has been added to your cases.`,
            });
            router.push('/my-cases');
        } else {
            toast({
                title: "Error",
                description: result.message || "Failed to add case. Please try again.",
                variant: "destructive"
            });
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
                    onClick={() => caseItem.cnr && handleAddCase(caseItem.cnr, caseItem.title)}
                    disabled={isPending}
                    >
                    <PlusCircle className="h-4 w-4" />
                </Button>
            </div>
            <AccordionContent>
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/50 rounded-md">
                <CaseDetailItem label="CNR Number" value={caseItem.cnr} />
                <CaseDetailItem label="Filing Number" value={caseItem.filingNumber} />
                <CaseDetailItem label="Filing Year" value={caseItem.filingYear} />
                <CaseDetailItem label="Advocate" value={caseItem.advocateName} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
}
