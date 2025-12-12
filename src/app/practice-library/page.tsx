import Link from "next/link";
import { BEHAVIORAL_QUESTIONS } from "@/data/resume-ready/behavioral-questions";
import { PROJECT_TEMPLATES } from "@/data/resume-ready/project-templates";
import { ML_CODING_PROBLEMS } from "@/data/resume-ready/ml-coding-problems";

export default function PracticeLibraryPage() {
  const projectCount = Object.keys(PROJECT_TEMPLATES).length;
  const bqCount = BEHAVIORAL_QUESTIONS.length;
  const codingCount = ML_CODING_PROBLEMS.length;

  const categories = [
    {
      id: "projects",
      title: "Projects",
      icon: "📁",
      count: projectCount,
      duration: "5 hrs each",
      description:
        "Build production-ready ML projects with step-by-step guides",
      link: "/resume-ready/projects",
      color: "blue",
    },
    {
      id: "behavioral",
      title: "Behavioral Questions",
      icon: "💬",
      count: bqCount,
      duration: "2-3 min each",
      description: "Practice common interview questions with STAR framework",
      link: "/resume-ready/interview-prep",
      color: "green",
    },
    {
      id: "ml-questions",
      title: "ML Questions",
      icon: "🧠",
      count: `${15 + codingCount}`,
      duration: "5-45 min each",
      description: "ML concepts and coding problems for technical interviews",
      link: "/stages/ml-ready",
      color: "purple",
    },
    {
      id: "algorithms",
      title: "Algorithms",
      icon: "💻",
      count: 20,
      duration: "30-45 min each",
      description: "Classic coding problems and data structures",
      link: "/stages/coding-ready",
      color: "orange",
    },
    {
      id: "system-design",
      title: "System Design",
      icon: "🏗️",
      count: 0,
      duration: "45-60 min each",
      description: "Design scalable ML systems for technical interviews",
      link: "/stages/system-design-ready",
      color: "teal",
    },
    {
      id: "resources",
      title: "All Questions",
      icon: "📚",
      count: "All",
      duration: "Various",
      description: "Browse all questions across all categories",
      link: "/questions",
      color: "gray",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string }> =
      {
        blue: {
          border: "hover:border-blue-500",
          bg: "hover:bg-blue-50",
          text: "group-hover:text-blue-600",
        },
        green: {
          border: "hover:border-green-500",
          bg: "hover:bg-green-50",
          text: "group-hover:text-green-600",
        },
        purple: {
          border: "hover:border-purple-500",
          bg: "hover:bg-purple-50",
          text: "group-hover:text-purple-600",
        },
        orange: {
          border: "hover:border-orange-500",
          bg: "hover:bg-orange-50",
          text: "group-hover:text-orange-600",
        },
        teal: {
          border: "hover:border-teal-500",
          bg: "hover:bg-teal-50",
          text: "group-hover:text-teal-600",
        },
        gray: {
          border: "hover:border-gray-500",
          bg: "hover:bg-gray-50",
          text: "group-hover:text-gray-700",
        },
      };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Practice Library
          </h1>
          <p className="text-xl text-gray-600">
            All resources available anytime—practice at your own pace
          </p>
        </div>

        {/* Search (placeholder for future implementation) */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => {
            const colorClasses = getColorClasses(category.color);

            return (
              <Link
                key={category.id}
                href={category.link}
                className={`bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 group border-2 border-transparent ${colorClasses.border} ${colorClasses.bg}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
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
                </div>

                <h3
                  className={`text-xl font-bold text-gray-900 mb-2 transition-colors ${colorClasses.text}`}
                >
                  {category.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm">
                  {category.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{category.count} available</span>
                  <span>{category.duration}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Library Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {projectCount}
              </div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{bqCount}</div>
              <div className="text-sm text-gray-600">BQ Questions</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {15 + codingCount}
              </div>
              <div className="text-sm text-gray-600">ML Questions</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">20</div>
              <div className="text-sm text-gray-600">Algorithms</div>
            </div>
          </div>
        </div>

        {/* Popular Resources */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Most Practiced BQ */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🔥</span> Popular BQ Questions
            </h2>
            <div className="space-y-3">
              {BEHAVIORAL_QUESTIONS.filter((q) => q.priority === "critical")
                .slice(0, 4)
                .map((question) => (
                  <Link
                    key={question.id}
                    href={`/resume-ready/interview-prep/${question.id}`}
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 text-sm">
                      {question.question.length > 50
                        ? question.question.substring(0, 50) + "..."
                        : question.question}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {question.category} • {question.difficulty}
                    </div>
                  </Link>
                ))}
              <Link
                href="/resume-ready/interview-prep"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium pt-2"
              >
                View all {bqCount} questions →
              </Link>
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📁</span> Featured Projects
            </h2>
            <div className="space-y-3">
              {Object.values(PROJECT_TEMPLATES).map((project) => (
                <Link
                  key={project.id}
                  href={`/resume-ready/projects/${project.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900 text-sm">
                    {project.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {project.category.toUpperCase()} • {project.estimatedHours}{" "}
                    hours • {project.difficulty}
                  </div>
                </Link>
              ))}
              <Link
                href="/resume-ready/projects"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium pt-2"
              >
                View all projects →
              </Link>
            </div>
          </div>
        </div>

        {/* Journey CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">
                Prefer a Guided Approach?
              </h2>
              <p className="text-blue-100">
                Follow our structured 3-stage interview journey for best results
              </p>
            </div>
            <Link
              href="/interview-journey"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
            >
              Start Interview Journey
              <svg
                className="ml-2 w-4 h-4"
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
      </div>
    </div>
  );
}
