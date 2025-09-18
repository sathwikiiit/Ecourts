'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addOrUpdateCase } from '@/lib/actions/cases';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Add or Sync Case
    </Button>
  );
}

export default function AddNewCasePage() {
  const { toast } = useToast();
  const router = useRouter();
  const initialState = { success: false, message: '' };
  const [state, dispatch] = useActionState(addOrUpdateCase, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        router.push('/my-cases');
      }
    }
  }, [state, toast, router]);

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-2xl mx-auto mb-4">
        <Link href="/my-cases" passHref>
            <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Cases
            </Button>
        </Link>
      </div>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Case</CardTitle>
          <CardDescription>Enter a CNR to add a new case or sync an existing one.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cnr">CNR Number</Label>
              <Input 
                id="cnr" 
                name="cnr"
                placeholder="Enter CNR..." 
                required
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}