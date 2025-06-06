import AdminSidebar from '@/components/admin/AdminSidebar';
import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - Personal Hub',
  description: 'Manage your Personal Hub content.',
};


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
     // This should ideally be caught by middleware, but as a fallback.
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 pt-16 p-4 md:p-8">
        {children}
        <Toaster />
      </main>
    </div>
  );
}
