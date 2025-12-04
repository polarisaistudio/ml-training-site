"use client";

import { useState, useEffect, useCallback } from "react";
import { TestCases } from "./TestCases";
import type { TestCase } from "@/lib/markdown";

interface CodeEditorProps {
  questionId: number;
  language?: string;
  testCases?: TestCase[];
  questionTitle?: string;
}

export function CodeEditor({
  questionId,
  language = "python",
  testCases = [],
  questionTitle,
}: CodeEditorProps) {
  const [code, setCode] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load saved code from localStorage on mount
  useEffect(() => {
    const savedCode = localStorage.getItem(`code_${questionId}`);
    if (savedCode) {
      setCode(savedCode);
    }

    // Also try to load from database
    const loadFromDatabase = async () => {
      try {
        const response = await fetch(
          `/api/questions/solutions?questionId=${questionId}`,
        );
        const data = await response.json();
        if (data.solution?.code) {
          setCode(data.solution.code);
          localStorage.setItem(`code_${questionId}`, data.solution.code);
        }
      } catch (error) {
        console.error("Failed to load solution from database:", error);
      }
    };

    loadFromDatabase();
  }, [questionId]);

  // Auto-save to localStorage on code change
  useEffect(() => {
    if (code) {
      localStorage.setItem(`code_${questionId}`, code);
    }
  }, [code, questionId]);

  // Auto-save to database every 30 seconds if code has changed
  useEffect(() => {
    if (!code) return;

    const timer = setInterval(async () => {
      await saveToDatabase();
    }, 30000);

    return () => clearInterval(timer);
  }, [code, questionId]);

  const saveToDatabase = useCallback(async () => {
    if (!code.trim()) return;

    setSaving(true);
    try {
      await fetch("/api/questions/solutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId,
          code,
          language,
        }),
      });
      setLastSaved(new Date());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to save solution:", error);
    } finally {
      setSaving(false);
    }
  }, [code, questionId, language]);

  const handleSave = async () => {
    await saveToDatabase();
  };

  const handleClear = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your code? This cannot be undone.",
      )
    ) {
      setCode("");
      localStorage.removeItem(`code_${questionId}`);
    }
  };

  const getPlaceholder = () => {
    switch (language) {
      case "python":
        return `# Write your ${language} solution here...\n\ndef solution():\n    pass`;
      case "javascript":
        return `// Write your ${language} solution here...\n\nfunction solution() {\n    \n}`;
      default:
        return `// Write your solution here...`;
    }
  };

  return (
    <div className="code-editor-section">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          Your Solution
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={language}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
            disabled
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-400 text-xs">{language}</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={getPlaceholder()}
          className="w-full h-72 p-4 font-mono text-sm bg-gray-900 text-gray-100 focus:outline-none resize-none"
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || !code.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                Save Solution
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            disabled={!code}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>

          {saved && (
            <span className="text-green-600 font-medium flex items-center gap-1 animate-fadeIn">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Saved!
            </span>
          )}
        </div>

        <div className="text-sm text-gray-500 flex items-center gap-4">
          {lastSaved && (
            <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
          )}
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Auto-saves every 30s
          </span>
        </div>
      </div>

      {/* Test Cases Section */}
      {testCases.length > 0 && (
        <div className="mt-6">
          <TestCases testCases={testCases} questionTitle={questionTitle} />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
