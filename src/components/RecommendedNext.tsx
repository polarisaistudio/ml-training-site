'use client';

import Link from 'next/link';

interface QuestionWithProgress {
  id: number;
  title: string;
  difficulty: string | null;
  tags: string[];
  source: string | null;
  completed: boolean;
  inProgress: boolean;
  hintsUsed: number;
}

interface RecommendedNextProps {
  questions: QuestionWithProgress[];
}

export function RecommendedNext({ questions }: RecommendedNextProps) {
  // Find the next question to work on
  // Priority: 1) In-progress questions, 2) Not started questions (easy first)
  const inProgressQuestion = questions.find(q => q.inProgress && !q.completed);

  const notStartedQuestions = questions
    .filter(q => !q.completed && !q.inProgress)
    .sort((a, b) => {
      // Sort by difficulty: easy -> medium -> hard
      const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
      const aOrder = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] ?? 1;
      const bOrder = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] ?? 1;
      return aOrder - bOrder;
    });

  const nextQuestion = inProgressQuestion || notStartedQuestions[0];

  const completedCount = questions.filter(q => q.completed).length;

  // All completed
  if (!nextQuestion) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">🎉</div>
          <div>
            <h3 className="font-bold text-xl text-green-900 mb-1">
              All Questions Completed!
            </h3>
            <p className="text-green-700">
              Amazing work! You&apos;ve completed all {questions.length} available questions.
              Consider reviewing your notes or trying harder problems.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="text-4xl">
          {inProgressQuestion ? '▶️' : '👉'}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-blue-900 mb-1">
            {inProgressQuestion ? 'Continue Where You Left Off' : 'Recommended Next'}
          </h3>
          <p className="text-blue-700 text-sm mb-4">
            {inProgressQuestion
              ? `You were working on this problem${nextQuestion.hintsUsed > 0 ? ` and used ${nextQuestion.hintsUsed} hint${nextQuestion.hintsUsed > 1 ? 's' : ''}` : ''}.`
              : `${completedCount} of ${questions.length} completed. Here's a great next challenge:`}
          </p>

          <Link href={`/questions/${nextQuestion.id}`}>
            <div className="bg-white border border-blue-100 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getDifficultyColor(nextQuestion.difficulty)}`}>
                      {nextQuestion.difficulty ? nextQuestion.difficulty.charAt(0).toUpperCase() + nextQuestion.difficulty.slice(1) : 'Unknown'}
                    </span>
                    {inProgressQuestion && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        In Progress
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-lg text-gray-900 mb-1">
                    {nextQuestion.title}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    {nextQuestion.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {nextQuestion.tags.slice(0, 2).join(', ')}
                      </span>
                    )}
                    {nextQuestion.source && (
                      <span className="text-gray-500">
                        📍 {nextQuestion.source}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
