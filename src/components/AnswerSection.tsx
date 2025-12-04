'use client';

import { useState, useEffect } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AnswerSectionProps {
  answer: string;
  questionId: number;
}

export function AnswerSection({ answer, questionId }: AnswerSectionProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [hasViewedAnswer, setHasViewedAnswer] = useState(false);

  // Check if user has already viewed the answer
  useEffect(() => {
    const viewed = localStorage.getItem(`viewed_answer_${questionId}`);
    if (viewed === 'true') {
      setHasViewedAnswer(true);
    }
  }, [questionId]);

  const handleShowAnswer = async () => {
    setShowAnswer(true);
    setHasViewedAnswer(true);
    localStorage.setItem(`viewed_answer_${questionId}`, 'true');

    // Track that user viewed the answer
    try {
      await fetch('/api/questions/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          viewedAnswer: true,
        }),
      });
    } catch (error) {
      console.error('Failed to track answer view:', error);
    }
  };

  if (!answer) {
    return (
      <div className="text-center py-8 text-gray-500 italic">
        Answer coming soon.
      </div>
    );
  }

  return (
    <div className="answer-section">
      {!showAnswer ? (
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
            onClick={handleShowAnswer}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Show Answer
          </button>
          <p className="text-gray-500 text-sm mt-3">
            {hasViewedAnswer
              ? "You've seen this answer before. Click to view again."
              : 'Try solving the problem first before viewing the solution'}
          </p>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Answer</h2>
            <button
              onClick={() => setShowAnswer(false)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              Hide Answer
            </button>
          </div>
          <MarkdownRenderer content={answer} />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
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
