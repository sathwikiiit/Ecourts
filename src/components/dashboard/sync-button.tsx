'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { syncCase } from '@/lib/actions/cases';
import { useToast } from '@/hooks/use-toast';
import { RotateCw } from 'lucide-react';

function SyncSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button disabled={pending} size="sm" variant="outline" type="submit">
            <RotateCw className={`mr-2 h-4 w-4 ${pending ? 'animate-spin' : ''}`} />
            Sync
        </Button>
    );
}

export function SyncButton({ cnr }: { cnr: string }) {
  const { toast } = useToast();
  const initialState = { success: false, message: '' };
  const [state, dispatch] = useActionState(syncCase, initialState);

  useEffect(() => {
    // We only want to show a toast if a message is returned.
    // This prevents a toast from showing on initial render.
    if (state.message) {
      toast({
        title: state.success ? 'Sync Successful' : 'Sync Failed',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={dispatch}>
        <input type="hidden" name="cnr" value={cnr} />
        <SyncSubmitButton />
    </form>
  );
}