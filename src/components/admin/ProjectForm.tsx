'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { Project } from '@/types';
import { Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const projectFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL for the image.' }).optional().or(z.literal('')),
  tags: z.string().optional(), // Comma-separated
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  initialData?: Project | null;
  onSubmitAction: (formData: FormData) => Promise<{ success: boolean; error?: string; data?: Project }>;
  isEditing: boolean;
}

export default function ProjectForm({ initialData, onSubmitAction, isEditing }: ProjectFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || 'https://placehold.co/600x400.png',
      tags: initialData?.tags?.join(', ') || '',
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('imageUrl', data.imageUrl || 'https://placehold.co/600x400.png');
    formData.append('tags', data.tags || '');

    const result = await onSubmitAction(formData);

    if (result.success) {
      toast({
        title: isEditing ? 'Project Updated' : 'Project Created',
        description: `Project "${result.data?.title}" has been successfully ${isEditing ? 'updated' : 'created'}.`,
      });
      router.push('/admin/dashboard/projects'); // Redirect to projects list
      router.refresh(); // Ensures the list is updated
    } else {
      toast({
        title: isEditing ? 'Update Failed' : 'Creation Failed',
        description: result.error || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Project Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your project..." className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Data Analysis, Python, Web Dev" {...field} />
              </FormControl>
              <p className="text-sm text-muted-foreground">Enter tags separated by commas.</p>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
          {form.formState.isSubmitting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
          ) : (
            <><Save className="mr-2 h-5 w-5" /> {isEditing ? 'Save Changes' : 'Create Project'}</>
          )}
        </Button>
      </form>
    </Form>
  );
}
