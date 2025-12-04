'use client';

import { useState } from 'react';
import { HintsSection } from './HintsSection';
import { AnswerSection } from './AnswerSection';
import type { Hint } from '@/lib/markdown';

interface HintsAndAnswerSectionProps {
  hints: Hint[];
  answer: string;
  questionId: number;
}

export function HintsAndAnswerSection({
  hints,
  answer,
  questionId,
}: HintsAndAnswerSectionProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  // If user clicks "Show Answer" from hints section, reveal the answer
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  return (
    <div className="hints-and-answer-section">
      {/* Always show hints section if there are hints */}
      {hints.length > 0 && !showAnswer && (
        <HintsSection
          hints={hints}
          questionId={questionId}
          onShowAnswer={handleShowAnswer}
        />
      )}

      {/* Show answer section when requested or if no hints */}
      {(showAnswer || hints.length === 0) && (
        <AnswerSection
          answer={answer}
          questionId={questionId}
        />
      )}

      {/* Back to hints button when answer is shown and hints exist */}
      {showAnswer && hints.length > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAnswer(false)}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Back to hints
          </button>
        </div>
      )}
    </div>
  );
}
