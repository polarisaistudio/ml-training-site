'use client';

import Link from 'next/link';
import type { RealInterviewDetails } from '@/db/schema';

interface QuestionWithProgress {
  id: number;
  title: string;
  difficulty: string | null;
  tags: string[];
  source: string | null;
  completed: boolean;
  inProgress: boolean;
  hintsUsed: number;
  sourceType: string;
  realInterviewDetails: RealInterviewDetails | null;
}

interface RealQuestionCardProps {
  question: QuestionWithProgress;
}

export function RealQuestionCard({ question }: RealQuestionCardProps) {
  const details = question.realInterviewDetails || {};

  const statusIcon = question.completed ? '✅' : question.inProgress ? '▶️' : '⬜';

  const resultBadge = details.result ? {
    'passed': { text: '✓ Passed', class: 'bg-green-100 text-green-800' },
    'failed': { text: '✗ Failed', class: 'bg-red-100 text-red-800' },
    'pending': { text: '⏳ Pending', class: 'bg-yellow-100 text-yellow-800' }
  }[details.result] : null;

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/questions/${question.id}`}>
      <div className={`border-2 rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
        question.completed
          ? 'border-green-300 bg-green-50/50'
          : 'border-red-200 bg-red-50/30 hover:border-red-400'
      }`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">
            {statusIcon}
          </span>

          <div className="flex-1 min-w-0">
            {/* Badges Row */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold">
                🎯 REAL INTERVIEW
              </span>
              {resultBadge && (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${resultBadge.class}`}>
                  {resultBadge.text}
                </span>
              )}
              {question.difficulty && (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}>
                  {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">
              {question.title}
            </h3>

            {/* Tags */}
            {question.tags.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{question.tags.slice(0, 3).join(', ')}</span>
              </div>
            )}

            {/* Interview Details */}
            <div className="text-sm text-gray-700 space-y-1">
              {(details.company || question.source) && (
                <div className="flex items-center gap-1">
                  <span>🏢</span>
                  <strong>{details.company || question.source}</strong>
                  {details.position && <span>· {details.position}</span>}
                </div>
              )}
              {details.interviewDate && (
                <div className="flex items-center gap-1">
                  <span>📅</span>
                  <span>{new Date(details.interviewDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Progress indicator */}
            {question.inProgress && !question.completed && (
              <div className="mt-2 text-sm text-blue-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {question.hintsUsed > 0
                  ? `${question.hintsUsed} hint${question.hintsUsed > 1 ? 's' : ''} used`
                  : 'In progress'}
              </div>
            )}

            {/* Completed indicator */}
            {question.completed && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 self-center">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
