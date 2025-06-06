
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getProjects } from '@/lib/actions/adminActions';
import type { Project } from '@/types';
import { ArrowRight, ExternalLink } from 'lucide-react';

export default async function ProjectsPage() {
  const projectsData: Project[] = await getProjects();

  return (
    <SectionWrapper id="projects" className="bg-gradient-to-b from-background via-secondary to-background">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">My Projects</h1>
        <p className="text-xl text-muted-foreground mt-3">
          A collection of my work, showcasing practical applications of data analysis, web development, and more.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsData.map((project) => (
          <Card key={project.id} id={project.id} className="flex flex-col overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg scroll-mt-20 group">
            <div className="relative h-60 w-full">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={project.dataAiHint || "project screenshot"}
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-semibold">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
              <CardDescription className="text-base leading-relaxed text-foreground/80">{project.description}</CardDescription>
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm font-medium">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              {/* Placeholder for live demo or source code links */}
              <Button variant="outline" size="sm" className="mr-2" disabled>
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
              </Button>
              <Button variant="ghost" size="sm" disabled>
                 Source Code <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {projectsData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No projects to display at the moment. Check back soon!</p>
        </div>
      )}
    </SectionWrapper>
  );
}
