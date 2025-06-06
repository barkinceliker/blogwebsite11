import type React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionWrapper({ children, className, id }: SectionWrapperProps) {
  return (
    <section 
      id={id} 
      className={cn(
        'py-12 md:py-20', 
        // Apply a subtle gradient background to sections, ensuring it doesn't clash with card backgrounds
        // Example: from a darker version of background to a slightly lighter one or a hint of primary
        // This needs careful tuning with the new black/gold theme.
        // For a black and gold theme, sections might just be solid dark, with elements having gold.
        // Or a very subtle dark gradient.
        'bg-background', // Keep sections mostly solid for now to avoid complexity with card themes
        className
      )}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}
