"use client";

import Link from "next/link";

interface QuestionWithProgress {
  id: number;
  title: string;
  difficulty: string | null;
  tags: string[];
  source: string | null;
  completed: boolean;
  inProgress: boolean;
  hintsUsed: number;
  sourceType?: string;
}

interface QuestionListItemProps {
  question: QuestionWithProgress;
  showSourceBadge?: boolean;
}

export function QuestionListItem({
  question,
  showSourceBadge = false,
}: QuestionListItemProps) {
  const statusIcon = question.completed
    ? "✅"
    : question.inProgress
      ? "▶️"
      : "⬜";
  const statusColor = question.completed
    ? "text-green-600"
    : question.inProgress
      ? "text-blue-600"
      : "text-gray-300";

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link href={`/questions/${question.id}`}>
      <div
        className={`border rounded-lg p-4 hover:shadow-md transition cursor-pointer ${
          question.completed
            ? "border-green-200 bg-green-50/30"
            : question.inProgress
              ? "border-blue-200 bg-blue-50/30"
              : "border-gray-200 hover:border-blue-300 bg-white"
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className={`text-2xl ${statusColor} flex-shrink-0 mt-0.5`}>
            {statusIcon}
          </div>

          {/* Question Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {/* Real Interview Badge */}
              {showSourceBadge && question.sourceType === "real-interview" && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center gap-1">
                  🎯 Real
                </span>
              )}
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {question.title}
              </h3>
              {question.difficulty && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(question.difficulty)}`}
                >
                  {question.difficulty.charAt(0).toUpperCase() +
                    question.difficulty.slice(1)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              {question.tags.length > 0 && (
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {question.tags.slice(0, 3).join(", ")}
                  {question.tags.length > 3 && ` +${question.tags.length - 3}`}
                </span>
              )}

              {question.source && (
                <span className="flex items-center gap-1 text-gray-500">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {question.source}
                </span>
              )}
            </div>

            {/* Progress indicator for in-progress questions */}
            {question.inProgress && !question.completed && (
              <div className="mt-2 text-sm text-blue-600 flex items-center gap-1">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {question.hintsUsed > 0
                  ? `${question.hintsUsed} hint${question.hintsUsed > 1 ? "s" : ""} used`
                  : "Code saved"}
              </div>
            )}

            {/* Completed indicator */}
            {question.completed && (
              <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Completed
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 self-center">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
