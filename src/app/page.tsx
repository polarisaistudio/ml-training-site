import Link from "next/link";
import { db, questions } from "@/db";
import { count, eq } from "drizzle-orm";
import { BEHAVIORAL_QUESTIONS } from "@/data/resume-ready/behavioral-questions";
import { PROJECT_TEMPLATES } from "@/data/resume-ready/project-templates";
import { demoProgress } from "@/types/progress";

async function getRealInterviewCount() {
  const result = await db
    .select({ count: count() })
    .from(questions)
    .where(eq(questions.sourceType, "real-interview"));
  return Number(result[0]?.count ?? 0);
}

export default async function HomePage() {
  const realInterviewCount = await getRealInterviewCount();

  // Using demo progress for now - will be replaced with actual user progress
  const userProgress = demoProgress;

  // Get counts from data files
  const projectCount = Object.keys(PROJECT_TEMPLATES).length;
  const bqCount = BEHAVIORAL_QUESTIONS.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Path to ML Engineering Offers
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your learning style: Follow the guided journey or practice at
            your own pace
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Real interview questions from 2024/2025 AI/ML interviews
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Interview Journey Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-transparent hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Interview Journey
              </h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Recommended
              </span>
            </div>

            <p className="text-gray-600 mb-6">
              Follow our proven 3-stage system optimized for fastest results
            </p>

            {/* Stage 1 Progress */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  Stage 1: Build Portfolio
                </h3>
                <span className="text-sm text-gray-600">
                  {userProgress.stage1.percentage}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${userProgress.stage1.percentage}%` }}
                />
              </div>

              <div className="space-y-2 text-sm">
                <div
                  className={`flex items-center ${
                    userProgress.stage1.tasks.sentimentAnalysis === "completed"
                      ? "text-green-600"
                      : userProgress.stage1.tasks.sentimentAnalysis ===
                          "in-progress"
                        ? "text-blue-600"
                        : "text-gray-400"
                  }`}
                >
                  {userProgress.stage1.tasks.sentimentAnalysis ===
                  "completed" ? (
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    </svg>
                  )}
                  Sentiment Analysis
                  {userProgress.stage1.tasks.sentimentAnalysis === "completed"
                    ? " (Complete)"
                    : userProgress.stage1.tasks.sentimentAnalysis ===
                        "in-progress"
                      ? " (In Progress)"
                      : ""}
                </div>
                <div
                  className={`flex items-center ${
                    userProgress.stage1.tasks.imageClassification ===
                    "completed"
                      ? "text-green-600"
                      : userProgress.stage1.tasks.imageClassification ===
                          "in-progress"
                        ? "text-blue-600"
                        : "text-gray-400"
                  }`}
                >
                  {userProgress.stage1.tasks.imageClassification ===
                  "completed" ? (
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    </svg>
                  )}
                  Image Classification
                  {userProgress.stage1.tasks.imageClassification === "completed"
                    ? " (Complete)"
                    : userProgress.stage1.tasks.imageClassification ===
                        "in-progress"
                      ? " (In Progress)"
                      : ""}
                </div>
                <div className="flex items-center text-gray-400">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  </svg>
                  Recommendation System
                </div>
              </div>
            </div>

            {/* Stage 2 & 3 Preview */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span className="text-gray-500">Stage 2: Ace Screening</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <span className="text-gray-500">Stage 3: Master Technical</span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            <Link
              href="/interview-journey"
              className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue Your Journey
              <svg
                className="inline-block ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Practice Library Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-transparent hover:border-gray-200 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Practice Library
            </h2>

            <p className="text-gray-600 mb-6">
              Access any resource instantly—perfect if you already have
              experience
            </p>

            {/* Resource Categories */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link
                href="/resume-ready/projects"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="text-2xl mb-2">📁</div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600">
                  Projects
                </div>
                <div className="text-sm text-gray-500">
                  {projectCount} available
                </div>
              </Link>

              <Link
                href="/resume-ready/interview-prep"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group"
              >
                <div className="text-2xl mb-2">💬</div>
                <div className="font-semibold text-gray-900 group-hover:text-green-600">
                  Behavioral
                </div>
                <div className="text-sm text-gray-500">{bqCount} questions</div>
              </Link>

              <Link
                href="/stages/ml-ready"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
              >
                <div className="text-2xl mb-2">🧠</div>
                <div className="font-semibold text-gray-900 group-hover:text-purple-600">
                  ML Questions
                </div>
                <div className="text-sm text-gray-500">18 questions</div>
              </Link>

              <Link
                href="/stages/coding-ready"
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <div className="text-2xl mb-2">💻</div>
                <div className="font-semibold text-gray-900 group-hover:text-orange-600">
                  Algorithms
                </div>
                <div className="text-sm text-gray-500">20 problems</div>
              </Link>
            </div>

            <Link
              href="/practice-library"
              className="block w-full bg-gray-800 text-white text-center py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Browse All Resources
              <svg
                className="inline-block ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Your Progress
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {userProgress.stats.projectsCompleted}
              </div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {userProgress.stats.bqPracticed}
              </div>
              <div className="text-sm text-gray-600">BQ Practiced</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {userProgress.stats.dayStreak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {userProgress.stats.totalHours}
              </div>
              <div className="text-sm text-gray-600">Hours Total</div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Why This Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-semibold text-gray-900">Real Questions</h3>
                <p className="text-sm text-gray-600">
                  From actual interviews, not scraped from the internet
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📅</span>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Structured Journey
                </h3>
                <p className="text-sm text-gray-600">
                  Organized by timeline, not disconnected topics
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-gray-900">Built for You</h3>
                <p className="text-sm text-gray-600">
                  By someone making the same career transition
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
