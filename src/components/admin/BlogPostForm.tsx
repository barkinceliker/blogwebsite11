'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { BlogPost } from '@/types';
import { Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const blogPostFormSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters.' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens.'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  excerpt: z.string().min(20, { message: 'Excerpt must be at least 20 characters.' }),
  content: z.string().min(50, { message: 'Content must be at least 50 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  tags: z.string().optional(), // Comma-separated
});

type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;

interface BlogPostFormProps {
  initialData?: BlogPost | null;
  onSubmitAction: (formData: FormData) => Promise<{ success: boolean; error?: string; data?: BlogPost }>;
  isEditing: boolean;
}

export default function BlogPostForm({ initialData, onSubmitAction, isEditing }: BlogPostFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      date: initialData?.date ? format(new Date(initialData.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      imageUrl: initialData?.imageUrl || 'https://placehold.co/600x400.png',
      tags: initialData?.tags?.join(', ') || '',
    },
  });

  async function onSubmit(data: BlogPostFormValues) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('slug', data.slug);
    formData.append('date', new Date(data.date).toISOString()); 
    formData.append('excerpt', data.excerpt);
    formData.append('content', data.content);
    formData.append('imageUrl', data.imageUrl || 'https://placehold.co/600x400.png');
    formData.append('tags', data.tags || '');

    const result = await onSubmitAction(formData);

    if (result.success) {
      toast({
        title: isEditing ? 'Post Updated' : 'Post Created',
        description: `Blog post "${result.data?.title}" has been successfully ${isEditing ? 'updated' : 'created'}.`,
      });
      router.push('/admin/dashboard/blog');
      router.refresh();
    } else {
      toast({
        title: isEditing ? 'Update Failed' : 'Creation Failed',
        description: result.error || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  }
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    if (!form.formState.dirtyFields.slug) { 
        const slug = title
            .toLowerCase()
            .replace(/\s+/g, '-') 
            .replace(/[^\w-]+/g, ''); 
        form.setValue('slug', slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog post title" {...field} onChange={handleTitleChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Slug</FormLabel>
              <FormControl>
                <Input placeholder="e.g., my-awesome-post" {...field} />
              </FormControl>
               <p className="text-sm text-muted-foreground">URL-friendly version of the title (auto-generated or custom).</p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Publication Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Excerpt</FormLabel>
              <FormControl>
                <Textarea placeholder="A short summary of the post..." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Content (HTML supported)</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your blog post content here. You can use HTML tags for formatting." className="min-h-[250px]" {...field} />
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
              <FormLabel className="text-lg">Featured Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/featured-image.png" {...field} />
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
                <Input placeholder="e.g., Data, Tech, Tutorial" {...field} />
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
            <><Save className="mr-2 h-5 w-5" /> {isEditing ? 'Save Changes' : 'Create Post'}</>
          )}
        </Button>
      </form>
    </Form>
  );
}
