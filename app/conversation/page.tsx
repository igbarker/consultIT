"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import QuestionFlow from "@/components/QuestionFlow";

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

  useEffect(() => {
    // Get initial problem from sessionStorage
    const problem = sessionStorage.getItem('initialProblem') || '';
    setInitialProblem(problem);

    // Generate AI questions
    generateQuestions(problem);
  }, []);

  const generateQuestions = async (problem: string) => {
    try {
      const response = await fetch('/api/conversation/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });

      const data = await response.json();
      setProblemQuestions(data.questions || []);
      
      // Minimum 3 seconds on loading screen
      setTimeout(() => {
        setStage('problem-questions');
      }, 3000);
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to stage change after delay
      setTimeout(() => {
        setStage('problem-questions');
      }, 3000);
    }
  };

  const handleProblemQuestionsComplete = (answers: Record<string, string>) => {
    setProblemAnswers(answers);
    setStage('signup');
  };

  const handleSignupComplete = async () => {
    // Load firmographic questions
    const response = await fetch('/api/conversation/firmographic-questions');
    const data = await response.json();
    setFirmographicQuestions(data.questions);
    setStage('firmographic-questions');
  };

  const handleFirmographicComplete = (answers: Record<string, string>) => {
    setFirmographicAnswers(answers);
    setStage('generating-summary');
    
    // Generate summary
    setTimeout(() => {
      setStage('summary');
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
    return <LoadingScreen message="Analyzing your challenge and generating personalized questions..." />;
  }

  if (stage === 'problem-questions') {
    return <QuestionFlow questions={problemQuestions} onComplete={handleProblemQuestionsComplete} />;
  }

  if (stage === 'signup') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-lg p-8 text-center">
          <h2 className="text-3xl font-semibold text-slate-900 mb-4">
            Thanks for sharing
          </h2>
          <p className="text-slate-600 mb-8">
            Sign up to receive our analysis and next steps
          </p>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-slate-300 rounded-lg font-medium hover:border-slate-400 hover:bg-slate-50 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border-2 border-slate-300 rounded-lg font-medium hover:border-slate-400 hover:bg-slate-50 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#00A4EF" d="M0 0h11.377v11.372H0z"/>
                <path fill="#FFB900" d="M12.623 0H24v11.372H12.623z"/>
                <path fill="#05A6F0" d="M0 12.628h11.377V24H0z"/>
                <path fill="#FFBA08" d="M12.623 12.628H24V24H12.623z"/>
              </svg>
              <span>Continue with Microsoft</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">or</span>
            </div>
          </div>

          {/* Email Sign Up */}
          <div className="space-y-3">
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
            <button 
              onClick={handleSignupComplete}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg"
            >
              Create Account
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
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
        <QuestionFlow questions={firmographicQuestions} onComplete={handleFirmographicComplete} />
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
              Here's what we understood
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
              onClick={() => setStage('problem-questions')}
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

