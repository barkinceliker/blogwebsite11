
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { isAuthenticated } from '@/lib/auth'; // Authentication check re-added
import { redirect } from 'next/navigation'; // Redirect re-added

export const dynamic = 'force-dynamic'; // Ensures dynamic rendering due to cookie usage

export default async function AdminLoginPage() {
  // Authentication check re-added:
  if (await isAuthenticated()) {
    redirect('/admin/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <AdminLoginForm />
    </div>
  );
}
