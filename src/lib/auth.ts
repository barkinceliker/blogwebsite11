
'use server';

import { cookies } from 'next/headers';
import { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_COOKIE_NAME, AUTHOR_NAME } from './constants';
import type { UserSession } from '@/types';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function login(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log(`[Auth] Attempting login for email: "${email}"`);

  if (!email || !password) {
    console.log('[Auth] Email or password not provided.');
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const cookieStore = await cookies();
    const adminsRef = collection(firestore, 'admins');
    const q = query(adminsRef, where('email', '==', email));
    
    console.log(`[Auth] Querying Firestore for admin with email: "${email}"`);
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`[Auth] No admin found in Firestore with email: "${email}"`);
      return { success: false, error: 'Invalid email or password' };
    }

    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data();
    console.log(`[Auth] Admin data found in Firestore:`, adminData);

    if (adminData.password === password) {
      console.log(`[Auth] Password match for email: "${email}". Login successful.`);
      const sessionData: UserSession = {
        email,
        name: adminData.name || AUTHOR_NAME, 
        isAuthenticated: true,
        loginTimestamp: Date.now(),
      };
      cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'lax',
      });
      return { success: true };
    } else {
      console.log(`[Auth] Password mismatch for email: "${email}". Firestore password: "${adminData.password}", Provided password: "${password}"`);
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    console.error('[Auth] Error during Firestore admin login:', error);
    let errorMessage = 'An unexpected error occurred during login.';
    if (error instanceof Error) {
        const errorCode = (error as any).code; 
        if (errorCode === 'permission-denied') {
            console.error('[Auth] Firestore permission denied. Check your security rules.');
            errorMessage = 'Firestore permission denied. Please check security rules.';
        } else if (errorCode) {
            errorMessage = `An unexpected error occurred: ${errorCode}. Check server logs.`;
        }
    }
    return { success: false, error: errorMessage };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  console.log('[Auth] User logged out');
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (sessionCookie?.value) {
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      if (sessionData.loginTimestamp && (Date.now() - sessionData.loginTimestamp > (60 * 60 * 24 * 1000))) {
         await logout(); 
         console.log('[Auth] Session expired, logging out');
         return null;
      }
      return sessionData as UserSession;
    } catch (error) {
      console.error('[Auth] Failed to parse session cookie:', error);
      return null;
    }
  }
  return null;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.isAuthenticated;
}
