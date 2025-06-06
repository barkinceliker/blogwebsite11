
'use server';

import { cookies } from 'next/headers';
import { ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_COOKIE_NAME, AUTHOR_NAME } from './constants';
import type { UserSession } from '@/types';
import { firestore } from '@/lib/firebase'; // Firestore import edildi
import { collection, query, where, getDocs } from 'firebase/firestore'; // Firestore sorgu fonksiyonları import edildi

export async function login(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const adminsRef = collection(firestore, 'admins');
    const q = query(adminsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`No admin found with email: ${email}`);
      return { success: false, error: 'Invalid email or password' };
    }

    // Varsayılan olarak ilk eşleşen dokümanı alıyoruz, e-postaların benzersiz olduğunu varsayıyoruz.
    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data();

    if (adminData.password === password) {
      const sessionData: UserSession = {
        email,
        name: adminData.name || AUTHOR_NAME, // Firestore'dan isim alınabilir veya varsayılan kullanılır
        isAuthenticated: true,
        loginTimestamp: Date.now(),
      };
      const cookieStore = await cookies();
      cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(sessionData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'lax',
      });
      console.log(`Admin login successful for email: ${email}`);
      return { success: true };
    } else {
      console.log(`Password mismatch for admin email: ${email}`);
      return { success: false, error: 'Invalid email or password' };
    }
  } catch (error) {
    console.error('Error during Firestore admin login:', error);
    return { success: false, error: 'An unexpected error occurred during login.' };
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  console.log('User logged out');
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
         console.log('Session expired, logging out');
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
