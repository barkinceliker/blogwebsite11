import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';
import { ABOUT_ME_CONTENT } from '@/lib/constants';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-background to-secondary py-20 md:py-32">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl lg:text-6xl font-headline font-bold tracking-tight">
            {ABOUT_ME_CONTENT.greeting}
          </h1>
          <p className="text-lg text-foreground/80 md:text-xl">
            A passionate Management Information Systems student at Yaşar University, specializing in Data Analysis and Business Intelligence. Welcome to my personal hub!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/projects">
                View My Projects <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/contact">
                Get In Touch <Download className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative h-80 md:h-[450px] rounded-xl overflow-hidden shadow-2xl">
           <Image
            src="https://placehold.co/600x400.png"
            alt="Barkın Çeliker - Data Analyst"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
            data-ai-hint="professional portrait technology"
            className="transform hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
}
