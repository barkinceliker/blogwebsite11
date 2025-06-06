
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import type { UserSession } from '@/types';

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
