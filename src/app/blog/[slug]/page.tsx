
import Image from 'next/image';
import { notFound } from 'next/navigation';
import SectionWrapper from '@/components/SectionWrapper';
import { Badge } from '@/components/ui/badge';
import { getBlogPosts, getBlogPostBySlug } from '@/lib/actions/adminActions';
import type { BlogPost } from '@/types';
import { AUTHOR_NAME } from '@/lib/constants';
import { CalendarDays, UserCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = true; 

export async function generateStaticParams() {
  const posts = await getBlogPosts(); // Fetch from Firestore
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug); // Fetch from Firestore
  if (!post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${post.title} | Blog - ${AUTHOR_NAME}`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug); // Fetch from Firestore

  if (!post) {
    notFound();
  }

  return (
    <SectionWrapper className="bg-background py-8 md:py-16">
      <div className="max-w-3xl mx-auto">
        <article className="bg-card p-6 sm:p-8 md:p-10 rounded-xl shadow-xl">
          <div className="mb-8">
            <Button variant="outline" size="sm" asChild className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground space-x-4 mb-4">
              <div className="flex items-center">
                <CalendarDays className="mr-2 h-4 w-4" />
                <span>{post.date ? format(new Date(post.date), 'MMMM d, yyyy') : 'Date N/A'}</span>
              </div>
              <div className="flex items-center">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>By {AUTHOR_NAME}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

          {post.imageUrl && (
            <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8 shadow-md">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                style={{ objectFit: 'cover' }}
                priority
                data-ai-hint={post.dataAiHint || "blog header image"}
              />
            </div>
          )}
          
          <Separator className="my-8" />

          <div
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-headline prose-headings:text-primary prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-foreground/90"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </SectionWrapper>
  );
}
