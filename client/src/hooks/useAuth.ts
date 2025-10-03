import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[useAuth] initializing auth...");

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[useAuth] initial session:", session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("[useAuth] auth state changed:", session);
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      console.log("[useAuth] cleaning up subscription");
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("[useAuth] signing in with:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data.session?.user) {
      console.log("[useAuth] signIn success:", data.session.user);
      setUser(data.session.user);
      setSession(data.session);
    } else if (error) {
      console.error("[useAuth] signIn error:", error);
    }
    return { data, error };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName?: string
  ) => {
    console.log("[useAuth] signing up with:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (!error && data.user) {
      console.log("[useAuth] signUp success:", data.user);
      setUser(data.user);
      setSession(data.session ?? null); // may be null if email confirmation required
    } else if (error) {
      console.error("[useAuth] signUp error:", error);
    }
    return { data, error };
  };

  const signOut = async () => {
    console.log("[useAuth] signing out");
    const { error } = await supabase.auth.signOut();
    if (!error) setUser(null);
    return { error };
  };

  return { user, session, loading, signIn, signUp, signOut };
}
