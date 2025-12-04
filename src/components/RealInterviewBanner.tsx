'use client';

import { useState } from 'react';
import type { RealInterviewDetails } from '@/db/schema';

interface RealInterviewBannerProps {
  details: RealInterviewDetails;
}

export function RealInterviewBanner({ details }: RealInterviewBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasNotes = !!(
    details.interviewerFocus ||
    details.hintsGiven ||
    details.followUpQuestions?.length ||
    details.myPerformance ||
    details.notes
  );

  const getResultBadge = () => {
    if (!details.result) return null;

    const badges = {
      'passed': { text: '✓ Passed', class: 'bg-green-100 text-green-800' },
      'failed': { text: '✗ Failed', class: 'bg-red-100 text-red-800' },
      'pending': { text: '⏳ Pending', class: 'bg-yellow-100 text-yellow-800' }
    };

    const badge = badges[details.result];
    if (!badge) return null;

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <span className="text-4xl flex-shrink-0">🎯</span>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-xl font-bold text-red-900">
              Real Interview Question
            </h3>
            {getResultBadge()}
          </div>

          <div className="space-y-2 text-red-900">
            {details.company && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">🏢 Company:</span>
                <span>
                  {details.company}
                  {details.position && ` · ${details.position}`}
                </span>
              </div>
            )}
            {details.interviewDate && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">📅 Date:</span>
                <span>{new Date(details.interviewDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {hasNotes && (
            <div className="mt-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-red-700 font-semibold hover:text-red-900 flex items-center gap-1 transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                📝 Interview Notes & Insights
              </button>

              {isExpanded && (
                <div className="mt-3 p-4 bg-white rounded-lg border border-red-200 space-y-4 text-sm animate-fadeIn">
                  {details.interviewerFocus && (
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        🔍 Interviewer Focus:
                      </div>
                      <div className="text-gray-700">{details.interviewerFocus}</div>
                    </div>
                  )}

                  {details.hintsGiven && (
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        💡 Hints Given:
                      </div>
                      <div className="text-gray-700">{details.hintsGiven}</div>
                    </div>
                  )}

                  {details.followUpQuestions && details.followUpQuestions.length > 0 && (
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        ❓ Follow-up Questions:
                      </div>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {details.followUpQuestions.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {details.myPerformance && (
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        📊 My Performance:
                      </div>
                      <div className="text-gray-700">{details.myPerformance}</div>
                    </div>
                  )}

                  {details.notes && (
                    <div>
                      <div className="font-semibold text-gray-900 mb-1">
                        📝 Other Notes:
                      </div>
                      <div className="text-gray-700">{details.notes}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
