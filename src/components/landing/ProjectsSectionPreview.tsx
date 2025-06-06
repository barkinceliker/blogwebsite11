import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionWrapper from '@/components/SectionWrapper';
import { PROJECTS_DATA } from '@/lib/constants';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProjectsSectionPreview() {
  const featuredProjects = PROJECTS_DATA.slice(0, 3);

  return (
    <SectionWrapper id="projects" className="bg-secondary">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">Featured Projects</h2>
        <p className="text-lg text-muted-foreground mt-2">A selection of my recent work in data analysis and beyond.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredProjects.map((project) => (
          <Card key={project.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-56 w-full">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                sizes="100vw"
                style={{ objectFit: 'cover' }}
                data-ai-hint={project.dataAiHint || "technology project"}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{project.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{project.description.substring(0, 100)}...</CardDescription>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.slice(0,3).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link" className="px-0 text-primary hover:text-primary/80">
                <Link href={`/projects#${project.id}`}>
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {PROJECTS_DATA.length > 3 && (
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/projects">
              <Briefcase className="mr-2 h-5 w-5" /> See All Projects
            </Link>
          </Button>
        </div>
      )}
    </SectionWrapper>
  );
}
