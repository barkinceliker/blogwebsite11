import Link from 'next/link';
import { Github, Linkedin } from 'lucide-react';
import { AUTHOR_NAME } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground py-8 border-t border-border/40">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-6">
          <Link href="https://github.com/barkinceliker" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out transform hover:scale-110">
            <Github className="h-7 w-7" />
          </Link>
          <Link href="https://www.linkedin.com/in/celikerbarkin/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out transform hover:scale-110">
            <Linkedin className="h-7 w-7" />
          </Link>
        </div>
        <p className="text-sm mb-1">
          &copy; {currentYear} {AUTHOR_NAME}. All Rights Reserved.
        </p>
        <p className="text-xs">
          Developed with Next.js & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
