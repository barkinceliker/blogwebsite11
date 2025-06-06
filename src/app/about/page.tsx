
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Target, Brain, Briefcase, GraduationCap } from 'lucide-react';
import { getAboutMeContent, getSkills } from '@/lib/actions/adminActions';
import type { AboutMeContent, Skill } from '@/types';
import { Progress } from '@/components/ui/progress';
import * as LucideIcons from 'lucide-react';

export default async function AboutPage() {
  const aboutMeData: AboutMeContent = await getAboutMeContent();
  const skillsData: Skill[] = await getSkills();

  return (
    <SectionWrapper id="about" className="bg-gradient-to-b from-background via-secondary to-background">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">{aboutMeData.greeting}</h1>
          <p className="text-xl text-muted-foreground">
            Delving deeper into my journey, skills, and passion for data-driven solutions.
          </p>
        </header>

        <Card className="mb-12 shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 relative min-h-[300px] md:min-h-0">
              <Image
                src="https://placehold.co/400x500.png"
                alt={aboutMeData.greeting}
                fill
                sizes="(max-width: 767px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
                data-ai-hint="person coding analysis"
                className="transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="md:w-2/3 p-6 md:p-8">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl md:text-3xl font-headline">My Story</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4 text-foreground/90 leading-relaxed">
                <p>{aboutMeData.introduction}</p>
                <div className="mt-6 p-6 bg-primary/10 rounded-lg border border-primary/30">
                  <h3 className="text-xl font-semibold text-primary mb-2 flex items-center">
                    <Target className="mr-2 h-6 w-6" /> My Mission
                  </h3>
                  <p className="text-primary/90">{aboutMeData.mission}</p>
                </div>
                 <div className="mt-6 p-6 bg-accent/10 rounded-lg border border-accent/30">
                  <h3 className="text-xl font-semibold text-accent-foreground mb-2 flex items-center">
                    <GraduationCap className="mr-2 h-6 w-6" /> Education
                  </h3>
                  <p className="text-accent-foreground/90">3rd Year Student, Management Information Systems (YBS) at Yaşar University.</p>
                </div>
              </CardContent>
            </div>
          </div>
        </Card>

        <Card id="skills" className="mb-12 shadow-xl scroll-mt-20">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-headline flex items-center">
              <Brain className="mr-3 h-7 w-7 text-primary" /> Core Competencies
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skillsData.map((skill) => {
              const IconComponent = LucideIcons[skill.icon as keyof typeof LucideIcons] || Zap;
              return (
                <div key={skill.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-foreground">{skill.name}</h4>
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <Progress value={skill.level} aria-label={`${skill.name} proficiency`} className="h-2.5" />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{skill.level}% Proficient</p>
                </div>
              );
            })}
            {skillsData.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">No skills listed yet. Add them in the admin panel!</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl font-headline flex items-center">
              <Briefcase className="mr-3 h-7 w-7 text-primary" /> Professional Aspirations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-foreground/90 leading-relaxed">
            <p>{aboutMeData.skillsSummary}</p>
            <p>
              I am actively seeking opportunities to apply my analytical skills in internships or entry-level positions
              where I can contribute to impactful projects and continue my growth as a data professional.
              I am particularly interested in roles related to data analysis, business intelligence, and data science.
            </p>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}
