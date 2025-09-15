'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { addCase } from '@/lib/actions/cases';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  case_number: z.string().min(1, 'Case number is required.'),
  description: z.string().optional(),
  status: z.enum(['Open', 'Closed', 'Pending']),
});

export default function AddCasePage() {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      case_number: '',
      description: '',
      status: 'Open',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
        const result = await addCase(values);
        if (result.success) {
            toast({
                title: "Case Created",
                description: `Case "${values.title}" has been successfully created.`,
            });
            router.push('/my-cases');
        } else {
            toast({
                title: "Error",
                description: result.message || "Failed to create case. Please try again.",
                variant: "destructive"
            });
        }
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Add New Case</CardTitle>
          <CardDescription>Fill out the details below to create a new case.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Case Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., State v. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="case_number"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Case Number</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., CV-2023-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select case status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Open">Open</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide a brief description of the case..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Link href="/" passHref>
                    <Button type="button" variant="outline" disabled={isPending}>
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Case
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
