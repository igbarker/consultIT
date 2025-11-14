"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, HelpCircle, SkipForward } from "lucide-react";

interface Question {
  id: string;
  question: string;
  context: string;
  type: 'text' | 'number' | 'select' | 'yesno';
  options?: string[];
  required: boolean;
}

interface QuestionFlowProps {
  questions: Question[];
  onComplete: (answers: Record<string, string>) => void;
}

export default function QuestionFlow({ questions, onComplete }: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showContext, setShowContext] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentAnswer.trim() || !currentQuestion.required) {
      setAnswers({ ...answers, [currentQuestion.id]: currentAnswer });
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentAnswer(answers[questions[currentIndex + 1].id] || "");
      } else {
        // All questions answered
        onComplete({ ...answers, [currentQuestion.id]: currentAnswer });
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setAnswers({ ...answers, [currentQuestion.id]: currentAnswer });
      setCurrentIndex(currentIndex - 1);
      setCurrentAnswer(answers[questions[currentIndex - 1].id] || "");
    }
  };

  const handleSkip = () => {
    if (!currentQuestion.required) {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentAnswer(answers[questions[currentIndex + 1].id] || "");
      } else {
        onComplete(answers);
      }
    }
  };

  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="w-full p-4 text-base border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 resize-none min-h-[120px]"
            autoFocus
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Enter number..."
            className="w-full p-4 text-base border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            autoFocus
          />
        );
      
      case 'select':
        return (
          <select
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            className="w-full p-4 text-base border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            autoFocus
          >
            <option value="">Select an option...</option>
            {currentQuestion.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'yesno':
        return (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setCurrentAnswer('yes')}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all ${
                currentAnswer === 'yes'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setCurrentAnswer('no')}
              className={`flex-1 py-4 px-6 rounded-xl font-medium transition-all ${
                currentAnswer === 'no'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300'
              }`}
            >
              No
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-slate-500">
              {Math.round(progress)}% complete
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-lg p-8 mb-6">
          {/* Question Text */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              {currentQuestion.question}
            </h2>
            
            {/* Context Toggle */}
            <button
              type="button"
              onClick={() => setShowContext(!showContext)}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Why we&apos;re asking this</span>
            </button>
            
            {/* Context Explanation */}
            {showContext && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-slate-700">
                  {currentQuestion.context}
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="mb-6">
            {renderInput()}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            <button
              type="button"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {/* Skip & Continue */}
            <div className="flex gap-3">
              {!currentQuestion.required && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <SkipForward className="w-4 h-4" />
                  <span>Skip</span>
                </button>
              )}
              
              <button
                type="button"
                onClick={handleNext}
                disabled={currentQuestion.required && !currentAnswer.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25"
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <p className="text-center text-sm text-slate-500">
          You can always go back and change your answers
        </p>
      </div>
    </div>
  );
}

