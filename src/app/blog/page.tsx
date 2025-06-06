
import Link from 'next/link';
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getBlogPosts } from '@/lib/actions/adminActions';
import type { BlogPost } from '@/types';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

export default async function BlogPage() {
  const blogPostsData: BlogPost[] = await getBlogPosts();

  return (
    <SectionWrapper id="blog" className="bg-gradient-to-b from-background via-card to-background">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">My Blog</h1>
        <p className="text-xl text-muted-foreground mt-3">
          Sharing insights, tutorials, and reflections on data, technology, and personal growth.
        </p>
      </header>

      {blogPostsData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPostsData.map((post) => (
            <Card key={post.id} className="group flex flex-col overflow-hidden shadow-xl hover:shadow-primary/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.03] rounded-lg border-border hover:border-primary/50">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={post.dataAiHint || "blog article image"}
                  />
                </div>
              </Link>
              <CardHeader className="pb-2">
                <Link href={`/blog/${post.slug}`} className="block">
                  <CardTitle className="text-2xl font-semibold text-primary group-hover:text-accent transition-colors">{post.title}</CardTitle>
                </Link>
                <CardDescription className="text-sm text-muted-foreground flex items-center pt-1">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {post.date ? format(new Date(post.date), 'MMMM d, yyyy') : 'Date not available'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="text-base leading-relaxed text-foreground/80">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm border-primary/30 text-primary/80 group-hover:bg-accent/20 group-hover:border-accent/50 group-hover:text-accent transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button asChild variant="link" className="px-0 text-accent hover:text-primary group-hover:underline">
                  <Link href={`/blog/${post.slug}`}>
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No blog posts yet. Stay tuned for updates!</p>
        </div>
      )}
    </SectionWrapper>
  );
}
