"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SignUpForm from "@/components/SignUpForm";

export default function SignInPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Prevent double-checking
    if (hasCheckedRef.current) return;
    hasCheckedRef.current = true;

    // Check if already authenticated
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth check error:', error);
          setCheckingAuth(false);
          return;
        }
        
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
      } catch (error) {
        console.error('Error checking auth:', error);
        setCheckingAuth(false);
      }
    };

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('Auth check timed out - showing sign-in form');
      setCheckingAuth(false);
    }, 2000);

    checkAuth();

    return () => clearTimeout(timeout);
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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

