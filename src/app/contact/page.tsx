'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import SectionWrapper from '@/components/SectionWrapper';
import { useToast } from '@/hooks/use-toast';
import { submitContactForm } from '@/lib/actions/adminActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, MapPin, Phone, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(data: ContactFormValues) {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('message', data.message);

      const result = await submitContactForm(formData);

      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: "Thanks for reaching out. I'll get back to you soon.",
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to send message. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <SectionWrapper className="bg-gradient-to-b from-background via-secondary to-background">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Contact Me</h1>
        <p className="text-xl text-muted-foreground mt-3">
          I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Send className="mr-3 h-6 w-6 text-primary" />
              Send a Direct Message
            </CardTitle>
            <CardDescription>Use the form to send me an email. I'll respond as soon as I can.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Type your message here..." className="min-h-[150px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Mail className="mr-3 h-6 w-6 text-primary" />
              Other Ways to Connect
            </CardTitle>
            <CardDescription>You can also find me on these platforms or reach out via email/phone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
              <Mail className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <a href="mailto:barkin.celiker@example.com" className="text-accent hover:underline">
                  barkin.celiker@example.com {/* Replace with actual email */}
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
              <Phone className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold">Phone</h4>
                <span className="text-muted-foreground">+90 (555) 123 4567</span> {/* Replace with actual phone */}
              </div>
            </div>
             <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
              <MapPin className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold">Location</h4>
                <span className="text-muted-foreground">İzmir, Turkey</span>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
              <Linkedin className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold">LinkedIn</h4>
                <Link href="https://linkedin.com/in/barkinceliker" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  linkedin.com/in/barkinceliker
                </Link>
              </div>
            </div>
            <div className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
              <Github className="h-6 w-6 text-primary mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold">GitHub</h4>
                <Link href="https://github.com/barkinceliker" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  github.com/barkinceliker
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
