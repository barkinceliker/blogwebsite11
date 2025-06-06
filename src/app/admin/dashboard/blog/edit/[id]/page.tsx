import BlogPostForm from '@/components/admin/BlogPostForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogPostById, updateBlogPost } from '@/lib/actions/adminActions';
import { notFound } from 'next/navigation';
import { Edit } from 'lucide-react';

interface EditBlogPostPageProps {
  params: { id: string };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const blogPost = await getBlogPostById(params.id);

  if (!blogPost) {
    notFound();
  }
  
  const handleUpdateBlogPost = async (formData: FormData) => {
    'use server';
    return updateBlogPost(params.id, formData);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl md:text-3xl">
          <Edit className="mr-3 h-8 w-8 text-primary" /> Edit Blog Post
        </CardTitle>
        <CardDescription>Update the content for "{blogPost.title}".</CardDescription>
      </CardHeader>
      <CardContent>
        <BlogPostForm initialData={blogPost} onSubmitAction={handleUpdateBlogPost} isEditing={true} />
      </CardContent>
    </Card>
  );
}
