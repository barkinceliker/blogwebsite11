
'use server';

import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, AUTHOR_NAME } from './constants';
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

    if (querySnapshot.empty) {
      console.log(`[Auth] No admin found with email: ${email} in Firestore.`);
      return { success: false, error: 'Invalid email or password. No admin found with this email in Firestore.' };
    } else {
      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();

      if (!adminData.hasOwnProperty('password')) {
        console.error(`[Auth] Admin document for ${email} is missing the 'password' field entirely in Firestore.`);
        return { success: false, error: `Login failed: The 'password' field is completely missing from the admin document for ${email} in Firestore. Please ensure the field name is 'password' (all lowercase).` };
      }
      
      if (adminData.password === null) {
        console.error(`[Auth] Admin document for ${email} has a 'password' field that is null.`);
        return { success: false, error: `Login failed: The 'password' field for ${email} in Firestore is null. It must be a text value.` };
      }

      if (typeof adminData.password !== 'string') {
        console.error(`[Auth] Admin document for ${email} has a 'password' field, but it's not a string (type: ${typeof adminData.password}). Value: ${adminData.password}`);
        return { success: false, error: `Login failed: The 'password' field for ${email} in Firestore is not a string. It must be a text value. Current type: ${typeof adminData.password}.` };
      }

      if (adminData.password === '') {
        console.error(`[Auth] Admin document for ${email} has an empty 'password' field in Firestore.`);
        return { success: false, error: `Login failed: The 'password' field for ${email} in Firestore is an empty string. It cannot be blank.` };
      }
      
      const firestorePassword = adminData.password; // Now known to be a non-empty string
      if (firestorePassword === password) {
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
        return { success: true, session: sessionData };
      } else {
        console.log(`[Auth] Password mismatch for email: ${email}. Firestore password hash (or plain if stored) does not match provided password.`);
        return { success: false, error: 'Invalid email or password. Password in Firestore does not match.' };
      }
    }
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
      
      // Check for session expiry (e.g., 24 hours)
      if (sessionData.isAuthenticated && sessionData.loginTimestamp && (Date.now() - sessionData.loginTimestamp > (60 * 60 * 24 * 1000))) {
        console.log(`[Auth] Session for ${sessionData.email} has expired.`);
        await logout(); // Explicitly log out an expired session
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
