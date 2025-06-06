import BlogPostForm from '@/components/admin/BlogPostForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createBlogPost } from '@/lib/actions/adminActions';
import { PlusCircle } from 'lucide-react';

export default function NewBlogPostPage() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl md:text-3xl">
          <PlusCircle className="mr-3 h-8 w-8 text-primary" /> Add New Blog Post
        </CardTitle>
        <CardDescription>Compose a new article for your blog.</CardDescription>
      </CardHeader>
      <CardContent>
        <BlogPostForm onSubmitAction={createBlogPost} isEditing={false} />
      </CardContent>
    </Card>
  );
}
