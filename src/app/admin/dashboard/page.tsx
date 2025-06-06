import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, FileText, MessageSquare, User, ArrowRight, LayoutDashboard } from "lucide-react";
import { ADMIN_NAV_LINKS, AUTHOR_NAME } from "@/lib/constants";
import { getSession } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const welcomeMessage = session ? `Hello, ${session.name || AUTHOR_NAME}!` : `Hello, ${AUTHOR_NAME}!`;
  
  const quickLinks = ADMIN_NAV_LINKS.filter(link => link.label !== "Dashboard").slice(0, 4); // Take first 4 non-dashboard links

  const iconMap: { [key: string]: React.ElementType } = {
    'About Page': User,
    Projects: Briefcase,
    'Blog Posts': FileText,
    Messages: MessageSquare,
  };

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold tracking-tight">{welcomeMessage}</h1>
        <p className="text-lg text-muted-foreground mt-1">Welcome to your Personal Hub Admin Panel. Manage your content with ease.</p>
      </header>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <LayoutDashboard className="mr-3 h-6 w-6 text-primary" />
            Quick Access
          </CardTitle>
          <CardDescription>Jump directly to key management sections.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = iconMap[link.label] || ArrowRight;
            return (
              <Link href={link.href} key={link.label} className="block group">
                <Card className="h-full hover:shadow-md hover:border-primary transition-all duration-200 flex flex-col items-center justify-center p-6 text-center">
                    <Icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-semibold mb-1">{link.label}</h3>
                    <p className="text-sm text-muted-foreground">Manage {link.label.toLowerCase()}</p>
                </Card>
              </Link>
            );
          })}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Site Overview</CardTitle>
          <CardDescription>A quick summary of your website's content.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder stats - replace with actual data fetching */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground">Total Projects</h4>
            <p className="text-3xl font-bold">3</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground">Blog Posts</h4>
            <p className="text-3xl font-bold">2</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium text-muted-foreground">Contact Messages</h4>
            <p className="text-3xl font-bold">2</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Use the sidebar to navigate to other sections for detailed management.
        </p>
      </div>
    </div>
  );
}
