"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SignUpForm from "@/components/SignUpForm";

export default function SignInPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setIsAuthenticated(true);
        // Check if they have a project in progress
        const savedStage = sessionStorage.getItem('conversationStage');
        if (savedStage && savedStage !== 'generating-questions') {
          // Redirect to their conversation
          router.push('/conversation');
        } else {
          // TODO: Redirect to dashboard/projects page when we build it
          // For now, redirect to conversation to start new
          router.push('/conversation');
        }
      } else {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignInSuccess = () => {
    // Check if they have a project in progress
    const savedStage = sessionStorage.getItem('conversationStage');
    if (savedStage && savedStage !== 'generating-questions') {
      // Redirect to their conversation
      router.push('/conversation');
    } else {
      // TODO: Redirect to dashboard/projects page when we build it
      // For now, redirect to conversation to start new
      router.push('/conversation');
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        <div className="text-center">
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-900 mb-2">
            Welcome back
          </h1>
          <p className="text-slate-600">
            Sign in to continue your project
          </p>
        </div>
        <SignUpForm onSuccess={handleSignInSuccess} defaultMode="signin" />
      </div>
    </div>
  );
}

