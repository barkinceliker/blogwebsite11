import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center p-8 bg-background">
      <AlertTriangle className="h-24 w-24 text-primary mb-8 animate-pulse" />
      <h1 className="text-5xl md:text-7xl font-headline font-bold mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground/80">Page Not Found</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
      </p>
      <Button asChild size="lg" className="shadow-md">
        <Link href="/">
          <Home className="mr-2 h-5 w-5" />
          Go Back Home
        </Link>
      </Button>
    </div>
  );
}
