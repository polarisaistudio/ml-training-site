"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  BEHAVIORAL_QUESTIONS,
  QUESTION_CATEGORIES_META,
  PRIORITY_LABELS,
  getCriticalQuestions,
  getHighPriorityQuestions,
  type BehavioralQuestion,
  type QuestionPriority,
  type QuestionCategory,
} from "@/data/resume-ready/behavioral-questions";

type ViewMode = "priority" | "category";

function PriorityBadge({ priority }: { priority: QuestionPriority }) {
  const config = PRIORITY_LABELS[priority];
  const colorClasses = {
    red: "bg-red-100 text-red-800 border-red-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses[config.color]}`}
    >
      {config.label}
    </span>
  );
}

function DifficultyBadge({
  difficulty,
}: {
  difficulty: "easy" | "medium" | "hard";
}) {
  const colors = {
    easy: "bg-green-50 text-green-700",
    medium: "bg-yellow-50 text-yellow-700",
    hard: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${colors[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}

function QuestionCard({
  question,
  isReviewed,
  onToggleReview,
}: {
  question: BehavioralQuestion;
  isReviewed: boolean;
  onToggleReview: (id: string) => void;
}) {
  const categoryMeta = QUESTION_CATEGORIES_META.find(
    (c) => c.id === question.category
  );

  return (
    <Card
      className={`group hover:shadow-md transition-all duration-200 ${
        isReviewed ? "border-green-200 bg-green-50/30" : "hover:border-blue-200"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => onToggleReview(question.id)}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 ${
              isReviewed
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-green-400"
            }`}
          >
            {isReviewed && (
              <svg
                className="w-3.5 h-3.5"
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
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{categoryMeta?.icon}</span>
              <PriorityBadge priority={question.priority} />
              <DifficultyBadge difficulty={question.difficulty} />
              <span className="text-xs text-gray-400">
                {question.estimatedPrepTime}
              </span>
            </div>

            <Link
              href={`/resume-ready/interview-prep/${question.id}`}
              className="block group-hover:text-blue-600 transition-colors"
            >
              <h3
                className={`font-medium text-gray-900 ${isReviewed ? "line-through text-gray-500" : ""}`}
              >
                {question.question}
              </h3>
            </Link>

            {/* What they're looking for preview */}
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
              Looking for: {question.whatTheyreLookingFor.slice(0, 2).join(", ")}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {question.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <Link
            href={`/resume-ready/interview-prep/${question.id}`}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 transition-colors"
          >
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionSection({
  title,
  description,
  icon,
  questions,
  reviewedIds,
  onToggleReview,
  accentColor,
}: {
  title: string;
  description: string;
  icon?: string;
  questions: BehavioralQuestion[];
  reviewedIds: Set<string>;
  onToggleReview: (id: string) => void;
  accentColor: string;
}) {
  const reviewedCount = questions.filter((q) => reviewedIds.has(q.id)).length;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`text-sm font-medium px-3 py-1 rounded-full ${accentColor}`}
          >
            {reviewedCount}/{questions.length} prepared
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            isReviewed={reviewedIds.has(q.id)}
            onToggleReview={onToggleReview}
          />
        ))}
      </div>
    </div>
  );
}

export default function InterviewPrepPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("priority");
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  // Load reviewed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bq-reviewed");
    if (saved) {
      setReviewedIds(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save reviewed state to localStorage
  const toggleReview = (id: string) => {
    setReviewedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem("bq-reviewed", JSON.stringify([...next]));
      return next;
    });
  };

  const criticalQuestions = getCriticalQuestions();
  const highPriorityQuestions = getHighPriorityQuestions();
  const mediumQuestions = BEHAVIORAL_QUESTIONS.filter(
    (q) => q.priority === "medium"
  );

  const totalReviewed = reviewedIds.size;
  const totalQuestions = BEHAVIORAL_QUESTIONS.length;
  const progressPercent = Math.round((totalReviewed / totalQuestions) * 100);

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
        <span className="text-sm text-gray-900">Interview Prep</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Behavioral Interview Prep
        </h1>
        <p className="text-lg text-gray-600">
          Master the 10 most common behavioral questions for ML/AI engineering
          interviews. Each question includes STAR-format example answers based
          on your Sentiment Analysis project.
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
              <p className="text-sm text-gray-600">
                {totalReviewed === totalQuestions
                  ? "Amazing! You've prepared all questions!"
                  : `${totalQuestions - totalReviewed} questions left to prepare`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {totalReviewed}/{totalQuestions}
              </div>
              <div className="text-sm text-gray-500">questions prepared</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/50 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">
                {criticalQuestions.filter((q) => reviewedIds.has(q.id)).length}/
                {criticalQuestions.length}
              </div>
              <div className="text-xs text-gray-600">Critical</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-2xl font-bold text-orange-600">
                {highPriorityQuestions.filter((q) => reviewedIds.has(q.id)).length}/
                {highPriorityQuestions.length}
              </div>
              <div className="text-xs text-gray-600">High Priority</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {mediumQuestions.filter((q) => reviewedIds.has(q.id)).length}/
                {mediumQuestions.length}
              </div>
              <div className="text-xs text-gray-600">Good to Know</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-500">View by:</span>
        <div className="inline-flex rounded-lg border border-gray-200 p-1">
          <button
            onClick={() => setViewMode("priority")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === "priority"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Priority
          </button>
          <button
            onClick={() => setViewMode("category")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === "category"
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Category
          </button>
        </div>
      </div>

      {/* Questions by Priority */}
      {viewMode === "priority" && (
        <>
          <QuestionSection
            title="Critical Questions"
            description="Asked in 80%+ of interviews - prepare these first!"
            icon="🔴"
            questions={criticalQuestions}
            reviewedIds={reviewedIds}
            onToggleReview={toggleReview}
            accentColor="bg-red-100 text-red-700"
          />

          <QuestionSection
            title="High Priority"
            description="Common questions that demonstrate key skills"
            icon="🟠"
            questions={highPriorityQuestions}
            reviewedIds={reviewedIds}
            onToggleReview={toggleReview}
            accentColor="bg-orange-100 text-orange-700"
          />

          {mediumQuestions.length > 0 && (
            <QuestionSection
              title="Good to Know"
              description="Helpful to prepare but less frequently asked"
              icon="🔵"
              questions={mediumQuestions}
              reviewedIds={reviewedIds}
              onToggleReview={toggleReview}
              accentColor="bg-blue-100 text-blue-700"
            />
          )}
        </>
      )}

      {/* Questions by Category */}
      {viewMode === "category" &&
        QUESTION_CATEGORIES_META.map((category) => {
          const categoryQuestions = BEHAVIORAL_QUESTIONS.filter(
            (q) => q.category === category.id
          );
          if (categoryQuestions.length === 0) return null;

          return (
            <QuestionSection
              key={category.id}
              title={category.name}
              description={category.description}
              icon={category.icon}
              questions={categoryQuestions}
              reviewedIds={reviewedIds}
              onToggleReview={toggleReview}
              accentColor="bg-gray-100 text-gray-700"
            />
          );
        })}

      {/* Tips Card */}
      <Card className="mt-8 border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900 flex items-center gap-2">
            <span>💡</span> Pro Tips for Behavioral Interviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>
                <strong>Practice out loud</strong> - Answers sound different
                when spoken vs. read
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>
                <strong>Time yourself</strong> - Aim for 2-3 minutes per answer,
                not longer
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>
                <strong>Use specific numbers</strong> - "89% accuracy" beats
                "good accuracy"
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>
                <strong>Customize for each company</strong> - Especially "Why
                this company?" question
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>
                <strong>Be authentic</strong> - Interviewers can tell when
                you're reciting memorized answers
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Back Link */}
      <div className="mt-8 text-center">
        <Link
          href="/stages/resume-ready"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Resume Ready Dashboard
        </Link>
      </div>
    </div>
  );
}
