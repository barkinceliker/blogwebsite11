
import SkillForm from '@/components/admin/SkillForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSkillById, updateSkill } from '@/lib/actions/adminActions';
import { notFound } from 'next/navigation';
import { Edit } from 'lucide-react';

interface EditSkillPageProps {
  params: { id: string };
}

export default async function EditSkillPage({ params }: EditSkillPageProps) {
  const skill = await getSkillById(params.id);

  if (!skill) {
    notFound();
  }

  const handleUpdateSkill = async (formData: FormData) => {
    'use server';
    return updateSkill(params.id, formData);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl md:text-3xl">
          <Edit className="mr-3 h-8 w-8 text-primary" /> Edit Skill
        </CardTitle>
        <CardDescription>Update the details for "{skill.name}".</CardDescription>
      </CardHeader>
      <CardContent>
        <SkillForm initialData={skill} onSubmitAction={handleUpdateSkill} isEditing={true} />
      </CardContent>
    </Card>
  );
}
