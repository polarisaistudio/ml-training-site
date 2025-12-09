"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface TutorialStep {
  title: string;
  duration: number; // minutes
  content: string; // markdown
}

interface InterviewQA {
  id: string;
  question: string;
  starAnswer: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  keyPoints: string[];
}

interface Project {
  id: string;
  title: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  tags: string[];
  overview: string;
  whatYouLearn: string[];
  prerequisites: string[];
  tutorialSteps: TutorialStep[];
  resumeBullets: {
    technical: string[];
    impact: string[];
    fullStack: string[];
  };
  interviewQA: InterviewQA[];
}

interface Completion {
  status: string;
  completedSteps: number[];
  reviewedQuestions: string[];
}

interface ProjectData {
  project: Project;
  completion: Completion;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800";
    case "advanced":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingStep, setTogglingStep] = useState<number | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(
          `/api/resume-ready/project-completion/${id}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  async function toggleStep(stepIndex: number) {
    if (togglingStep !== null) return;
    setTogglingStep(stepIndex);

    try {
      const response = await fetch("/api/resume-ready/toggle-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, stepIndex }),
      });

      if (response.ok) {
        const result = await response.json();
        setData((prev) =>
          prev
            ? {
                ...prev,
                completion: {
                  ...prev.completion,
                  completedSteps: result.completedSteps,
                  status: result.status,
                },
              }
            : null,
        );
      }
    } catch (err) {
      console.error("Failed to toggle step:", err);
    } finally {
      setTogglingStep(null);
    }
  }

  async function markComplete() {
    try {
      const response = await fetch("/api/resume-ready/complete-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id }),
      });

      if (response.ok) {
        setData((prev) =>
          prev
            ? {
                ...prev,
                completion: {
                  ...prev.completion,
                  status: "completed",
                  completedSteps: prev.project.tutorialSteps.map((_, i) => i),
                },
              }
            : null,
        );
      }
    } catch (err) {
      console.error("Failed to complete project:", err);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-600">
          <p>Error: {error || "Project not found"}</p>
          <Link
            href="/resume-ready/projects"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const { project, completion } = data;
  const completedSteps = completion.completedSteps || [];
  const progress = (completedSteps.length / project.tutorialSteps.length) * 100;
  const isCompleted = completion.status === "completed";
  const allStepsDone = completedSteps.length === project.tutorialSteps.length;
  const totalMinutes = project.tutorialSteps.reduce(
    (sum, step) => sum + step.duration,
    0,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          href="/resume-ready/projects"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Projects
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm text-gray-900">{project.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(project.difficulty)}`}
          >
            {project.difficulty}
          </span>
          <span className="text-sm text-gray-500">
            ~{project.estimatedHours} hours ({totalMinutes} min total)
          </span>
          {isCompleted && <Badge variant="success">Completed</Badge>}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {project.title}
        </h1>
        <p className="text-lg text-gray-600 mb-4">{project.overview}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* What You'll Learn & Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">
              What You&apos;ll Learn
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1">
              {project.whatYouLearn.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-900">
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1">
              {project.prerequisites.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {completedSteps.length}/{project.tutorialSteps.length} steps
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tutorial Steps */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tutorial Steps</h2>
        <div className="space-y-4">
          {project.tutorialSteps.map((step, index) => {
            const isStepCompleted = completedSteps.includes(index);
            const isExpanded = expandedStep === index;

            return (
              <Card
                key={index}
                className={`transition-all duration-200 ${
                  isStepCompleted
                    ? "border-green-200 bg-green-50/50"
                    : "hover:border-gray-300"
                }`}
              >
                <CardContent className="py-4">
                  {/* Step Header */}
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleStep(index)}
                      disabled={togglingStep !== null}
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isStepCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-blue-500"
                      } ${togglingStep === index ? "opacity-50" : ""}`}
                    >
                      {isStepCompleted && (
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`font-medium ${
                            isStepCompleted ? "text-green-800" : "text-gray-900"
                          }`}
                        >
                          Step {index + 1}: {step.title}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                          {step.duration} min
                        </span>
                      </div>

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() =>
                          setExpandedStep(isExpanded ? null : index)
                        }
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {isExpanded ? (
                          <>
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
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                            Hide Content
                          </>
                        ) : (
                          <>
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
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            Show Tutorial Content
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Content - Markdown (full width, outside the flex) */}
                  {isExpanded && (
                    <div className="mt-4 prose prose-sm max-w-none overflow-hidden prose-headings:text-gray-900 prose-p:text-gray-700 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:overflow-x-auto prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600">
                      <ReactMarkdown
                        components={{
                          // Custom code block styling
                          code: ({ className, children, ...props }) => {
                            const isInline = !className;
                            if (isInline) {
                              return (
                                <code
                                  className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-sm"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                          // Custom pre block for code
                          pre: ({ children }) => (
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm max-w-full">
                              {children}
                            </pre>
                          ),
                          // Custom table styling
                          table: ({ children }) => (
                            <div className="overflow-x-auto">
                              <table className="min-w-full border border-gray-200 rounded-lg">
                                {children}
                              </table>
                            </div>
                          ),
                          th: ({ children }) => (
                            <th className="px-3 py-2 bg-gray-100 text-left text-sm font-medium text-gray-700 border-b">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="px-3 py-2 text-sm text-gray-700 border-b">
                              {children}
                            </td>
                          ),
                        }}
                      >
                        {step.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      {allStepsDone && !isCompleted && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="py-6 text-center">
            <p className="text-green-800 mb-4">
              Congratulations! You&apos;ve completed all tutorial steps.
            </p>
            <button
              onClick={markComplete}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Mark Project as Complete
            </button>
          </CardContent>
        </Card>
      )}

      {/* Next Steps for Completed Projects */}
      {isCompleted && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">
              Project Completed! Next Steps:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href={`/resume-ready/projects/${id}/resume`}
                className="flex items-center gap-3 p-4 bg-white border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">📝</span>
                <div>
                  <div className="font-medium text-gray-900">
                    Resume Bullets
                  </div>
                  <div className="text-sm text-gray-500">
                    Copy professional bullet points
                  </div>
                </div>
              </Link>
              <Link
                href={`/resume-ready/projects/${id}/interview`}
                className="flex items-center gap-3 p-4 bg-white border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">��</span>
                <div>
                  <div className="font-medium text-gray-900">
                    Interview Prep
                  </div>
                  <div className="text-sm text-gray-500">
                    Practice common questions
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
