"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  BEHAVIORAL_QUESTIONS,
  QUESTION_CATEGORIES_META,
  PRIORITY_LABELS,
  getQuestionById,
  type BehavioralQuestion,
  type QuestionPriority,
} from "@/data/resume-ready/behavioral-questions";

function PriorityBadge({ priority }: { priority: QuestionPriority }) {
  const config = PRIORITY_LABELS[priority];
  const colorClasses = {
    red: "bg-red-100 text-red-800 border-red-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses[config.color]}`}
    >
      {config.label}
    </span>
  );
}

function STARSection({
  label,
  content,
  color,
  framework,
}: {
  label: string;
  content: string;
  color: string;
  framework: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    green: "bg-green-50 border-green-200 text-green-900",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
    purple: "bg-purple-50 border-purple-200 text-purple-900",
  };

  const labelColors: Record<string, string> = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`${labelColors[color]} text-white text-xs font-bold px-2 py-0.5 rounded`}
        >
          {label}
        </span>
        <span className="text-xs text-gray-500 italic">{framework}</span>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-line">{content}</p>
    </div>
  );
}

export default function QuestionDetailPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const { questionId } = use(params);
  const [isReviewed, setIsReviewed] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [userNotes, setUserNotes] = useState("");
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const question = getQuestionById(questionId);

  // Load reviewed state and notes
  useEffect(() => {
    const savedReviewed = localStorage.getItem("bq-reviewed");
    if (savedReviewed) {
      const reviewed = new Set(JSON.parse(savedReviewed));
      setIsReviewed(reviewed.has(questionId));
    }

    const savedNotes = localStorage.getItem(`bq-notes-${questionId}`);
    if (savedNotes) {
      setUserNotes(savedNotes);
    }
  }, [questionId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleReviewed = () => {
    const savedReviewed = localStorage.getItem("bq-reviewed");
    const reviewed = savedReviewed ? new Set(JSON.parse(savedReviewed)) : new Set();

    if (isReviewed) {
      reviewed.delete(questionId);
    } else {
      reviewed.add(questionId);
    }

    localStorage.setItem("bq-reviewed", JSON.stringify([...reviewed]));
    setIsReviewed(!isReviewed);
  };

  const saveNotes = (notes: string) => {
    setUserNotes(notes);
    localStorage.setItem(`bq-notes-${questionId}`, notes);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setTimer(0);
    setIsTimerRunning(false);
  };

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Question not found
        </h1>
        <Link
          href="/resume-ready/interview-prep"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to all questions
        </Link>
      </div>
    );
  }

  const categoryMeta = QUESTION_CATEGORIES_META.find(
    (c) => c.id === question.category
  );

  // Find prev/next questions
  const currentIndex = BEHAVIORAL_QUESTIONS.findIndex(
    (q) => q.id === questionId
  );
  const prevQuestion = currentIndex > 0 ? BEHAVIORAL_QUESTIONS[currentIndex - 1] : null;
  const nextQuestion =
    currentIndex < BEHAVIORAL_QUESTIONS.length - 1
      ? BEHAVIORAL_QUESTIONS[currentIndex + 1]
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link
          href="/stages/resume-ready"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Resume Ready
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <Link
          href="/resume-ready/interview-prep"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Interview Prep
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm text-gray-900">Question</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{categoryMeta?.icon}</span>
          <PriorityBadge priority={question.priority} />
          <span
            className={`px-2 py-0.5 rounded text-xs ${
              question.difficulty === "easy"
                ? "bg-green-50 text-green-700"
                : question.difficulty === "medium"
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-red-50 text-red-700"
            }`}
          >
            {question.difficulty}
          </span>
          <span className="text-sm text-gray-500">
            {question.estimatedPrepTime}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {question.question}
        </h1>

        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Mark as Reviewed */}
      <div className="mb-6">
        <button
          onClick={toggleReviewed}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isReviewed
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isReviewed ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Marked as Prepared
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Mark as Prepared
            </>
          )}
        </button>
      </div>

      {/* What They're Looking For */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>🎯</span> What Interviewers Are Looking For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {question.whatTheyreLookingFor.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* STAR Framework Guide */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span>📋</span> STAR Framework Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Structure your answer using this framework:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="font-bold text-blue-800">S - Situation</span>
              <p className="text-sm text-blue-700 mt-1">
                {question.starFramework.situation}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="font-bold text-green-800">T - Task</span>
              <p className="text-sm text-green-700 mt-1">
                {question.starFramework.task}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="font-bold text-yellow-800">A - Action</span>
              <p className="text-sm text-yellow-700 mt-1">
                {question.starFramework.action}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <span className="font-bold text-purple-800">R - Result</span>
              <p className="text-sm text-purple-700 mt-1">
                {question.starFramework.result}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Answer */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>💬</span> Example Answer
            </CardTitle>
            <button
              onClick={() => setShowExample(!showExample)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showExample ? "Hide Example" : "Show Example"}
            </button>
          </div>
        </CardHeader>
        {showExample && (
          <CardContent>
            <p className="text-sm text-gray-500 mb-4 italic">
              This example uses the Sentiment Analysis Chatbot project. Customize
              it with your own specific details and metrics.
            </p>
            <div className="space-y-4">
              <STARSection
                label="SITUATION"
                content={question.exampleAnswer.situation}
                color="blue"
                framework="Set the context"
              />
              <STARSection
                label="TASK"
                content={question.exampleAnswer.task}
                color="green"
                framework="What was your responsibility"
              />
              <STARSection
                label="ACTION"
                content={question.exampleAnswer.action}
                color="yellow"
                framework="What you did - be specific!"
              />
              <STARSection
                label="RESULT"
                content={question.exampleAnswer.result}
                color="purple"
                framework="The outcome - quantify when possible"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Pitfalls to Avoid */}
      <Card className="mb-6 border-red-200 bg-red-50/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-red-800">
            <span>⚠️</span> Pitfalls to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {question.pitfalls.map((pitfall, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                <span className="text-red-800">{pitfall}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="mb-6 border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-green-800">
            <span>💡</span> Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {question.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-green-800">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Follow-up Questions */}
      {question.followUpQuestions && question.followUpQuestions.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span>🔄</span> Common Follow-up Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {question.followUpQuestions.map((fq, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-gray-700"
                >
                  <span className="text-blue-500 mt-0.5">→</span>
                  {fq}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Practice Section */}
      <Card className="mb-6 border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
            <span>🎤</span> Practice Your Answer
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Timer */}
          <div className="flex items-center gap-4 mb-4">
            <div className="text-3xl font-mono font-bold text-purple-700">
              {formatTime(timer)}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isTimerRunning
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                {isTimerRunning ? "Pause" : "Start"}
              </button>
              <button
                onClick={resetTimer}
                className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Reset
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Target: 2-3 minutes
              {timer > 180 && (
                <span className="text-red-500 ml-2">(Too long!)</span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-2">
              Your Notes / Draft Answer
            </label>
            <textarea
              value={userNotes}
              onChange={(e) => saveNotes(e.target.value)}
              placeholder="Write your personalized answer here... Remember to use specific examples from YOUR experience!"
              className="w-full h-40 p-3 border border-purple-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-saved to your browser
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        {prevQuestion ? (
          <Link
            href={`/resume-ready/interview-prep/${prevQuestion.id}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous Question
          </Link>
        ) : (
          <div />
        )}

        <Link
          href="/resume-ready/interview-prep"
          className="text-gray-500 hover:text-gray-700"
        >
          All Questions
        </Link>

        {nextQuestion ? (
          <Link
            href={`/resume-ready/interview-prep/${nextQuestion.id}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            Next Question
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
