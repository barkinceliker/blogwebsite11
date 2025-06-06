'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getAboutMeContent, updateAboutMeContent } from '@/lib/actions/adminActions';
import type { AboutMeContent } from '@/types';
import { useEffect, useState } from 'react';
import { Save, UserCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const aboutFormSchema = z.object({
  greeting: z.string().min(5, { message: 'Greeting must be at least 5 characters.' }),
  introduction: z.string().min(50, { message: 'Introduction must be at least 50 characters.' }),
  mission: z.string().min(30, { message: 'Mission statement must be at least 30 characters.' }),
  skillsSummary: z.string().min(30, {message: 'Skills summary must be at least 30 characters.'}),
});

type AboutFormValues = z.infer<typeof aboutFormSchema>;

export default function AdminAboutPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState<AboutMeContent | null>(null);

  const form = useForm<AboutFormValues>({
    resolver: zodResolver(aboutFormSchema),
    defaultValues: {
      greeting: '',
      introduction: '',
      mission: '',
      skillsSummary: '',
    },
  });

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await getAboutMeContent();
        setInitialData(data);
        form.reset(data); // Populate form with fetched data
      } catch (error) {
        toast({
          title: 'Error fetching data',
          description: 'Could not load About Me content.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }
    fetchData();
  }, [form, toast]);

  async function onSubmit(data: AboutFormValues) {
    const formData = new FormData();
    formData.append('greeting', data.greeting);
    formData.append('introduction', data.introduction);
    formData.append('mission', data.mission);
    formData.append('skillsSummary', data.skillsSummary);

    const result = await updateAboutMeContent(formData);

    if (result.success) {
      toast({
        title: 'Content Updated',
        description: 'Your "About Me" section has been successfully updated.',
      });
      setInitialData(result.data || null); // Update initialData to reflect changes
    } else {
      toast({
        title: 'Update Failed',
        description: result.error || 'Could not update content. Please try again.',
        variant: 'destructive',
      });
    }
  }

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl md:text-3xl">
            <UserCircle className="mr-3 h-8 w-8 text-primary" />
            Edit "About Me" Page
        </CardTitle>
        <CardDescription>Update the content for your public "About Me" page.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="greeting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Greeting</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Hello, I'm [Your Name]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="introduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Introduction</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell a bit about yourself, your studies, and passions..." className="min-h-[150px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Mission / Goals</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What are your professional goals or mission?" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skillsSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Skills Summary / Aspirations</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Briefly summarize your key skills or professional aspirations." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
               {form.formState.isSubmitting ? 'Saving...' : <><Save className="mr-2 h-5 w-5" /> Save Changes</>}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
