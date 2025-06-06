
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { handleLogin, handleLogout } from '@/lib/actions/adminActions';
import { useToast } from '@/hooks/use-toast';
import { LogIn, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { UserSession } from '@/types';

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface AdminLoginFormProps {
  currentSession: UserSession | null;
}

export default function AdminLoginForm({ currentSession }: AdminLoginFormProps) {
  const { toast } = useToast();
  const router = useRouter(); 
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormValues) {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    // `handleLogin` is a server action. If it throws an error (e.g. due to redirect),
    // it will be caught here. If it returns, it means login failed.
    try {
      const result = await handleLogin(formData);

      // This part should only be reached if handleLogin doesn't redirect (i.e., login failed)
      if (result && !result.success) {
        toast({
          title: 'Login Failed',
          description: result.error || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      }
      // If handleLogin is successful, it will redirect, and this client-side code
      // for success handling (toast) won't be reached because the page will navigate away.
      // The success toast might need to be handled differently if we want it after a server-side redirect.
      // For now, a successful redirect is the primary indicator.
    } catch (error: any) {
      // This catch block will handle errors thrown by `redirect()` from the server action.
      // Next.js throws a specific error for `redirect` which is not a "real" error
      // but a signal for navigation. We typically don't need to do anything here
      // unless we want to specifically handle `NEXT_REDIRECT` errors, which is rare.
      // console.log("Caught error in onSubmit (potentially redirect):", error);
      if (error.digest?.startsWith('NEXT_REDIRECT')) {
        // This is an expected error when redirecting from a server action.
        // No user-facing toast is needed here as the redirect is happening.
      } else {
        // For other types of errors during the server action call:
        toast({
          title: 'Login Attempt Failed',
          description: error.message || 'An unexpected error occurred during the login process.',
          variant: 'destructive',
        });
      }
    }
  }

  const onLogout = async () => {
    await handleLogout(); // Server action will redirect
  };

  if (currentSession?.isAuthenticated) {
    return (
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline flex items-center justify-center">
            <LogIn className="mr-3 h-8 w-8 text-primary" />
            Admin Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-lg">
            You are logged in as <span className="font-semibold text-primary">{currentSession.name}</span>.
          </p>
          <Button onClick={onLogout} className="w-full" variant="outline">
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
          <Button onClick={() => router.push('/admin/dashboard')} className="w-full">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline flex items-center justify-center">
          <LogIn className="mr-3 h-8 w-8 text-primary" />
          Admin Panel
        </CardTitle>
        <CardDescription>
          Please log in to manage site content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Logging In...' : 'Log In'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
