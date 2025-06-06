
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionWrapper from '@/components/SectionWrapper';
import { ArrowRight, BookOpenText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { BlogPost } from '@/types';

interface BlogSectionPreviewProps {
  posts: BlogPost[];
}

export default function BlogSectionPreview({ posts }: BlogSectionPreviewProps) {
  const recentPosts = posts.slice(0, 2);

  return (
    <SectionWrapper id="blog" className="bg-gradient-to-b from-card via-background to-card">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">Latest Insights</h2>
        <p className="text-lg text-muted-foreground mt-2">Thoughts, tutorials, and updates from my journey in data and tech.</p>
      </div>
      {recentPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {recentPosts.map((post) => (
            <Card key={post.id} className="group flex flex-col overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] border-border hover:border-primary/50">
              <div className="relative h-56 w-full overflow-hidden">
                 <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-110"
                  data-ai-hint={post.dataAiHint || "technology blog"}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">{post.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {post.date ? format(new Date(post.date), 'MMMM d, yyyy') : 'Date not available'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{post.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.slice(0,2).map(tag => <Badge key={tag} variant="outline" className="border-primary/30 text-primary/80 group-hover:bg-accent/20 group-hover:border-accent/50 group-hover:text-accent transition-colors">{tag}</Badge>)}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="link" className="px-0 text-accent hover:text-primary group-hover:underline">
                  <Link href={`/blog/${post.slug}`}>
                    Read Full Post <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No recent blog posts. Add some from the admin panel!</p>
        </div>
      )}
      {posts.length > 2 && (
         <div className="text-center mt-12">
          <Button asChild size="lg" className="hover:scale-105 transition-transform">
            <Link href="/blog">
              <BookOpenText className="mr-2 h-5 w-5" /> Visit Blog
            </Link>
          </Button>
        </div>
      )}
      {posts.length === 0 && recentPosts.length === 0 && (
         <div className="text-center py-8">
          <p className="text-xl text-muted-foreground">No blog posts available. Add some from the admin panel!</p>
        </div>
      )}
    </SectionWrapper>
  );
}
