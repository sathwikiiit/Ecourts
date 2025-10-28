'use client';

import { useEffect, useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { removeCase } from '@/lib/actions/cases';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';

function RemoveSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <AlertDialogAction asChild>
            <Button disabled={pending} variant="destructive" type="submit">
                <Trash2 className={`mr-2 h-4 w-4 ${pending ? 'animate-spin' : ''}`} />
                Remove
            </Button>
        </AlertDialogAction>
    );
}

export function RemoveCaseButton({ cnr }: { cnr: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const initialState = { success: false, message: '' };

  const [state, dispatch] = useActionState(removeCase, initialState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Remove Successful' : 'Remove Failed',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        router.push('/my-cases');
      }
    }
  }, [state, toast, router]);

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Case
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the case
                    and remove its data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <form action={dispatch} onSubmit={() => setIsDialogOpen(false)}>
                    <input type="hidden" name="cnr" value={cnr} />
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <RemoveSubmitButton />
                </form>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}
