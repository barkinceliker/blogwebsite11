
import AdminSidebar from '@/components/admin/AdminSidebar';
// import { isAuthenticated } from '@/lib/auth'; // Yönlendirme için kaldırıldı
// import { redirect } from 'next/navigation'; // Yönlendirme için kaldırıldı
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - Personal Hub',
  description: 'Manage your Personal Hub content.',
};

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Giriş yapmamış kullanıcıyı login sayfasına yönlendirme mantığı kaldırıldı.
  // if (!(await isAuthenticated())) {
  //   redirect('/admin');
  // }

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
