'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { error } = await supabase.auth.getSession(); // session is already handled, this will confirm it
      if (error) {
        console.error('Error completing login:', error);
      }
      // Redirect to landing page
      router.replace('/');
    };

    handleAuth();
  }, [router]);

  return <p className="text-center mt-10">Signing you in...</p>;
}
