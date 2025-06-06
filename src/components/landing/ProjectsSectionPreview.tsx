
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionWrapper from '@/components/SectionWrapper';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types';

interface ProjectsSectionPreviewProps {
  projects: Project[];
}

export default function ProjectsSectionPreview({ projects }: ProjectsSectionPreviewProps) {
  const featuredProjects = projects.slice(0, 3);

  return (
    <SectionWrapper id="projects" className="bg-gradient-to-b from-background via-card to-background">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Featured Projects</h2>
        <p className="text-lg text-muted-foreground mt-2">A selection of my recent work in data analysis and beyond.</p>
      </div>
      {featuredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <Card key={project.id} className="group flex flex-col overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] border-border hover:border-primary/50">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-110"
                  data-ai-hint={project.dataAiHint || "technology project"}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">{project.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{project.description.substring(0, 100)}...</CardDescription>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.slice(0,3).map(tag => <Badge key={tag} variant="secondary" className="group-hover:bg-accent/20 group-hover:border-accent/50 transition-colors">{tag}</Badge>)}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="px-0 text-accent hover:text-primary group-hover:underline">
                  <Link href={`/projects#${project.id}`}>
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
         <div className="text-center py-8">
          <p className="text-muted-foreground">No featured projects yet. Add some from the admin panel!</p>
        </div>
      )}
      {projects.length > 3 && (
        <div className="text-center mt-12">
          <Button asChild size="lg" className="hover:scale-105 transition-transform">
            <Link href="/projects">
              <Briefcase className="mr-2 h-5 w-5" /> See All Projects
            </Link>
          </Button>
        </div>
      )}
       {projects.length === 0 && featuredProjects.length === 0 && (
         <div className="text-center py-8">
          <p className="text-xl text-muted-foreground">No projects available. Add some from the admin panel!</p>
        </div>
      )}
    </SectionWrapper>
  );
}
