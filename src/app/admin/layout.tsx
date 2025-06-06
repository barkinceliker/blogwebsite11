
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import type { UserSession } from '@/types';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Admin Panel - Personal Hub',
  description: 'Manage your Personal Hub content.',
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: UserSession | null = await getSession();

  // Although middleware should handle redirection for /admin/dashboard/*,
  // an additional check here ensures that if middleware somehow fails or is bypassed
  // for a direct layout render, we still try to protect.
  // However, for pages like /admin itself, this check might be too aggressive
  // if not handled carefully with pathname. Middleware is the primary guard.
  // For now, we rely on middleware for dashboard protection.
  // The session is primarily fetched here to pass to AdminSidebar.

  // Example of a more direct check if not relying solely on middleware for a specific page:
  // if (pathname.startsWith('/admin/dashboard') && (!session || !session.isAuthenticated)) {
  //   redirect('/admin');
  // }


  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar session={session} />
      <main className="flex-1 md:ml-64 pt-16 p-4 md:p-8">
        {children}
        <Toaster />
      </main>
    </div>
  );
}
