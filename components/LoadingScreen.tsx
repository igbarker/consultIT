"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

const DEFAULT_MESSAGES = [
  "Analyzing your challenge...",
  "Understanding your context...",
  "Generating personalized questions...",
  "Almost ready...",
];

const FUN_FACTS = [
  "Saving you from awkward consultant small talk...",
  "No expensive business analysts required here",
  "Consultants charge $500/hour for this. We're just getting started.",
  "The average consultant evaluation takes 6 months. We'll be done in 30 minutes.",
  "Breaking news: Companies save $150K by not hiring Big 4 firms",
  "Fun fact: 73% of consultant PowerPoints are just fancy bullet points",
  "Plot twist: You don't need a consultant to make good decisions",
  "Loading your AI consultant (minus the $800 Italian loafers)",
];

export default function LoadingScreen({ message }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const messages = message ? [message] : DEFAULT_MESSAGES;

  // Only randomize after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    setFactIndex(Math.floor(Math.random() * FUN_FACTS.length));
  }, []);

  useEffect(() => {
    if (message) return; // Don't rotate if custom message provided
    
    // Rotate loading messages faster
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 2000);

    // Rotate fun facts slower
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FUN_FACTS.length);
    }, 4000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(factInterval);
    };
  }, [message]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Animated Loader */}
        <div className="flex justify-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <Sparkles className="w-6 h-6 text-violet-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Loading Message */}
        <div className="min-h-[2rem]">
          <p 
            className="text-xl font-medium text-slate-900 transition-all duration-500"
            key={messageIndex}
          >
            {messages[messageIndex]}
          </p>
        </div>

        {/* Fun Fact */}
        <div className="min-h-[4rem] pt-8 border-t border-slate-200">
          <p 
            className="text-sm text-slate-600 italic transition-all duration-700 max-w-lg mx-auto"
            key={factIndex}
          >
            💡 {FUN_FACTS[factIndex]}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 justify-center pt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === messageIndex % 3 ? 'bg-blue-600 w-8' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

