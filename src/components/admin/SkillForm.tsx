
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { Skill } from '@/types';
import { Save, Loader2, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as LucideIcons from 'lucide-react';

const skillFormSchema = z.object({
  name: z.string().min(2, { message: 'Skill name must be at least 2 characters.' }),
  level: z.coerce.number().min(0, {message: 'Level must be at least 0'}).max(100, {message: 'Level must be at most 100'}),
  icon: z.string().min(1, { message: 'Icon name is required (e.g., Code, BarChart3).' })
    .refine(value => Object.keys(LucideIcons).includes(value as keyof typeof LucideIcons), {
      message: "Invalid Lucide icon name. Check available icons.",
    }),
});

type SkillFormValues = z.infer<typeof skillFormSchema>;

interface SkillFormProps {
  initialData?: Skill | null;
  onSubmitAction: (formData: FormData) => Promise<{ success: boolean; error?: string; data?: Skill }>;
  isEditing: boolean;
}

export default function SkillForm({ initialData, onSubmitAction, isEditing }: SkillFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      level: initialData?.level || 0,
      icon: initialData?.icon as string || 'Lightbulb',
    },
  });

  async function onSubmit(data: SkillFormValues) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('level', data.level.toString());
    formData.append('icon', data.icon);

    const result = await onSubmitAction(formData);

    if (result.success) {
      toast({
        title: isEditing ? 'Skill Updated' : 'Skill Created',
        description: `Skill "${result.data?.name}" has been successfully ${isEditing ? 'updated' : 'created'}.`,
      });
      router.push('/admin/dashboard/skills'); 
      router.refresh();
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Skill Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Python" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Proficiency Level (0-100)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 90" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Lucide Icon Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Code, BarChart3, Database" {...field} />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                Enter a valid icon name from <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline text-primary">lucide.dev/icons</a>.
                E.g., 'Code', 'Database', 'BarChart3'.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
          {form.formState.isSubmitting ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving...</>
          ) : (
            <><Save className="mr-2 h-5 w-5" /> {isEditing ? 'Save Changes' : 'Create Skill'}</>
          )}
        </Button>
      </form>
    </Form>
  );
}
