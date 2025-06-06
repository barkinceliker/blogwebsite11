
import { cookies } from 'next/headers';
import { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_COOKIE_NAME } from './constants';
import type { UserSession } from '@/types';

export async function login(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const sessionData: UserSession = { email, name: 'Admin User', isAuthenticated: true, loginTimestamp: Date.now() };
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'lax',
    });
    return { success: true };
  }
  return { success: false, error: 'Invalid email or password' };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (sessionCookie?.value) {
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      // Optional: Validate session, e.g., check expiry if loginTimestamp is used
      if (sessionData.loginTimestamp && (Date.now() - sessionData.loginTimestamp > (60 * 60 * 24 * 1000))) {
         await logout(); // Expired session
         return null;
      }
      return sessionData as UserSession;
    } catch (error) {
      console.error('Failed to parse session cookie:', error);
      return null;
    }
  }
  return null;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.isAuthenticated;
}
