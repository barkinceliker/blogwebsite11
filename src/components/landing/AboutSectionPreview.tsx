import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionWrapper from '@/components/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';
import Image from 'next/image';
import { ABOUT_ME_CONTENT } from '@/lib/constants';

export default function AboutSectionPreview() {
  return (
    <SectionWrapper id="about" className="bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">About Me</h2>
        <p className="text-lg text-muted-foreground mt-2">A glimpse into my background and aspirations.</p>
      </div>
      <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="md:flex">
          <div className="md:w-1/3 relative min-h-[300px] md:min-h-full">
            <Image 
              src="https://placehold.co/400x600.png" 
              alt="Barkın Çeliker"
              fill
              style={{ objectFit: "cover" }}
              data-ai-hint="student working computer"
            />
          </div>
          <div className="md:w-2/3">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl flex items-center">
                <UserCircle className="mr-3 h-8 w-8 text-primary" />
                {ABOUT_ME_CONTENT.greeting}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {ABOUT_ME_CONTENT.introduction.substring(0, 250)}...
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {ABOUT_ME_CONTENT.mission.substring(0,150)}...
              </p>
              <Button asChild variant="link" className="px-0 text-primary hover:text-primary/80">
                <Link href="/about">
                  Read More About Me &rarr;
                </Link>
              </Button>
            </CardContent>
          </div>
        </div>
      </Card>
    </SectionWrapper>
  );
}
