'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getContactMessages } from '@/lib/actions/adminActions';
import type { ContactMessage } from '@/types';
import { MessageSquare, RefreshCw, Inbox } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchMessages = () => {
    startTransition(async () => {
      setIsLoading(true);
      try {
        const data = await getContactMessages();
        setMessages(data.sort((a,b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()));
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch messages.", variant: "destructive" });
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchMessages();
  }, []);
  
  if (isLoading && messages.length === 0) {
     return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }


  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center text-2xl md:text-3xl">
            <MessageSquare className="mr-3 h-8 w-8 text-primary" /> Contact Messages
          </CardTitle>
          <CardDescription>View messages submitted through your contact form.</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchMessages} disabled={isPending || isLoading}>
            <RefreshCw className={`h-5 w-5 ${isPending || isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {messages.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <Inbox className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No messages yet.</p>
            <p className="text-sm text-muted-foreground">When visitors send messages, they will appear here.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {messages.map((msg, index) => (
              <AccordionItem value={`item-${index}`} key={msg.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-base">{msg.name}</p>
                      <p className="text-sm text-muted-foreground">{msg.email}</p>
                    </div>
                    <Badge variant="outline" className="hidden sm:inline-block">
                      {formatDistanceToNow(new Date(msg.receivedAt), { addSuffix: true })}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted/30 rounded-b-md">
                  <p className="text-sm text-muted-foreground sm:hidden mb-2">
                    Received: {formatDistanceToNow(new Date(msg.receivedAt), { addSuffix: true })}
                  </p>
                  <p className="whitespace-pre-wrap text-foreground/90">{msg.message}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
