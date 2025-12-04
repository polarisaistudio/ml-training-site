'use client';

import { useState, useEffect, useRef } from 'react';

interface QuestionActionsProps {
  questionId: number;
}

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function QuestionActions({ questionId }: QuestionActionsProps) {
  const [completed, setCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Load existing progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch(`/api/questions/progress?questionId=${questionId}`);
        const data = await response.json();
        if (data.progress) {
          setCompleted(data.progress.completed);
          setTimeSpent(data.progress.timeSpent || 0);
          setNotes(data.progress.notes || '');
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }

      // Also check localStorage for time spent
      const localTime = localStorage.getItem(`time_${questionId}`);
      if (localTime) {
        setTimeSpent(parseInt(localTime, 10));
      }
    };

    loadProgress();
  }, [questionId]);

  // Timer effect
  useEffect(() => {
    startTimeRef.current = Date.now() - timeSpent * 1000;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeSpent(elapsed);
      localStorage.setItem(`time_${questionId}`, elapsed.toString());
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [questionId]);

  // Save time spent periodically (every 30 seconds)
  useEffect(() => {
    const saveTimer = setInterval(async () => {
      try {
        await fetch('/api/questions/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId,
            timeSpent,
          }),
        });
      } catch (error) {
        console.error('Failed to save time:', error);
      }
    }, 30000);

    return () => clearInterval(saveTimer);
  }, [questionId, timeSpent]);

  const handleMarkComplete = async () => {
    setSaving(true);
    try {
      await fetch('/api/questions/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          completed: true,
          timeSpent,
        }),
      });
      setCompleted(true);
    } catch (error) {
      console.error('Failed to mark complete:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkIncomplete = async () => {
    setSaving(true);
    try {
      await fetch('/api/questions/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          completed: false,
        }),
      });
      setCompleted(false);
    } catch (error) {
      console.error('Failed to mark incomplete:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await fetch('/api/questions/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          notes,
        }),
      });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {!completed ? (
            <button
              onClick={handleMarkComplete}
              disabled={saving}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Mark as Completed
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Completed!</span>
              </div>
              <button
                onClick={handleMarkIncomplete}
                disabled={saving}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Undo
              </button>
            </div>
          )}

          <button
            onClick={() => setShowNotes(!showNotes)}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {showNotes ? 'Hide' : notes ? 'View' : 'Add'} Notes
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-mono font-medium">{formatTime(timeSpent)}</span>
          <span className="text-sm text-gray-500">time spent</span>
        </div>
      </div>

      {showNotes && (
        <div className="mt-4 animate-fadeIn">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes, approach, key learnings, or things to remember..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
            {notesSaved && (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Notes saved!
              </span>
            )}
          </div>
        </div>
      )}

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
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
