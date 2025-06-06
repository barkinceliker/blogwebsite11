
'use server';

import { cookies } from 'next/headers';
import { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_COOKIE_NAME, AUTHOR_NAME } from './constants';
import type { UserSession } from '@/types';
import { firestore } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function login(formData: FormData): Promise<{ success: boolean; error?: string, session?: UserSession }> {
  const emailForm = formData.get('email') as string;
  const passwordForm = formData.get('password') as string;

  const email = emailForm ? emailForm.trim() : '';
  const password = passwordForm ? passwordForm.trim() : '';

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const cookieStore = await cookies();
    const adminsRef = collection(firestore, 'admins');
    const q = query(adminsRef, where('email', '==', email));
    
    const querySnapshot = await getDocs(q);

    let sessionData: UserSession | null = null;

    if (querySnapshot.empty) {
      // If no admin with this email is found in Firestore, authentication fails.
      // The fallback to ADMIN_EMAIL and ADMIN_PASSWORD from constants.ts is removed.
      return { success: false, error: 'Invalid email or password.' };
    } else {
      // Admin with this email exists in Firestore, proceed to check password.
      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();

      if (!adminData.password) {
        console.error(`[Auth] Admin document for ${email} is missing 'password' field in Firestore.`);
        return { success: false, error: 'Admin configuration error. Password missing.' };
      }
      
      const firestorePassword = adminData.password as string;
      if (firestorePassword === password) {
        sessionData = {
          email,
          name: adminData.name || AUTHOR_NAME, // Use Firestore name, fallback to AUTHOR_NAME
          isAuthenticated: true,
          loginTimestamp: Date.now(),
        };
      } else {
        // Password in Firestore does not match the provided password.
        return { success: false, error: 'Invalid email or password.' };
      }
    }

    if (sessionData) {
      cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'lax',
      });
      return { success: true, session: sessionData };
    }
    // This line should ideally not be reached if logic above is complete.
    return { success: false, error: 'An unknown error occurred during login processing.' };

  } catch (error: any) {
    console.error('[Auth] Error during Firestore admin login:', error);
    let errorMessage = 'An unexpected error occurred during login.';
     if (error.code) { 
        if (error.code === 'permission-denied' || error.code === 'PERMISSION_DENIED') {
            errorMessage = 'Firestore permission denied. Please check security rules or Firestore setup for the server environment.';
        } else {
            errorMessage = `An unexpected Firestore error occurred: ${error.code}. Message: ${error.message}. Check server logs.`;
        }
    } else if (error instanceof Error) {
        errorMessage = `An unexpected error occurred: ${error.message}. Check server logs.`;
    }
    return { success: false, error: errorMessage };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = cookies(); 
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (sessionCookie?.value) {
    try {
      const sessionData = JSON.parse(sessionCookie.value) as UserSession;
      
      // Check for session expiry: 1 day
      if (sessionData.isAuthenticated && sessionData.loginTimestamp && (Date.now() - sessionData.loginTimestamp > (60 * 60 * 24 * 1000))) {
        // Session has expired.
        // Consider calling logout() here or ensuring client redirects appropriately.
        // For now, just return as not authenticated.
        console.log(`[Auth] Session for ${sessionData.email} has expired.`);
        // It's better to remove the cookie if expired
        // await logout(); // This would cause issues if called from a context where cookies can't be set
        // A simple solution is to return null or an unauthenticated session.
        return null; 
      }
      
      if (sessionData.isAuthenticated) {
          return sessionData;
      }
      return null; 
    } catch (error) {
      console.error('[Auth] Failed to parse session cookie or invalid session structure:', error);
      return null;
    }
  }
  return null;
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.isAuthenticated;
}
