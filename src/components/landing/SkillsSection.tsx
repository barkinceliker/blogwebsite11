
'use client';
import type React from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import { Progress } from '@/components/ui/progress';
import type { Skill } from '@/types'; 
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <SectionWrapper id="skills" className="bg-gradient-to-b from-background via-card to-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">My Expertise</h2>
        <p className="text-lg text-muted-foreground mt-2">Key skills I bring to the table in data analysis and technology.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skills.map((skill) => {
          const IconComponent = LucideIcons[skill.icon as keyof typeof LucideIcons] || Lightbulb;
          return (
            <Card key={skill.id} className="group shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 border-border hover:border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-foreground/90 group-hover:text-primary transition-colors">{skill.name}</CardTitle>
                <IconComponent className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary group-hover:text-accent transition-colors">{skill.level}%</div>
                <Progress value={skill.level} className="w-full mt-2 h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-accent" aria-label={`${skill.name} proficiency ${skill.level}%`} />
                <p className="text-xs text-muted-foreground mt-1">Proficiency Level</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
       {skills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No skills to display at the moment. Add some from the admin panel!</p>
        </div>
      )}
    </SectionWrapper>
  );
}
