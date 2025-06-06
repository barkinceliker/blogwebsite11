'use client';

import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getBlogPosts, deleteBlogPost } from '@/lib/actions/adminActions';
import type { BlogPost } from '@/types';
import { PlusCircle, Edit, Trash2, FileText, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminBlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const fetchBlogPosts = () => {
    startTransition(async () => {
      setIsLoading(true);
      try {
        const data = await getBlogPosts();
        setBlogPosts(data);
      } catch (error) {
         toast({ title: "Error", description: "Failed to fetch blog posts.", variant: "destructive" });
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const result = await deleteBlogPost(id);
    if (result.success) {
      toast({ title: "Blog Post Deleted", description: "The blog post has been successfully deleted." });
      fetchBlogPosts(); 
    } else {
      toast({ title: "Error Deleting Post", description: result.error || "Failed to delete blog post.", variant: "destructive" });
    }
    setIsDeleting(null);
  };

  if (isLoading && blogPosts.length === 0) {
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
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center text-2xl md:text-3xl">
            <FileText className="mr-3 h-8 w-8 text-primary" /> Manage Blog Posts
          </CardTitle>
          <CardDescription>Create, edit, or delete your blog articles.</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={fetchBlogPosts} disabled={isPending || isLoading}>
            <RefreshCw className={`h-5 w-5 ${isPending || isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button asChild>
            <Link href="/admin/dashboard/blog/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Post
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {blogPosts.length === 0 && !isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No blog posts found.</p>
            <Button asChild>
              <Link href="/admin/dashboard/blog/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Write Your First Post
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden lg:table-cell">Tags</TableHead>
                <TableHead className="text-right w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="hidden md:table-cell">{format(new Date(post.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                      {post.tags.length > 2 && <Badge variant="outline">+{post.tags.length - 2}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="icon">
                      <Link href={`/admin/dashboard/blog/edit/${post.id}`}>
                        <Edit className="h-4 w-4" />
                         <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" disabled={isDeleting === post.id}>
                           {isDeleting === post.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                           <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the blog post "{post.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-destructive hover:bg-destructive/90">
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
