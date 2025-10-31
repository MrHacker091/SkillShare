'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * This component handles setting the user role based on the userType
 * selected during Google OAuth sign-in. It checks localStorage for
 * a pending userType and updates the session accordingly.
 */
export function RoleInitializer() {
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once
    if (hasInitialized.current || !session?.user) return;

    // Check if there's a pending userType from OAuth sign-in
    const pendingUserType = localStorage.getItem('pendingUserType');
    const urlUserType = searchParams.get('userType');
    const userType = urlUserType || pendingUserType;

    if (userType && session.user.role !== userType.toUpperCase()) {
      hasInitialized.current = true;
      
      // Update the session with the correct role
      const newRole = userType === 'creator' ? 'CREATOR' : 'CUSTOMER';
      const isCreator = userType === 'creator';

      // Update session
      update({
        ...session,
        user: {
          ...session.user,
          role: newRole,
          isCreator: isCreator,
        },
      });

      // Clear the pending userType
      localStorage.removeItem('pendingUserType');

      // Clean up URL if userType was in query params
      if (urlUserType) {
        router.replace('/dashboard');
      }
    }
  }, [session, update, searchParams, router]);

  return null; // This component doesn't render anything
}
