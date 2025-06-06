
'use client';

import ProjectForm from '@/components/admin/ProjectForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjectById, updateProject } from '@/lib/actions/adminActions';
import { notFound } from 'next/navigation';
import { Edit } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Project } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';


export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

interface EditProjectPageProps {
  params: { id: string };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        setIsLoading(true);
        const fetchedProject = await getProjectById(params.id);
        if (!fetchedProject) {
          notFound(); // This will trigger the not-found page
          return;
        }
        setProject(fetchedProject);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        setError("Failed to load project data.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [params.id]);

  const handleUpdateProject = async (formData: FormData) => {
    // updateProject is already a server action, so it can be called directly
    // from a client component.
    return updateProject(params.id, formData);
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-1/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    // Handle error state, e.g., show an error message
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center text-2xl md:text-3xl text-destructive">
                    <Edit className="mr-3 h-8 w-8" /> Error Loading Project
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
            </CardContent>
        </Card>
    );
  }
  
  if (!project) {
    // Should be caught by notFound() earlier, but as a fallback
    return <p>Project not found.</p>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl md:text-3xl">
          <Edit className="mr-3 h-8 w-8 text-primary" /> Edit Project
        </CardTitle>
        <CardDescription>Update the details for "{project.title}".</CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectForm initialData={project} onSubmitAction={handleUpdateProject} isEditing={true} />
      </CardContent>
    </Card>
  );
}
