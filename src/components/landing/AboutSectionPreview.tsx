
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SectionWrapper from '@/components/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';
import Image from 'next/image';
import { getAboutMeContent } from '@/lib/actions/adminActions';
import type { AboutMeContent } from '@/types';

export default async function AboutSectionPreview() {
  const aboutMeData: AboutMeContent = await getAboutMeContent();

  return (
    <SectionWrapper id="about" className="bg-gradient-to-b from-card via-background to-card">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">About Me</h2>
        <p className="text-lg text-muted-foreground mt-2">A glimpse into my background and aspirations.</p>
      </div>
      <Card className="group overflow-hidden shadow-xl hover:shadow-primary/30 transition-all duration-300 ease-in-out border-border hover:border-primary/50 transform hover:-translate-y-1">
        <div className="md:flex">
          <div className="md:w-1/3 relative min-h-[300px] md:min-h-full overflow-hidden">
            <Image 
              src="https://placehold.co/400x600.png" 
              alt={aboutMeData.greeting || "Barkın Çeliker"}
              fill
              sizes="(max-width: 767px) 100vw, 33vw"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-500 group-hover:scale-110"
              data-ai-hint="student working computer"
            />
          </div>
          <div className="md:w-2/3">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl flex items-center text-primary group-hover:text-accent transition-colors">
                <UserCircle className="mr-3 h-8 w-8" />
                {aboutMeData.greeting}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {aboutMeData.introduction.substring(0, 250)}...
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {aboutMeData.mission.substring(0,150)}...
              </p>
              <Button asChild variant="link" className="px-0 text-accent hover:text-primary group-hover:underline">
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
