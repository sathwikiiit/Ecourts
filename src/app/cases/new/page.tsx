'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { lookupCaseByCnr, addCase } from '@/lib/actions/cases';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  cnr: z.string().min(16, 'CNR must be at least 16 characters.'),
});

export default function AddCasePage() {
    const [isPending, startTransition] = useTransition();
    const [isAdding, startAdding] = useTransition();
    const { toast } = useToast();
    const router = useRouter();
    

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cnr: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
        const result = await lookupCaseByCnr(values.cnr);
        if (result.success) {
            startAdding(async () => {
                const addResult = await addCase(result.data);
                if (addResult.success) {
                    toast({
                        title: "Case Added",
                        description: `Case "${result.data.title}" has been successfully added.`,
                    });
                    router.push('/my-cases');
                } else {
                    toast({
                        title: "Error",
                        description: addResult.message || "Failed to add case. Please try again.",
                        variant: "destructive"
                    });
                }
            });
        } else {
            toast({
                title: "Error",
                description: result.message || "Failed to lookup case. Please try again.",
                variant: "destructive"
            });
        }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Case by CNR</CardTitle>
          <CardDescription>Enter the CNR to look up and add a new case.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cnr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNR</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TSME000000592019" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Link href="/" passHref>
                    <Button type="button" variant="outline" disabled={isPending || isAdding}>
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" disabled={isPending || isAdding}>
                  {(isPending || isAdding) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? 'Looking up case...' : isAdding ? 'Adding case...' : 'Add Case'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
