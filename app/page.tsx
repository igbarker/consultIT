"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, Paperclip, Sparkles } from "lucide-react";

const ROTATING_WORDS = [
  "challenge",
  "problem", 
  "issue",
  "barrier",
  "roadblock",
  "bottleneck",
  "obstacle"
];

export default function HomePage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Save problem to sessionStorage and navigate to conversation
    sessionStorage.setItem('initialProblem', input);
    router.push('/conversation');
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // TODO: Implement voice recognition
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("File uploaded:", file.name);
      // TODO: Handle file upload
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 p-4 pb-24 relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent"></div>
      
      <div className="relative z-10 w-full max-w-3xl mt-4">
        {/* Main Content */}
        <div className="animate-slide-up">
          {/* Headline */}
          <h2 className="text-5xl md:text-6xl font-semibold text-slate-900 text-center mb-16">
            <div className="mb-0 overflow-visible" style={{ paddingBottom: '0' }}>
              <span>Describe your </span>
              <span className="inline-block relative text-left overflow-visible" style={{ width: '240px', minHeight: '1.8em' }}>
                <span 
                  className={`inline-block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent transition-all duration-300 overflow-visible ${
                    isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                  }`}
                  style={{ lineHeight: '1.4' }}
                >
                  {ROTATING_WORDS[currentWordIndex]}
                </span>
              </span>
            </div>
            <div className="-mt-6">we&apos;ll help you solve it.</div>
          </h2>

          <p className="text-sm text-slate-600 text-center mb-8 mx-auto whitespace-nowrap">
            Stop paying for overpriced consultants and see for yourself how we are reimagining internal projects
          </p>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div 
              className={`relative bg-white/80 backdrop-blur-xl rounded-2xl border transition-all duration-200 overflow-hidden ${
                isFocused 
                  ? 'border-blue-300 shadow-lg shadow-blue-100/50' 
                  : 'border-slate-200/80 shadow-sm'
              }`}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Share as little or as much as you&apos;d like - we&apos;ll take it from here."
                className="w-full pt-4 px-6 pb-6 pr-24 text-base resize-none focus:outline-none min-h-[180px] max-h-[400px] text-slate-900 placeholder:text-slate-400 bg-transparent"
                rows={4}
              />
              
              {/* Voice and Upload Buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    isListening 
                      ? "bg-red-500 text-white shadow-lg shadow-red-200" 
                      : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                  title="Voice input"
                >
                  <Mic className="w-5 h-5" />
                </button>
                
                <label 
                  className="p-3 rounded-xl bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 cursor-pointer transition-all duration-200"
                  title="Upload document"
                >
                  <Paperclip className="w-5 h-5" />
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className="group w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 px-8 rounded-xl text-base font-semibold hover:from-blue-700 hover:to-violet-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:shadow-none relative overflow-hidden"
            >
              <span className="relative z-10">
                Let&apos;s Find a Solution
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-violet-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </form>
        </div>
      </div>

      {/* Sign In Link */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 pointer-events-auto">
        <button
          type="button"
          onClick={() => router.push('/signin')}
          className="text-sm text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          Working on a current project? <span className="font-medium underline">Sign in here</span>
        </button>
      </div>
    </main>
  );
}

