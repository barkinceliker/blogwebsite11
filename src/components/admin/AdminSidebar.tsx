'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ADMIN_NAV_LINKS, AUTHOR_NAME } from '@/lib/constants';
import { CodeXml, LayoutDashboard, FileText, Briefcase, MessageSquare, User, Settings, LogOut, Award, ShieldCheck, FileArchive } from 'lucide-react';
import { handleLogout } from '@/lib/actions/adminActions';
import type { UserSession } from '@/types';

const iconMap: { [key: string]: React.ElementType } = {
  Dashboard: LayoutDashboard,
  'About Page': User,
  Projects: Briefcase,
  'Blog Posts': FileText,
  Messages: MessageSquare,
  Skills: Award,
  CV: FileArchive, // Changed to FileArchive to match /admin/dashboard/cv page icon
  Settings: Settings,
};

interface AdminSidebarProps {
  session: UserSession | null;
}

export default function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();

  const onLogout = async () => {
    await handleLogout();
     // Force a full page reload to ensure layout picks up logged out state
    window.location.href = '/admin';
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform -translate-x-full md:translate-x-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border" aria-label="Sidebar">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <Link href={session?.isAuthenticated ? "/admin/dashboard" : "/admin"} className="flex items-center space-x-2 text-xl font-headline font-semibold text-sidebar-primary-foreground">
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
              {/* <form action={onLogout}> - Using onClick for window.location.href */}
                <Button onClick={onLogout} variant="ghost" className="w-full justify-start text-base">
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              {/* </form> */}
            </div>
          </>
        ) : (
          <div className="flex-grow">
            {/* Optional: You can place a message here if the user is not authenticated */}
            {/* e.g., <p className="p-4 text-sm text-sidebar-foreground/70">Please log in to view admin options.</p> */}
          </div>
        )}
      </div>
    </aside>
  );
}
