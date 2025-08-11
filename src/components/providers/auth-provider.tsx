
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';

// NOTE: Authentication is temporarily disabled. A mock user is provided.
// To re-enable, uncomment the sections in this file and remove the mock user.
const MOCK_USER: User = {
  uid: 'mock-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://placehold.co/40x40.png',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  // These are required fields for the User type
  providerId: 'mock',
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
};


// Helper to create a user-friendly error message
const getFriendlyAuthErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';
    case 'auth/weak-password':
      return 'The password is too weak. It must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (displayName: string, email: string, pass: string) => Promise<{ success: boolean; error?: string; }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string; }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // To re-enable auth, remove MOCK_USER and uncomment the line below
  const [user, setUser] = useState<User | null>(MOCK_USER);
  // const [user, setUser] = useState<User | null>(null);

  // To re-enable auth, set loading to true
  const [loading, setLoading] = useState(false);
  // const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  /*
  // To re-enable auth, uncomment this useEffect block
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  */

  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/review-helper') || pathname.startsWith('/timesheet');
  
  /*
  // To re-enable auth, uncomment this useEffect block
  useEffect(() => {
    if (!loading && !user && isProtectedRoute) {
        router.push('/');
    }
    if (!loading && user && (pathname === '/' || pathname.startsWith('/signup'))) {
        router.push('/dashboard');
    }
  }, [user, loading, router, pathname, isProtectedRoute]);
  */


  const signInWithGoogle = async () => {
    // const provider = new GoogleAuthProvider();
    // try {
    //   await signInWithPopup(auth, provider);
    // } catch (error) {
    //   console.error("Error signing in with Google", error);
    // }
    console.log("Google Sign-In is temporarily disabled.");
    return Promise.resolve();
  };

  const signUpWithEmail = async (displayName: string, email: string, pass: string) => {
    // try {
    //     const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    //     await updateProfile(userCredential.user, { displayName });
    //     // Manually update user state to reflect display name immediately
    //     setUser({ ...userCredential.user, displayName });
    //     return { success: true };
    // } catch (error) {
    //     console.error("Error signing up with email", error);
    //     return { success: false, error: getFriendlyAuthErrorMessage(error as AuthError) };
    // }
    console.log("Email Sign-Up is temporarily disabled.");
    return Promise.resolve({ success: true });
  };

  const signInWithEmail = async (email: string, pass: string) => {
    // try {
    //     await signInWithEmailAndPassword(auth, email, pass);
    //     return { success: true };
    // } catch (error) {
    //     console.error("Error signing in with email", error);
    //     return { success: false, error: getFriendlyAuthErrorMessage(error as AuthError) };
    // }
    console.log("Email Sign-In is temporarily disabled.");
    return Promise.resolve({ success: true });
  };


  const signOut = async () => {
    // try {
    //   await firebaseSignOut(auth);
    // } catch (error) {
    //   console.error("Error signing out", error);
    // }
    console.log("Sign out is temporarily disabled. Reloading the page.");
    window.location.href = '/';
  };
  
  if (loading && (isProtectedRoute || pathname === '/' || pathname.startsWith('/signup'))) {
     return (
        <div className="flex h-screen w-screen items-center justify-center">
          <div className="w-full max-w-md space-y-4 p-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
          </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
