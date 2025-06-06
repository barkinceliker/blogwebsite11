
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { getSession } from '@/lib/auth';
import type { UserSession } from '@/types';

export const dynamic = 'force-dynamic'; 

export default async function AdminLoginPage() {
  const session: UserSession | null = await getSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <AdminLoginForm currentSession={session} />
    </div>
  );
}
