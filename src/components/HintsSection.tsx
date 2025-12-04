'use client';

import { useState, useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import type { Hint } from '@/lib/markdown';

interface HintsSectionProps {
  hints: Hint[];
  questionId: number;
  onShowAnswer: () => void;
}

export function HintsSection({ hints, questionId, onShowAnswer }: HintsSectionProps) {
  const [revealedHints, setRevealedHints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved hints count from localStorage and database
  useEffect(() => {
    const loadHintsProgress = async () => {
      // Check localStorage first
      const localHints = localStorage.getItem(`hints_${questionId}`);
      if (localHints) {
        setRevealedHints(parseInt(localHints, 10));
      }

      // Also try to load from database
      try {
        const response = await fetch(`/api/questions/progress?questionId=${questionId}`);
        const data = await response.json();
        if (data.progress?.hintsRevealed) {
          const dbHints = data.progress.hintsRevealed;
          setRevealedHints(prev => Math.max(prev, dbHints));
          localStorage.setItem(`hints_${questionId}`, dbHints.toString());
        }
      } catch (error) {
        console.error('Failed to load hints progress:', error);
      }
    };

    loadHintsProgress();
  }, [questionId]);

  const revealNextHint = async () => {
    if (revealedHints >= hints.length || isLoading) return;

    setIsLoading(true);
    const newCount = revealedHints + 1;

    try {
      // Save to database
      await fetch('/api/questions/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          hintsRevealed: newCount,
        }),
      });

      // Update local state
      setRevealedHints(newCount);
      localStorage.setItem(`hints_${questionId}`, newCount.toString());
    } catch (error) {
      console.error('Failed to save hint progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // If no hints available, show simple answer button
  if (hints.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <button
          onClick={onShowAnswer}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          Show Answer
        </button>
        <p className="text-gray-500 text-sm mt-3">
          Try solving the problem first before viewing the solution
        </p>
      </div>
    );
  }

  return (
    <div className="hints-section">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
        Need Help?
      </h2>

      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-600">
            Hints: {revealedHints} of {hints.length} revealed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(revealedHints / hints.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Hints list */}
      <div className="space-y-4 mb-8">
        {hints.map((hint, index) => (
          <div key={index}>
            {index < revealedHints ? (
              // Revealed hint
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg animate-fadeIn">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-600 font-bold text-sm">
                    Hint {index + 1}
                  </span>
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                </div>
                <div className="text-gray-700">
                  <MarkdownRenderer content={hint.content} />
                </div>
              </div>
            ) : index === revealedHints ? (
              // Next hint to reveal
              <button
                onClick={revealNextHint}
                disabled={isLoading}
                className="w-full py-4 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition text-gray-600 hover:text-yellow-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Revealing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Reveal Hint {index + 1}
                  </>
                )}
              </button>
            ) : (
              // Locked hint
              <div className="py-4 px-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Hint {index + 1} (unlock previous hints first)
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show Full Answer Button */}
      <div className="pt-6 border-t border-gray-200 text-center">
        <button
          onClick={onShowAnswer}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl"
        >
          Show Full Answer
        </button>
        <p className="text-sm text-gray-500 mt-3">
          {revealedHints === 0
            ? "Try using hints first, or jump straight to the answer"
            : `You've used ${revealedHints}/${hints.length} hints`}
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
