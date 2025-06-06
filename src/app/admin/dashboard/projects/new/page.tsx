import ProjectForm from '@/components/admin/ProjectForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createProject } from '@/lib/actions/adminActions';
import { PlusCircle } from 'lucide-react';

export default function NewProjectPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl md:text-3xl">
          <PlusCircle className="mr-3 h-8 w-8 text-primary" /> Add New Project
        </CardTitle>
        <CardDescription>Fill in the details to add a new project to your portfolio.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectForm onSubmitAction={createProject} isEditing={false} />
      </CardContent>
    </Card>
  );
}
