'use client';
import SectionWrapper from '@/components/SectionWrapper';
import { Progress } from '@/components/ui/progress';
import { SKILLS_DATA } from '@/lib/constants';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function SkillsSection() {
  return (
    <SectionWrapper id="skills" className="bg-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">My Expertise</h2>
        <p className="text-lg text-muted-foreground mt-2">Key skills I bring to the table in data analysis and technology.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SKILLS_DATA.map((skill) => {
          const IconComponent = LucideIcons[skill.icon as keyof typeof LucideIcons] || Lightbulb;
          return (
            <Card key={skill.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{skill.name}</CardTitle>
                <IconComponent className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{skill.level}%</div>
                <Progress value={skill.level} className="w-full mt-2 h-3" aria-label={`${skill.name} proficiency ${skill.level}%`} />
                <p className="text-xs text-muted-foreground mt-1">Proficiency Level</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
