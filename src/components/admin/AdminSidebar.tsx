'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Added useRouter
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ADMIN_NAV_LINKS, AUTHOR_NAME } from '@/lib/constants';
import { CodeXml, LayoutDashboard, FileText, Briefcase, MessageSquare, User, Settings, LogOut, Award, FileArchive } from 'lucide-react';
import { handleLogout } from '@/lib/actions/adminActions';
import type { UserSession } from '@/types';

const iconMap: { [key: string]: React.ElementType } = {
  Dashboard: LayoutDashboard,
  'About Page': User,
  Projects: Briefcase,
  'Blog Posts': FileText,
  Messages: MessageSquare,
  Skills: Award,
  CV: FileArchive,
  Settings: Settings,
};

interface AdminSidebarProps {
  session: UserSession | null;
}

export default function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  const onLogout = async () => {
    await handleLogout();
    // The handleLogout server action itself calls redirect('/admin').
    // Forcing a full reload on the client ensures all state is cleared and
    // the /admin page (login form) is freshly rendered without stale session data.
    window.location.href = '/admin';
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform -translate-x-full md:translate-x-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border" aria-label="Sidebar">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <Link 
            href={session?.isAuthenticated ? "/admin/dashboard" : "/admin"} 
            className="flex items-center space-x-2 text-xl font-headline font-semibold text-sidebar-primary-foreground"
          >
            <CodeXml className="h-7 w-7 text-sidebar-primary" />
            <span>{AUTHOR_NAME.split(' ')[0]} Admin</span>
          </Link>
        </div>

        {session?.isAuthenticated ? (
          <>
            <ScrollArea className="flex-grow p-4">
              <nav className="space-y-2">
                {ADMIN_NAV_LINKS.map((link) => {
                  const Icon = iconMap[link.label] || LayoutDashboard;
                  return (
                    <Button
                      key={link.label}
                      asChild
                      variant={pathname === link.href || (link.href !== '/admin/dashboard' && pathname.startsWith(link.href)) ? 'secondary': 'ghost'}
                      className="w-full justify-start text-base"
                    >
                      <Link href={link.href}>
                        <Icon className="mr-3 h-5 w-5" />
                        {link.label}
                      </Link>
                    </Button>
                  );
                })}
              </nav>
            </ScrollArea>
            <div className="p-4 mt-auto border-t border-sidebar-border">
              <Button onClick={onLogout} variant="ghost" className="w-full justify-start text-base">
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-grow p-4">
             <p className="text-sm text-sidebar-foreground/70">Please log in to access admin features.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
