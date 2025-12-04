'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface QuestionFiltersProps {
  availableTags: string[];
  totalCount: number;
  completedCount: number;
}

export function QuestionFilters({ availableTags, totalCount, completedCount }: QuestionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentDifficulty = searchParams.get('difficulty') || 'all';
  const currentStatus = searchParams.get('status') || 'all';
  const currentTag = searchParams.get('tag') || 'all';

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/questions?${params.toString()}`);
  }, [router, searchParams]);

  const difficulties = ['all', 'easy', 'medium', 'hard'];
  const statuses = [
    { value: 'all', label: 'All', icon: '' },
    { value: 'not-started', label: 'Not Started', icon: '⬜' },
    { value: 'in-progress', label: 'In Progress', icon: '▶️' },
    { value: 'completed', label: 'Completed', icon: '✅' },
  ];

  const getDifficultyStyle = (difficulty: string, isActive: boolean) => {
    if (isActive) {
      switch (difficulty) {
        case 'easy':
          return 'bg-green-600 text-white';
        case 'medium':
          return 'bg-yellow-500 text-white';
        case 'hard':
          return 'bg-red-600 text-white';
        default:
          return 'bg-blue-600 text-white';
      }
    }
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
      {/* Progress Summary */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500">Your Progress</p>
            <p className="font-bold text-lg text-gray-900">
              {completedCount} of {totalCount} completed
            </p>
          </div>
        </div>
        <div className="w-32">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{Math.round((completedCount / totalCount) * 100) || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100 || 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Difficulty
          </label>
          <div className="flex gap-2 flex-wrap">
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => updateFilter('difficulty', d)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${getDifficultyStyle(d, currentDifficulty === d)}`}
              >
                {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {statuses.map(s => (
              <button
                key={s.value}
                onClick={() => updateFilter('status', s.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  currentStatus === s.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s.icon && <span className="mr-1">{s.icon}</span>}
                {s.value === 'all' ? 'All' : s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tag Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Topic
          </label>
          <select
            value={currentTag}
            onChange={(e) => updateFilter('tag', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All Topics</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filters display */}
      {(currentDifficulty !== 'all' || currentStatus !== 'all' || currentTag !== 'all') && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Active filters:</span>
          {currentDifficulty !== 'all' && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyStyle(currentDifficulty, false)} flex items-center gap-1`}>
              {currentDifficulty}
              <button onClick={() => updateFilter('difficulty', 'all')} className="hover:opacity-70">×</button>
            </span>
          )}
          {currentStatus !== 'all' && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
              {statuses.find(s => s.value === currentStatus)?.icon} {statuses.find(s => s.value === currentStatus)?.label}
              <button onClick={() => updateFilter('status', 'all')} className="hover:opacity-70">×</button>
            </span>
          )}
          {currentTag !== 'all' && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
              {currentTag}
              <button onClick={() => updateFilter('tag', 'all')} className="hover:opacity-70">×</button>
            </span>
          )}
          <button
            onClick={() => {
              router.push('/questions');
            }}
            className="text-xs text-blue-600 hover:underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
