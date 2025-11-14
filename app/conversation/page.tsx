"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import LoadingScreen from "@/components/LoadingScreen";
import QuestionFlow from "@/components/QuestionFlow";
import SignUpForm from "@/components/SignUpForm";

type Stage = 
  | 'generating-questions'
  | 'problem-questions'
  | 'signup'
  | 'firmographic-questions'
  | 'generating-summary'
  | 'summary';

interface Question {
  id: string;
  question: string;
  context: string;
  type: 'text' | 'number' | 'select' | 'yesno';
  options?: string[];
  required: boolean;
}

export default function ConversationPage() {
  const [stage, setStage] = useState<Stage>('generating-questions');
  const [initialProblem, setInitialProblem] = useState('');
  const [problemQuestions, setProblemQuestions] = useState<Question[]>([]);
  const [firmographicQuestions, setFirmographicQuestions] = useState<Question[]>([]);
  const [problemAnswers, setProblemAnswers] = useState<Record<string, string>>({});
  const [firmographicAnswers, setFirmographicAnswers] = useState<Record<string, string>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check auth status
    checkAuth();

    // Restore state from sessionStorage
    const savedProblem = sessionStorage.getItem('initialProblem') || '';
    const savedStage = sessionStorage.getItem('conversationStage') as Stage | null;
    const savedProblemAnswers = sessionStorage.getItem('problemAnswers');
    const savedFirmographicAnswers = sessionStorage.getItem('firmographicAnswers');
    const savedProblemQuestions = sessionStorage.getItem('problemQuestions');

    if (savedProblem) {
      setInitialProblem(savedProblem);
    }

    // Restore answers if they exist
    if (savedProblemAnswers) {
      try {
        setProblemAnswers(JSON.parse(savedProblemAnswers));
      } catch (e) {
        console.error('Error parsing problem answers:', e);
      }
    }

    if (savedFirmographicAnswers) {
      try {
        setFirmographicAnswers(JSON.parse(savedFirmographicAnswers));
      } catch (e) {
        console.error('Error parsing firmographic answers:', e);
      }
    }

    // Restore questions if they exist
    if (savedProblemQuestions) {
      try {
        setProblemQuestions(JSON.parse(savedProblemQuestions));
      } catch (e) {
        console.error('Error parsing problem questions:', e);
      }
    }

    // Only generate questions if we haven't started yet
    if (!savedStage || savedStage === 'generating-questions') {
      if (savedProblem) {
        generateQuestions(savedProblem);
      } else {
        // No problem saved - redirect to home
        window.location.href = '/';
      }
    } else {
      // Restore the stage we were at
      setStage(savedStage);
      
      // If we're past signup, load firmographic questions
      if (savedStage === 'firmographic-questions' || savedStage === 'generating-summary' || savedStage === 'summary') {
        fetch('/api/conversation/firmographic-questions')
          .then(res => res.json())
          .then(data => {
            setFirmographicQuestions(data.questions);
          })
          .catch(err => console.error('Error loading firmographic questions:', err));
      }
    }

    // Listen for auth state changes (for OAuth redirects and email confirmation)
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        setCheckingAuth(false);
        // If we're on signup stage and user just signed in, proceed
        const currentStage = sessionStorage.getItem('conversationStage') as Stage | null;
        if (currentStage === 'signup') {
          // Load firmographic questions
          const response = await fetch('/api/conversation/firmographic-questions');
          const data = await response.json();
          setFirmographicQuestions(data.questions);
          setStage('firmographic-questions');
          sessionStorage.setItem('conversationStage', 'firmographic-questions');
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Remove stage dependency to prevent re-running

  // Auto-proceed from signup if authenticated
  useEffect(() => {
    if (stage === 'signup' && isAuthenticated && !checkingAuth) {
      handleSignupComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, isAuthenticated, checkingAuth]);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAuth = !!user;
    setIsAuthenticated(isAuth);
    setCheckingAuth(false);
    
    // If user just confirmed email and we were at signup stage, proceed
    if (isAuth) {
      const savedStage = sessionStorage.getItem('conversationStage') as Stage | null;
      if (savedStage === 'signup') {
        // Load firmographic questions and proceed
        const response = await fetch('/api/conversation/firmographic-questions');
        const data = await response.json();
        setFirmographicQuestions(data.questions);
        setStage('firmographic-questions');
        sessionStorage.setItem('conversationStage', 'firmographic-questions');
      }
    }
  };

  const generateQuestions = async (problem: string) => {
    try {
      const response = await fetch('/api/conversation/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });

      const data = await response.json();
      const questions = data.questions || [];
      setProblemQuestions(questions);
      sessionStorage.setItem('problemQuestions', JSON.stringify(questions));
      
      // Minimum 3 seconds on loading screen
      setTimeout(() => {
        setStage('problem-questions');
        sessionStorage.setItem('conversationStage', 'problem-questions');
      }, 3000);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to stage change after delay
      setTimeout(() => {
        setStage('problem-questions');
        sessionStorage.setItem('conversationStage', 'problem-questions');
      }, 3000);
    }
  };

  const handleProblemQuestionsComplete = (answers: Record<string, string>) => {
    setProblemAnswers(answers);
    sessionStorage.setItem('problemAnswers', JSON.stringify(answers));
    setStage('signup');
    sessionStorage.setItem('conversationStage', 'signup');
  };

  const handleSignupComplete = async () => {
    // Verify auth
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setIsAuthenticated(true);
      // Load firmographic questions
      const response = await fetch('/api/conversation/firmographic-questions');
      const data = await response.json();
      setFirmographicQuestions(data.questions);
      setStage('firmographic-questions');
      sessionStorage.setItem('conversationStage', 'firmographic-questions');
    } else {
      // Still waiting for auth (OAuth redirect)
      setCheckingAuth(true);
    }
  };

  const handleFirmographicComplete = (answers: Record<string, string>) => {
    setFirmographicAnswers(answers);
    sessionStorage.setItem('firmographicAnswers', JSON.stringify(answers));
    setStage('generating-summary');
    sessionStorage.setItem('conversationStage', 'generating-summary');
    
    // Generate summary
    setTimeout(() => {
      setStage('summary');
      sessionStorage.setItem('conversationStage', 'summary');
    }, 2000);
  };

  const handleExportSummary = () => {
    // TODO: Generate PDF/document
    console.log('Export summary');
  };

  const handleExportNarrative = () => {
    // TODO: Generate narrative summary
    console.log('Export narrative');
  };

  if (stage === 'generating-questions') {
    return <LoadingScreen message="Ok, we've got a few questions to ask to ensure we are well aligned on your needs" />;
  }

  if (stage === 'problem-questions') {
    // Ensure questions are loaded before showing QuestionFlow
    if (!problemQuestions || problemQuestions.length === 0) {
      return <LoadingScreen message="Loading questions..." />;
    }
    return <QuestionFlow questions={problemQuestions} onComplete={handleProblemQuestionsComplete} />;
  }

  if (stage === 'signup') {
    if (checkingAuth) {
      return <LoadingScreen message="Verifying authentication..." />;
    }

    // If authenticated, show loading while proceeding (will auto-advance via useEffect)
    if (isAuthenticated) {
      return <LoadingScreen message="Great! Taking you to the next step..." />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4">
        <SignUpForm onSuccess={handleSignupComplete} />
      </div>
    );
  }

  if (stage === 'firmographic-questions') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4">
        <div className="w-full max-w-2xl mb-8">
          <div className="text-center mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200">
            <p className="text-lg font-medium text-slate-900">
              Just a few quick questions about your company...
            </p>
            <p className="text-sm text-slate-600 mt-2">
              This helps us match you with the right vendors
            </p>
          </div>
        </div>
        {firmographicQuestions && firmographicQuestions.length > 0 ? (
          <QuestionFlow questions={firmographicQuestions} onComplete={handleFirmographicComplete} />
        ) : (
          <LoadingScreen message="Loading questions..." />
        )}
      </div>
    );
  }

  if (stage === 'generating-summary') {
    return <LoadingScreen message="Analyzing your responses and generating summary..." />;
  }

  if (stage === 'summary') {
    const allAnswers = { ...problemAnswers, ...firmographicAnswers };
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-slate-900">
              Here&apos;s what we understood
            </h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Summary
            </span>
          </div>

          {/* Problem Section */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Your Challenge
            </h3>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-slate-900">{initialProblem}</p>
            </div>
          </div>

          {/* Key Requirements */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Key Requirements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(allAnswers).map(([key, value]) => (
                value && (
                  <div key={key} className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-slate-900 font-medium">{value}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-6 italic">
            This is a summary of our conversation. You can edit your answers or proceed to find matching vendors.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setStage('problem-questions');
                sessionStorage.setItem('conversationStage', 'problem-questions');
              }}
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:border-slate-400 transition-all"
            >
              Edit Answers
            </button>
            <button
              onClick={handleExportSummary}
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:border-slate-400 transition-all"
            >
              Export Summary
            </button>
            <button
              onClick={handleExportNarrative}
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-medium hover:border-slate-400 transition-all"
            >
              Export Narrative
            </button>
            <button
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg"
            >
              Find Vendors →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

