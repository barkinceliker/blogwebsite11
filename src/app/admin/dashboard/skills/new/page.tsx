
import SkillForm from '@/components/admin/SkillForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createSkill } from '@/lib/actions/adminActions';
import { PlusCircle } from 'lucide-react';

export default function NewSkillPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl md:text-3xl">
          <PlusCircle className="mr-3 h-8 w-8 text-primary" /> Add New Skill
        </CardTitle>
        <CardDescription>Fill in the details to add a new skill to your list.</CardDescription>
      </CardHeader>
      <CardContent>
        <SkillForm onSubmitAction={createSkill} isEditing={false} />
      </CardContent>
    </Card>
  );
}
