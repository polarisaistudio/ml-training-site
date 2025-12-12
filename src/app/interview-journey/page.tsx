import Link from "next/link";
import { demoProgress } from "@/types/progress";

export default function InterviewJourneyPage() {
  // Using demo progress for now - will be replaced with actual user progress
  const userProgress = demoProgress;

  const stages = [
    {
      id: 1,
      title: "Build Your Portfolio",
      duration: "1-2 weeks",
      status: userProgress.stage1.status,
      progress: userProgress.stage1.percentage,
      description:
        "Build impressive ML projects to showcase on your resume and discuss in interviews.",
      achievements: [
        "3 production-ready ML projects",
        "Resume bullets that get interviews",
        "Confident project presentations",
      ],
      link: "/stages/resume-ready",
      tasks: [
        {
          id: 1,
          name: "Sentiment Analysis Chatbot",
          status: userProgress.stage1.tasks.sentimentAnalysis,
          link: "/resume-ready/projects/sentiment-chatbot",
          description: "NLP project with Flask API and BERT",
        },
        {
          id: 2,
          name: "Image Classification API",
          status: userProgress.stage1.tasks.imageClassification,
          link: "/resume-ready/projects/image-classifier",
          description: "Computer vision with FastAPI and ResNet",
        },
        {
          id: 3,
          name: "Recommendation System",
          status: userProgress.stage1.tasks.recommendationSystem,
          link: null,
          description: "Coming soon",
        },
      ],
    },
    {
      id: 2,
      title: "Ace the Screening",
      duration: "1 week",
      status: userProgress.stage2.status,
      progress: userProgress.stage2.percentage,
      description:
        "Master behavioral questions and technical screening to land onsite interviews.",
      achievements: [
        "20+ behavioral questions prepared",
        "STAR format answers ready",
        "Confident storytelling skills",
      ],
      link: "/resume-ready/interview-prep",
      tasks: [],
    },
    {
      id: 3,
      title: "Master Technical Rounds",
      duration: "3-4 weeks",
      status: userProgress.stage3.status,
      progress: userProgress.stage3.percentage,
      description:
        "Deep dive into ML concepts, algorithms, and system design for technical interviews.",
      achievements: [
        "ML concepts mastered",
        "Algorithm problems solved",
        "System design practice",
      ],
      link: "/stages/technical-rounds",
      tasks: [],
    },
    {
      id: 4,
      title: "Mock Interview Practice",
      duration: "Ongoing",
      status: "locked" as const,
      progress: 0,
      description:
        "Put it all together with mock interview sets. Build interview stamina and refine your presentation.",
      achievements: [
        "Full interview simulations",
        "Timed practice sessions",
        "Interview stamina built",
      ],
      link: "/stages/mock-interview",
      tasks: [],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Interview Journey
          </h1>
          <p className="text-xl text-gray-600">
            Follow this proven 4-stage system for ML interview success
          </p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Total Duration: 6-8 weeks • Stage 1 of 4 •{" "}
            {userProgress.stage1.percentage}% Complete
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-8">
          {stages.map((stage) => {
            const isLocked = stage.status === "locked";
            const isCompleted = stage.status === "completed";
            const isInProgress = stage.status === "in-progress";

            return (
              <div
                key={stage.id}
                className={`bg-white rounded-xl shadow-lg p-8 ${
                  isLocked ? "opacity-60" : ""
                }`}
              >
                {/* Stage Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          isCompleted
                            ? "bg-green-100 text-green-600"
                            : isInProgress
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isLocked ? (
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
                        ) : isCompleted ? (
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
                        <h2 className="text-2xl font-bold text-gray-900">
                          Stage {stage.id}: {stage.title}
                        </h2>
                        <p className="text-sm text-gray-500">
                          Duration: {stage.duration} •{" "}
                          {isLocked
                            ? "Locked"
                            : isCompleted
                              ? "Completed"
                              : "In Progress"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {isInProgress && stage.progress !== undefined && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {stage.progress}%
                      </div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  )}
                </div>

                {/* Stage Description */}
                <p className="text-gray-600 mb-6">{stage.description}</p>

                {/* Achievements */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    What You&apos;ll Achieve:
                  </h3>
                  <ul className="space-y-2">
                    {stage.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress Bar (for in-progress stages) */}
                {isInProgress && stage.progress !== undefined && (
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${stage.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Tasks (for in-progress stages) */}
                {isInProgress && stage.tasks.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Tasks:</h3>
                    <div className="space-y-3">
                      {stage.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            task.status === "completed"
                              ? "bg-green-50 border border-green-200"
                              : task.status === "in-progress"
                                ? "bg-blue-50 border border-blue-200"
                                : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className="flex items-center">
                            {task.status === "completed" ? (
                              <svg
                                className="w-5 h-5 text-green-600 mr-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : task.status === "in-progress" ? (
                              <svg
                                className="w-5 h-5 text-blue-600 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  strokeWidth="2"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 text-gray-400 mr-3"
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
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {task.name}
                              </div>
                              <div
                                className={`text-sm ${
                                  task.status === "completed"
                                    ? "text-green-600"
                                    : task.status === "in-progress"
                                      ? "text-blue-600"
                                      : "text-gray-500"
                                }`}
                              >
                                {task.status === "completed"
                                  ? "Completed ✓"
                                  : task.status === "in-progress"
                                    ? task.description
                                    : task.description}
                              </div>
                            </div>
                          </div>

                          {task.link && task.status !== "locked" && (
                            <Link
                              href={task.link}
                              className={`px-4 py-2 rounded-lg font-medium ${
                                task.status === "in-progress"
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {task.status === "in-progress"
                                ? "Continue"
                                : "Review"}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  {isLocked ? (
                    <button
                      disabled
                      className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                      Complete Stage {stage.id - 1} to Unlock
                    </button>
                  ) : isInProgress ? (
                    <Link
                      href={stage.link}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
                    >
                      Continue Stage {stage.id}
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
                  ) : (
                    <Link
                      href={stage.link}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                    >
                      Review Stage {stage.id}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="text-2xl">💡</div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Pro Tip
              </h3>
              <p className="text-blue-700">
                Complete stages in order for best results, but you can always
                jump to{" "}
                <Link
                  href="/practice-library"
                  className="underline font-medium"
                >
                  Practice Library
                </Link>{" "}
                if you need specific resources right away.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
