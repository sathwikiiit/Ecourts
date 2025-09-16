import type { Case } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { addCase } from '@/lib/actions/cases';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Loader2, Plus } from 'lucide-react';

export default function CaseSearchResults({ results, loading, searched }: { results: Case[], loading: boolean, searched: boolean }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isAdding, startAdding] = useTransition();

    const handleAddCase = (caseData: Case) => {
        startAdding(async () => {
            const result = await addCase(caseData);
            if (result.success) {
                toast({
                    title: "Case Added",
                    description: `Case "${caseData.title}" has been successfully added.`,
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
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!searched) {
    return (
        <div className="text-center p-8">
            <p className="text-muted-foreground">Search for a case to see results.</p>
        </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No cases found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div key={result.id} className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-semibold">{result.title}</p>
            <p className="text-sm text-muted-foreground">{result.description}</p>
          </div>
          <Button size="sm" onClick={() => handleAddCase(result)} disabled={isAdding}>
            {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add Case
          </Button>
        </div>
      ))}
    </div>
  );
}
