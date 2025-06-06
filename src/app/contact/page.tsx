
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
import { Mail, Send, MapPin, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'İsim en az 2 karakter olmalıdır.' }),
  email: z.string().email({ message: 'Lütfen geçerli bir e-posta adresi girin.' }),
  message: z.string().min(10, { message: 'Mesaj en az 10 karakter olmalıdır.' }),
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
          title: 'Mesaj Gönderildi!',
          description: "Benimle iletişime geçtiğiniz için teşekkürler. En kısa sürede geri dönüş yapacağım.",
        });
        form.reset();
      } else {
        toast({
          title: 'Hata',
          description: result.error || 'Mesaj gönderilemedi. Lütfen tekrar deneyin.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    }
  }

  return (
    <SectionWrapper id="contact" className="bg-gradient-to-b from-background via-secondary to-background py-16 md:py-24">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">İletişime Geçin</h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Yeni projeler, yaratıcı fikirler veya vizyonlarınızın bir parçası olma fırsatlarını görüşmeye her zaman açığım.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-xl rounded-xl overflow-hidden border-border/50">
          <CardHeader className="bg-muted/30 p-6">
            <CardTitle className="flex items-center text-2xl font-semibold">
              <Send className="mr-3 h-7 w-7 text-primary" />
              Doğrudan Mesaj Gönderin
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">Formu kullanarak bana e-posta gönderebilirsiniz. En kısa sürede yanıt vereceğim.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Adınız Soyadınız</FormLabel>
                      <FormControl>
                        <Input placeholder="Adınız Soyadınız" {...field} className="text-base"/>
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
                      <FormLabel className="font-medium">E-posta Adresiniz</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="eposta@adresiniz.com" {...field} className="text-base"/>
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
                      <FormLabel className="font-medium">Mesajınız</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Mesajınızı buraya yazın..." className="min-h-[150px] text-base" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-lg py-3" size="lg" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Gönderiliyor...' : <>Mesajı Gönder <Send className="ml-2 h-5 w-5"/></>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="shadow-xl rounded-xl overflow-hidden border-border/50">
          <CardHeader className="bg-muted/30 p-6">
            <CardTitle className="flex items-center text-2xl font-semibold">
              <Mail className="mr-3 h-7 w-7 text-primary" />
              Diğer Bağlantılarım
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">Bana bu platformlardan da ulaşabilirsiniz.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            
             <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg hover:shadow-md transition-shadow">
              <MapPin className="h-8 w-8 text-primary shrink-0" />
              <div>
                <h4 className="font-semibold text-lg">Konum</h4>
                <span className="text-muted-foreground text-base">İzmir, Türkiye</span>
              </div>
            </div>
            
            <Link href="https://www.linkedin.com/in/celikerbarkin/" target="_blank" rel="noopener noreferrer" className="block p-4 bg-muted/50 rounded-lg hover:shadow-md transition-shadow group">
              <div className="flex items-center space-x-4">
                <Linkedin className="h-8 w-8 text-primary shrink-0 group-hover:text-accent transition-colors" />
                <div>
                  <h4 className="font-semibold text-lg">LinkedIn</h4>
                  <p className="text-accent group-hover:underline text-base">
                    linkedin.com/in/celikerbarkin
                  </p>
                </div>
              </div>
            </Link>
            
            <Link href="https://github.com/barkinceliker" target="_blank" rel="noopener noreferrer" className="block p-4 bg-muted/50 rounded-lg hover:shadow-md transition-shadow group">
               <div className="flex items-center space-x-4">
                <Github className="h-8 w-8 text-primary shrink-0 group-hover:text-accent transition-colors" />
                <div>
                  <h4 className="font-semibold text-lg">GitHub</h4>
                  <p className="text-accent group-hover:underline text-base">
                    github.com/barkinceliker
                  </p>
                </div>
              </div>
            </Link>

          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
