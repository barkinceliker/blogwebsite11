import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SectionWrapper from '@/components/SectionWrapper';
import { BLOG_POSTS_DATA } from '@/lib/constants';
import { ArrowRight, BookOpenText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function BlogSectionPreview() {
  const recentPosts = BLOG_POSTS_DATA.slice(0, 2);

  return (
    <SectionWrapper id="blog" className="bg-secondary">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold">Latest Insights</h2>
        <p className="text-lg text-muted-foreground mt-2">Thoughts, tutorials, and updates from my journey in data and tech.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {recentPosts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-56 w-full">
               <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                data-ai-hint={post.dataAiHint || "technology blog"}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">{post.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{post.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.slice(0,2).map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link" className="px-0 text-primary hover:text-primary/80">
                <Link href={`/blog/${post.slug}`}>
                  Read Full Post <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {BLOG_POSTS_DATA.length > 2 && (
         <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/blog">
              <BookOpenText className="mr-2 h-5 w-5" /> Visit Blog
            </Link>
          </Button>
        </div>
      )}
    </SectionWrapper>
  );
}
