
import AdminLoginForm from '@/components/admin/AdminLoginForm';
// import { isAuthenticated } from '@/lib/auth'; // Yönlendirme için kaldırıldı
// import { redirect } from 'next/navigation'; // Yönlendirme için kaldırıldı

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering due to cookie usage

export default async function AdminLoginPage() {
  // Giriş yapmış kullanıcıyı dashboard'a yönlendirme mantığı kaldırıldı.
  // if (await isAuthenticated()) {
  //   redirect('/admin/dashboard');
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <AdminLoginForm />
    </div>
  );
}
