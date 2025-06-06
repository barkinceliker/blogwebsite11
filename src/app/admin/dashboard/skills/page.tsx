
'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { getSkills, deleteSkill } from '@/lib/actions/adminActions';
import type { Skill } from '@/types';
import { PlusCircle, Edit, Trash2, Award, RefreshCw } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const fetchSkills = () => {
    startTransition(async () => {
      setIsLoading(true);
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch skills.", variant: "destructive" });
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const result = await deleteSkill(id);
    if (result.success) {
      toast({ title: "Skill Deleted", description: "The skill has been successfully deleted." });
      fetchSkills(); 
    } else {
      toast({ title: "Error Deleting Skill", description: result.error || "Failed to delete skill.", variant: "destructive" });
    }
    setIsDeleting(null);
  };

  if (isLoading && skills.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-2 border rounded-md">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const IconComponent = ({ iconName }: { iconName: Skill['icon'] }) => {
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Star;
    return <Icon className="h-5 w-5 text-primary" />;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center text-2xl md:text-3xl">
            <Award className="mr-3 h-8 w-8 text-primary" /> Manage Skills
          </CardTitle>
          <CardDescription>Add, edit, or delete your skills.</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={fetchSkills} disabled={isPending || isLoading}>
            <RefreshCw className={`h-5 w-5 ${isPending || isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button asChild>
            <Link href="/admin/dashboard/skills/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Skill
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {skills.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No skills found.</p>
            <Button asChild>
              <Link href="/admin/dashboard/skills/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Your First Skill
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell>
                    <IconComponent iconName={skill.icon} />
                  </TableCell>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Progress value={skill.level} className="w-32 h-2.5 mr-2" />
                      <span>{skill.level}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/admin/dashboard/skills/edit/${skill.id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={isDeleting === skill.id}>
                           {isDeleting === skill.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                           <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the skill "{skill.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(skill.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
