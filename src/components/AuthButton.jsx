"use client";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function AuthButton() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const redirectTo = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : '/auth/callback';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) console.error('Login error:', error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error.message);
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      {!user ? (
        <button onClick={handleLogin} className="button-theme rounded w-full">Sign in with Google</button>
      ) : (
        <button onClick={handleLogout} className="button-theme rounded w-full">Logout</button>
      )}
    </div>
  );
}
