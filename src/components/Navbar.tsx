
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, CodeXml } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NAV_LINKS, AUTHOR_NAME } from '@/lib/constants';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentHash, setCurrentHash] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Set initial hash

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const getIsActive = (linkHref: string) => {
    if (!mounted) return false; // Avoid SSR issues with window.location

    if (linkHref === "/") { // Home link
      return pathname === "/" && currentHash === "";
    } else if (linkHref.startsWith("/#")) { // Section link like /#about
      return pathname === "/" && currentHash === linkHref.substring(1);
    } else { // Page link like /admin
      return pathname === linkHref && (currentHash === "" || currentHash === `#${linkHref.split('/').pop()}`);
    }
  };
  
  if (!mounted) {
    // Render a simplified version or null during SSR to avoid hydration mismatch
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
           <Link href="/" className="flex items-center space-x-2 text-2xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
            <CodeXml className="h-8 w-8" />
            <span>{AUTHOR_NAME.split(' ')[0]}</span>
          </Link>
          <div className="flex items-center space-x-2">
            {/* Placeholder for theme toggle and menu button to avoid layout shift */}
            <div className="h-10 w-10" /> 
            <div className="md:hidden h-10 w-10" />
          </div>
        </div>
      </header>
    );
  }


  const siteLogo = (
    <Link href="/" className="flex items-center space-x-2 text-2xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
      <CodeXml className="h-8 w-8" />
      <span>{AUTHOR_NAME.split(' ')[0]}</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {siteLogo}
        <nav className="hidden md:flex items-center space-x-6">
          {NAV_LINKS.map((link) => {
            const isActive = getIsActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary font-semibold' : 'text-foreground/70'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background p-6">
                <div className="flex flex-col space-y-6">
                  <div className="flex justify-between items-center">
                    {siteLogo}
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon" aria-label="Close menu">
                          <X className="h-6 w-6" />
                       </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex flex-col space-y-4">
                    {NAV_LINKS.map((link) => {
                      const isActive = getIsActive(link.href);
                      return(
                        <SheetClose key={link.label} asChild>
                          <Link
                            href={link.href}
                            className={`text-lg font-medium transition-colors hover:text-primary ${
                              isActive ? 'text-primary font-semibold' : 'text-foreground/80'
                            }`}
                            // onClick={() => setIsMobileMenuOpen(false)} // Removed this line
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
