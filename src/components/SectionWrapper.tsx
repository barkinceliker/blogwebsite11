import type React from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionWrapper({ children, className, id }: SectionWrapperProps) {
  return (
    <section id={id} className={cn('py-12 md:py-20', className)}>
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}
