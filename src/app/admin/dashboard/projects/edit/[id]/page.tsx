import ProjectForm from '@/components/admin/ProjectForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getProjectById, updateProject } from '@/lib/actions/adminActions';
import { notFound } from 'next/navigation';
import { Edit } from 'lucide-react';

interface EditProjectPageProps {
  params: { id: string };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  // Curry updateProject to match the expected signature for ProjectForm
  const handleUpdateProject = async (formData: FormData) => {
    return updateProject(params.id, formData);
  };

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
