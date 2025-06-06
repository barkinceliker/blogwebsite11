
import Link from 'next/link';
import Image from 'next/image';
import SectionWrapper from '@/components/SectionWrapper';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BLOG_POSTS_DATA } from '@/lib/constants';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPage() {
  return (
    <SectionWrapper id="blog" className="bg-gradient-to-b from-background via-secondary to-background">
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">My Blog</h1>
        <p className="text-xl text-muted-foreground mt-3">
          Sharing insights, tutorials, and reflections on data, technology, and personal growth.
        </p>
      </header>

      {BLOG_POSTS_DATA.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS_DATA.map((post) => (
            <Card key={post.id} className="flex flex-col overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={post.dataAiHint || "blog article image"}
                  />
                </div>
              </Link>
              <CardHeader className="pb-2">
                <Link href={`/blog/${post.slug}`} className="block">
                  <CardTitle className="text-2xl font-semibold hover:text-primary transition-colors">{post.title}</CardTitle>
                </Link>
                <CardDescription className="text-sm text-muted-foreground flex items-center pt-1">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <p className="text-base leading-relaxed text-foreground/80">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button asChild variant="link" className="px-0 text-primary hover:text-primary/80">
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
