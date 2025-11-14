"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SignUpFormProps {
  onSuccess: () => void;
  defaultMode?: 'signup' | 'signin';
}

export default function SignUpForm({ onSuccess, defaultMode = 'signup' }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(defaultMode === 'signup');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent("/conversation")}`,
          },
        });

        if (signUpError) throw signUpError;

        // If email confirmation is required, show message
        if (data.user && !data.session) {
          setError("Please check your email to confirm your account. We sent a confirmation link to " + email);
          setIsLoading(false);
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth handlers - uncomment when OAuth providers are configured in Supabase
  // const handleOAuth = async (provider: "google" | "microsoft") => {
  //   setError("");
  //   setIsLoading(true);

  //   try {
  //     const supabase = createClient();
  //     const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
  //       provider: provider === "microsoft" ? "azure" : "google",
  //       options: {
  //         redirectTo: `${window.location.origin}/auth/callback?redirect_to=${encodeURIComponent("/conversation")}`,
  //       },
  //     });

  //     if (oauthError) throw oauthError;

  //     // Redirect happens automatically
  //   } catch (err: any) {
  //     setError(err.message || "Failed to authenticate");
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-lg p-8 text-center">
      <h2 className="text-3xl font-semibold text-slate-900 mb-4">
        Thanks for sharing
      </h2>
      <p className="text-slate-600 mb-8">
        {isSignUp 
          ? "Sign up to receive our analysis and next steps"
          : "Sign in to continue"
        }
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Email Sign Up */}
      <form onSubmit={handleEmailAuth} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          required
          disabled={isLoading}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          disabled={isLoading}
          minLength={6}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
        </button>
      </form>

      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="mt-4 text-sm text-slate-600 hover:text-slate-900"
      >
        {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
      </button>

      <p className="text-xs text-slate-500 mt-4">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}

