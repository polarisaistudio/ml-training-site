'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface QuestionTabsProps {
  activeTab: 'real' | 'practice';
  realCount: number;
  practiceCount: number;
}

export function QuestionTabs({ activeTab, realCount, practiceCount }: QuestionTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const switchTab = useCallback((tab: 'real' | 'practice') => {
    const params = new URLSearchParams();
    if (tab === 'practice') {
      params.set('tab', 'practice');
    }
    // Don't preserve other filters when switching tabs for cleaner UX
    router.push(`/questions?${params.toString()}`);
  }, [router]);

  return (
    <div className="mb-6">
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => switchTab('real')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 -mb-px ${
            activeTab === 'real'
              ? 'border-red-600 text-red-600 bg-red-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <span>🎯</span>
            <span>Real Interview</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'real'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {realCount}
            </span>
          </span>
        </button>
        <button
          onClick={() => switchTab('practice')}
          className={`px-6 py-3 font-semibold transition-all border-b-2 -mb-px ${
            activeTab === 'practice'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="flex items-center gap-2">
            <span>📚</span>
            <span>Practice</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeTab === 'practice'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {practiceCount}
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
