"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

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
  interviewQA: InterviewQA[];
}

interface ProjectData {
  project: Project;
  completion: {
    status: string;
    reviewedQuestions: string[];
  };
}

export default function InterviewPrepPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [togglingQuestion, setTogglingQuestion] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const response = await fetch(
          `/api/resume-ready/project-completion/${id}`,
        );
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  function toggleExpand(questionId: string) {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  }

  async function toggleReviewed(questionId: string) {
    if (togglingQuestion) return;
    setTogglingQuestion(questionId);

    try {
      const response = await fetch("/api/resume-ready/toggle-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, questionId }),
      });

      if (response.ok) {
        const result = await response.json();
        setData((prev) =>
          prev
            ? {
                ...prev,
                completion: {
                  ...prev.completion,
                  reviewedQuestions: result.reviewedQuestions,
                },
              }
            : null,
        );
      }
    } catch (err) {
      console.error("Failed to toggle question:", err);
    } finally {
      setTogglingQuestion(null);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Project not found</p>
          <Link
            href="/resume-ready/projects"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const { project, completion } = data;
  const reviewedQuestions = completion.reviewedQuestions || [];

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
          href={`/resume-ready/projects/${id}`}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {project.title}
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-sm text-gray-900">Interview Prep</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Interview Prep
        </h1>
        <p className="text-lg text-gray-600">
          Practice answering common interview questions about this project using
          the STAR method.
        </p>
      </div>

      {/* Progress */}
      <Card className="mb-8">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Questions Reviewed
            </span>
            <span className="text-sm text-gray-500">
              {reviewedQuestions.length}/{project.interviewQA.length}
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{
                width: `${(reviewedQuestions.length / project.interviewQA.length) * 100}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {project.interviewQA.map((qa) => {
          const isExpanded = expandedQuestions.has(qa.id);
          const isReviewed = reviewedQuestions.includes(qa.id);

          return (
            <Card
              key={qa.id}
              className={isReviewed ? "border-purple-200 bg-purple-50" : ""}
            >
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleExpand(qa.id)}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleReviewed(qa.id);
                    }}
                    disabled={togglingQuestion !== null}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      isReviewed
                        ? "bg-purple-500 border-purple-500 text-white"
                        : "border-gray-300 hover:border-purple-500"
                    } ${togglingQuestion === qa.id ? "opacity-50" : ""}`}
                  >
                    {isReviewed && (
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
                  <div className="flex-1">
                    <CardTitle
                      className={`text-lg ${isReviewed ? "text-purple-900" : ""}`}
                    >
                      {qa.question}
                    </CardTitle>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
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
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent>
                  {/* STAR Answer */}
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">
                        Situation
                      </h4>
                      <p className="text-sm text-blue-800">
                        {qa.starAnswer.situation}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">Task</h4>
                      <p className="text-sm text-green-800">
                        {qa.starAnswer.task}
                      </p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-900 mb-2">
                        Action
                      </h4>
                      <p className="text-sm text-yellow-800">
                        {qa.starAnswer.action}
                      </p>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-900 mb-2">
                        Result
                      </h4>
                      <p className="text-sm text-purple-800">
                        {qa.starAnswer.result}
                      </p>
                    </div>
                  </div>

                  {/* Key Points */}
                  {qa.keyPoints && qa.keyPoints.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Key Points to Emphasize
                      </h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                        {qa.keyPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Link
          href={`/resume-ready/projects/${id}/resume`}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Resume Bullets
        </Link>
        <Link
          href="/stages/resume-ready"
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Dashboard →
        </Link>
      </div>
    </div>
  );
}
