'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center p-8 bg-background">
      <AlertCircle className="h-20 w-20 text-destructive mb-8" />
      <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Something Went Wrong</h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-lg">
        We're sorry, but an unexpected error occurred. Please try again, or contact support if the problem persists.
      </p>
      {error?.message && (
         <p className="text-sm text-destructive/80 bg-destructive/10 p-3 rounded-md mb-6 max-w-lg">
            Error details: {error.message}
         </p>
      )}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        size="lg"
        variant="destructive"
        className="shadow-md"
      >
        <RotateCcw className="mr-2 h-5 w-5" />
        Try Again
      </Button>
    </div>
  );
}
