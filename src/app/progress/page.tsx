import Link from "next/link";
import { demoProgress } from "@/types/progress";

export default function ProgressPage() {
  // Using demo progress for now - will be replaced with actual user progress
  const userProgress = demoProgress;

  const stages = [
    {
      id: 1,
      title: "Build Your Portfolio",
      status: userProgress.stage1.status,
      completed: userProgress.stage1.completed,
      total: userProgress.stage1.total,
      percentage: userProgress.stage1.percentage,
      color: "blue",
    },
    {
      id: 2,
      title: "Ace the Screening",
      status: userProgress.stage2.status,
      completed: userProgress.stage2.completed,
      total: userProgress.stage2.total,
      percentage: userProgress.stage2.percentage,
      color: "green",
    },
    {
      id: 3,
      title: "Master Technical Rounds",
      status: userProgress.stage3.status,
      completed: userProgress.stage3.completed,
      total: userProgress.stage3.total,
      percentage: userProgress.stage3.percentage,
      color: "purple",
    },
  ];

  const overallProgress = Math.round(
    ((userProgress.stage1.percentage +
      userProgress.stage2.percentage +
      userProgress.stage3.percentage) /
      3) *
      100
  ) / 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Progress
          </h1>
          <p className="text-xl text-gray-600">
            Track your interview preparation journey
          </p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Overall Progress</h2>
            <div className="text-3xl font-bold text-blue-600">
              {overallProgress}%
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          {/* Stage Progress Bars */}
          <div className="space-y-4">
            {stages.map((stage) => (
              <div key={stage.id} className="flex items-center">
                <div className="w-48 text-sm font-medium text-gray-700">
                  Stage {stage.id}: {stage.title}
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        stage.status === "locked"
                          ? "bg-gray-400"
                          : stage.status === "completed"
                            ? "bg-green-500"
                            : "bg-blue-500"
                      }`}
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm text-right text-gray-600">
                  {stage.status === "locked" ? (
                    <span className="text-gray-400">Locked</span>
                  ) : (
                    `${stage.completed}/${stage.total}`
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {userProgress.stats.projectsCompleted}
            </div>
            <div className="text-gray-600">Projects Completed</div>
            <div className="mt-2 text-sm text-gray-500">
              of 3 total
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {userProgress.stats.bqPracticed}
            </div>
            <div className="text-gray-600">BQ Practiced</div>
            <div className="mt-2 text-sm text-gray-500">
              of 20 total
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {userProgress.stats.dayStreak}
            </div>
            <div className="text-gray-600">Day Streak</div>
            <div className="mt-2 text-sm text-gray-500">
              Keep it going!
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {userProgress.stats.totalHours}
            </div>
            <div className="text-gray-600">Hours Total</div>
            <div className="mt-2 text-sm text-gray-500">
              Time invested
            </div>
          </div>
        </div>

        {/* Stage Details */}
        <div className="space-y-6 mb-8">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`bg-white rounded-xl shadow p-6 ${
                stage.status === "locked" ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      stage.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : stage.status === "in-progress"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {stage.status === "locked" ? (
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    ) : stage.status === "completed" ? (
                      <svg
                        className="w-5 h-5"
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
                      <span className="font-bold">{stage.id}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Stage {stage.id}: {stage.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {stage.status === "locked"
                        ? "Locked - Complete previous stage"
                        : stage.status === "completed"
                          ? "Completed"
                          : "In Progress"}
                    </p>
                  </div>
                </div>

                {stage.status !== "locked" && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {stage.percentage}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {stage.completed} of {stage.total}
                    </div>
                  </div>
                )}
              </div>

              {stage.status !== "locked" && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      stage.status === "completed" ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/interview-journey"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
          >
            Continue Interview Journey
          </Link>
          <Link
            href="/practice-library"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center"
          >
            Browse Practice Library
          </Link>
        </div>

        {/* Note about persistence */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="text-2xl">ℹ️</div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                Demo Mode
              </h3>
              <p className="text-yellow-700 text-sm">
                This is showing demo progress data. In a future update, your
                progress will be saved automatically as you complete projects
                and practice questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
